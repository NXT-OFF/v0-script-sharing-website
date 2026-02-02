import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Non autorise' }, { status: 401 });
    }

    const uploads = await query<any[]>(
      `SELECT r.*, 
        (SELECT AVG(rating) FROM ratings WHERE resource_id = r.id) as rating
       FROM resources r
       WHERE r.author_id = ?
       ORDER BY r.created_at DESC`,
      [user.id]
    );

    return NextResponse.json({ uploads });
  } catch (error) {
    console.error('Error fetching user uploads:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
