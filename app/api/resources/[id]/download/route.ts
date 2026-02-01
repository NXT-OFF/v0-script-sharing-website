import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';
import { query } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import type { Resource, User } from '@/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  
  if (!user) {
    return NextResponse.json(
      { error: 'Vous devez etre connecte pour telecharger' },
      { status: 401 }
    );
  }

  const { id } = await params;

  try {
    // Get resource
    const resources = await query<Resource[]>(
      `SELECT * FROM resources WHERE id = ? AND is_approved = TRUE`,
      [id]
    );

    if (resources.length === 0) {
      return NextResponse.json(
        { error: 'Ressource non trouvee' },
        { status: 404 }
      );
    }

    const resource = resources[0];

    // Check user's download limit
    const users = await query<User[]>(
      `SELECT * FROM users WHERE id = ?`,
      [user.id]
    );

    const currentUser = users[0];
    const totalLimit = currentUser.download_limit + currentUser.referral_bonus;

    // Reset downloads_today if it's a new day
    await query(
      `UPDATE users 
       SET downloads_today = 0, last_download_reset = CURRENT_DATE 
       WHERE id = ? AND last_download_reset < CURRENT_DATE`,
      [user.id]
    );

    // Re-fetch to get updated downloads_today
    const updatedUsers = await query<User[]>(
      `SELECT * FROM users WHERE id = ?`,
      [user.id]
    );
    const updatedUser = updatedUsers[0];

    if (updatedUser.downloads_today >= totalLimit) {
      return NextResponse.json(
        { 
          error: 'Limite de telechargement atteinte',
          message: `Vous avez atteint votre limite de ${totalLimit} telechargements par jour. Parrainez des amis pour augmenter votre limite !`
        },
        { status: 429 }
      );
    }

    // Record download
    await query(
      `INSERT INTO downloads (id, user_id, resource_id) VALUES (UUID(), ?, ?)`,
      [user.id, id]
    );

    // Increment user's download count
    await query(
      `UPDATE users SET downloads_today = downloads_today + 1 WHERE id = ?`,
      [user.id]
    );

    // Increment resource download count
    await query(
      `UPDATE resources SET download_count = download_count + 1 WHERE id = ?`,
      [id]
    );

    // Get file
    const filePath = path.join(process.cwd(), 'public', resource.file_path);
    const fileBuffer = await readFile(filePath);
    const fileName = resource.file_path.split('/').pop();

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Content-Length': fileBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json(
      { error: 'Erreur lors du telechargement' },
      { status: 500 }
    );
  }
}
