import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { createSession, discordConfig, generateReferralCode } from '@/lib/auth';
import type { User } from '@/types';

const SITE_URL = 'https://fivehub.playahosting.fr';

interface DiscordUser {
  id: string;
  username: string;
  email: string;
  avatar: string;
}

async function getDiscordToken(code: string): Promise<string> {
  const response = await fetch('https://discord.com/api/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: discordConfig.clientId,
      client_secret: discordConfig.clientSecret,
      grant_type: 'authorization_code',
      code,
      redirect_uri: discordConfig.redirectUri,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to get Discord token');
  }

  const data = await response.json();
  return data.access_token;
}

async function getDiscordUser(accessToken: string): Promise<DiscordUser> {
  const response = await fetch('https://discord.com/api/users/@me', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to get Discord user');
  }

  return response.json();
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  console.log('[v0] Discord callback - code:', code ? 'present' : 'missing', 'error:', error);

  if (error) {
    console.log('[v0] Auth denied by user');
    return NextResponse.redirect(`${SITE_URL}/?error=auth_denied`);
  }

  if (!code) {
    console.log('[v0] No code provided');
    return NextResponse.redirect(`${SITE_URL}/?error=no_code`);
  }

  try {
    console.log('[v0] Exchanging code for token...');
    // Exchange code for token
    const accessToken = await getDiscordToken(code);
    console.log('[v0] Got access token');
    
    // Get Discord user info
    const discordUser = await getDiscordUser(accessToken);
    console.log('[v0] Got Discord user:', discordUser.username);
    
    // Check if user exists
    console.log('[v0] Checking database for user...');
    const existingUsers = await query<User[]>(
      `SELECT * FROM users WHERE discord_id = ?`,
      [discordUser.id]
    );
    console.log('[v0] Existing users found:', existingUsers.length);

    let userId: string;

    if (existingUsers.length > 0) {
      // Update existing user
      userId = existingUsers[0].id;
      await query(
        `UPDATE users SET 
          username = ?, 
          email = ?, 
          avatar = ?,
          updated_at = NOW()
        WHERE id = ?`,
        [
          discordUser.username,
          discordUser.email,
          discordUser.avatar 
            ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`
            : null,
          userId,
        ]
      );
    } else {
      // Create new user
      const referralCode = generateReferralCode();
      const result = await query<{ insertId: string }>(
        `INSERT INTO users (id, discord_id, username, email, avatar, referral_code)
         VALUES (UUID(), ?, ?, ?, ?, ?)`,
        [
          discordUser.id,
          discordUser.username,
          discordUser.email,
          discordUser.avatar 
            ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`
            : null,
          referralCode,
        ]
      );
      
      // Get the newly created user
      const newUsers = await query<User[]>(
        `SELECT * FROM users WHERE discord_id = ?`,
        [discordUser.id]
      );
      userId = newUsers[0].id;
    }

    // Create session
    console.log('[v0] Creating session for user:', userId);
    const response = NextResponse.redirect(`${SITE_URL}/dashboard`);
    
    // Set session cookie directly on the response
    const sessionToken = Buffer.from(JSON.stringify({ userId, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 })).toString('base64');
    response.cookies.set('session', sessionToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });
    
    console.log('[v0] Session cookie set, redirecting to dashboard');
    return response;
  } catch (err) {
    console.error('[v0] Discord auth error:', err);
    return NextResponse.redirect(`${SITE_URL}/?error=auth_failed`);
  }
}
