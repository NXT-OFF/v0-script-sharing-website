import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { query } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const ratings = await query(
      `SELECT r.*, u.username, u.avatar
       FROM ratings r
       JOIN users u ON r.user_id = u.id
       WHERE r.resource_id = ?
       ORDER BY r.created_at DESC`,
      [id]
    );

    // Calculate average
    const avgResult = await query(
      `SELECT AVG(rating) as average, COUNT(*) as count
       FROM ratings WHERE resource_id = ?`,
      [id]
    );

    const stats = Array.isArray(avgResult) && avgResult.length > 0
      ? avgResult[0] as { average: number; count: number }
      : { average: 0, count: 0 };

    return NextResponse.json({
      ratings,
      average: stats.average ? parseFloat(stats.average.toFixed(1)) : 0,
      count: stats.count || 0,
    });
  } catch (error) {
    console.error("Error fetching ratings:", error);
    return NextResponse.json(
      { error: "Erreur lors de la recuperation des notes" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }

    const { id } = await params;
    const { rating, review } = await request.json();

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Note invalide (doit etre entre 1 et 5)" },
        { status: 400 }
      );
    }

    // Check if user already rated
    const existing = await query(
      "SELECT id FROM ratings WHERE user_id = ? AND resource_id = ?",
      [user.id, id]
    );

    if (Array.isArray(existing) && existing.length > 0) {
      // Update existing rating
      await query(
        `UPDATE ratings SET rating = ?, review = ?, updated_at = NOW()
         WHERE user_id = ? AND resource_id = ?`,
        [rating, review || null, user.id, id]
      );

      // Update resource average rating
      await updateResourceRating(id);

      return NextResponse.json({
        success: true,
        message: "Note mise a jour",
      });
    }

    // Create new rating
    await query(
      `INSERT INTO ratings (resource_id, user_id, rating, review, created_at)
       VALUES (?, ?, ?, ?, NOW())`,
      [id, user.id, rating, review || null]
    );

    // Update resource average rating
    await updateResourceRating(id);

    return NextResponse.json({
      success: true,
      message: "Note ajoutee",
    });
  } catch (error) {
    console.error("Error adding rating:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'ajout de la note" },
      { status: 500 }
    );
  }
}

async function updateResourceRating(resourceId: string) {
  const result = await query(
    `SELECT AVG(rating) as average, COUNT(*) as count
     FROM ratings WHERE resource_id = ?`,
    [resourceId]
  );

  if (Array.isArray(result) && result.length > 0) {
    const stats = result[0] as { average: number; count: number };
    await query(
      `UPDATE resources SET rating = ?, reviews_count = ? WHERE id = ?`,
      [stats.average || 0, stats.count || 0, resourceId]
    );
  }
}
