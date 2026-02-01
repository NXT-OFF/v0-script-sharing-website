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

  if (error) {
    return NextResponse.redirect(`${SITE_URL}/?error=auth_denied`);
  }

  if (!code) {
    return NextResponse.redirect(`${SITE_URL}/?error=no_code`);
  }

  try {
    // Exchange code for token
    const accessToken = await getDiscordToken(code);
    
    // Get Discord user info
    const discordUser = await getDiscordUser(accessToken);
    
    // Check if user exists
    const existingUsers = await query<User[]>(
      `SELECT * FROM users WHERE discord_id = ?`,
      [discordUser.id]
    );

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
    await createSession(userId);

    // Redirect to dashboard
    return NextResponse.redirect(`${SITE_URL}/dashboard`);
  } catch (err) {
    console.error('Discord auth error:', err);
    return NextResponse.redirect(`${SITE_URL}/?error=auth_failed`);
  }
}
