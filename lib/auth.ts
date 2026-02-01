import { cookies } from 'next/headers';
import { query } from './db';
import type { User } from '@/types';
import crypto from 'crypto';

const SESSION_COOKIE_NAME = 'session';
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

export function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

interface SessionData {
  userId: string;
  exp: number;
}

export async function createSession(userId: string): Promise<string> {
  // This function is now handled directly in the callback
  // Keeping it for compatibility
  return userId;
}

export async function getSessionData(): Promise<SessionData | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    
    if (!sessionCookie) {
      return null;
    }
    
    const decoded = JSON.parse(Buffer.from(sessionCookie, 'base64').toString('utf-8')) as SessionData;
    
    if (decoded.exp < Date.now()) {
      return null;
    }
    
    return decoded;
  } catch {
    return null;
  }
}

export async function getCurrentUser(): Promise<User | null> {
  const session = await getSessionData();
  if (!session) {
    return null;
  }
  
  try {
    const users = await query<User[]>(
      `SELECT * FROM users WHERE id = ?`,
      [session.userId]
    );
    
    return users[0] || null;
  } catch {
    return null;
  }
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
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
