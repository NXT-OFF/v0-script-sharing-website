import { cookies } from 'next/headers';
import { query } from './db';
import type { User, Session } from '@/types';
import crypto from 'crypto';

const SESSION_COOKIE_NAME = 'fivem_hub_session';
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

export function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export async function createSession(userId: string): Promise<string> {
  const token = generateToken();
  const expiresAt = new Date(Date.now() + SESSION_DURATION);
  
  await query(
    `INSERT INTO sessions (id, user_id, token, expires_at) VALUES (UUID(), ?, ?, ?)`,
    [userId, token, expiresAt]
  );
  
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: expiresAt,
    path: '/',
  });
  
  return token;
}

export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  
  if (!token) return null;
  
  const sessions = await query<Session[]>(
    `SELECT s.*, u.* FROM sessions s
     JOIN users u ON s.user_id = u.id
     WHERE s.token = ? AND s.expires_at > NOW()`,
    [token]
  );
  
  if (sessions.length === 0) return null;
  
  return sessions[0];
}

export async function getCurrentUser(): Promise<User | null> {
  const session = await getSession();
  if (!session) return null;
  
  const users = await query<User[]>(
    `SELECT * FROM users WHERE id = ?`,
    [session.user_id]
  );
  
  return users[0] || null;
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  
  if (token) {
    await query(`DELETE FROM sessions WHERE token = ?`, [token]);
  }
  
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function isAdmin(): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.role === 'admin';
}

export async function isModerator(): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.role === 'admin' || user?.role === 'moderator';
}

export function generateReferralCode(): string {
  return crypto.randomBytes(4).toString('hex').toUpperCase();
}

// Discord OAuth configuration
const SITE_URL = 'https://fivehub.playahosting.fr';

export const discordConfig = {
  clientId: process.env.DISCORD_CLIENT_ID!,
  clientSecret: process.env.DISCORD_CLIENT_SECRET!,
  redirectUri: `${SITE_URL}/api/auth/discord/callback`,
  scopes: ['identify', 'email'],
};

export function getDiscordAuthUrl(): string {
  const params = new URLSearchParams({
    client_id: discordConfig.clientId,
    redirect_uri: discordConfig.redirectUri,
    response_type: 'code',
    scope: discordConfig.scopes.join(' '),
  });
  
  return `https://discord.com/api/oauth2/authorize?${params.toString()}`;
}
