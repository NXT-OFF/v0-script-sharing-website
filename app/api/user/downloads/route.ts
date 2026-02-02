import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Non autorise' }, { status: 401 });
    }

    const downloads = await query<any[]>(
      `SELECT d.*, r.title, r.slug, r.category, r.thumbnail
       FROM downloads d
       JOIN resources r ON d.resource_id = r.id
       WHERE d.user_id = ?
       ORDER BY d.downloaded_at DESC
       LIMIT 50`,
      [user.id]
    );

    return NextResponse.json({ downloads });
  } catch (error) {
    console.error('Error fetching download history:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
