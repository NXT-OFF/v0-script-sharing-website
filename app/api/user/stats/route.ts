import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Non autorise' }, { status: 401 });
    }

    // Get total downloads by user
    const downloads = await query<{ count: number }[]>(
      `SELECT COUNT(*) as count FROM downloads WHERE user_id = ?`,
      [user.id]
    );

    // Get total uploads by user
    const uploads = await query<{ count: number }[]>(
      `SELECT COUNT(*) as count FROM resources WHERE author_id = ?`,
      [user.id]
    );

    // Get referrals count
    const referrals = await query<{ count: number }[]>(
      `SELECT COUNT(*) as count FROM users WHERE referred_by = ?`,
      [user.id]
    );

    return NextResponse.json({
      total_downloads: downloads[0]?.count || 0,
      total_uploads: uploads[0]?.count || 0,
      referrals_count: referrals[0]?.count || 0,
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
