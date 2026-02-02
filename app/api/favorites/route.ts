import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { query } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }

    const favorites = await query(
      `SELECT f.*, r.title, r.slug, r.category, r.thumbnail, r.downloads,
        (SELECT AVG(rating) FROM ratings WHERE resource_id = r.id) as rating
       FROM favorites f
       JOIN resources r ON f.resource_id = r.id
       WHERE f.user_id = ?
       ORDER BY f.created_at DESC`,
      [user.id]
    );

    return NextResponse.json({ favorites });
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return NextResponse.json(
      { error: "Erreur lors de la recuperation des favoris" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }

    const { resourceId } = await request.json();

    if (!resourceId) {
      return NextResponse.json(
        { error: "ID de ressource manquant" },
        { status: 400 }
      );
    }

    // Check if already favorited
    const existing = await query(
      "SELECT id FROM favorites WHERE user_id = ? AND resource_id = ?",
      [user.id, resourceId]
    );

    if (Array.isArray(existing) && existing.length > 0) {
      // Remove favorite
      await query(
        "DELETE FROM favorites WHERE user_id = ? AND resource_id = ?",
        [user.id, resourceId]
      );

      return NextResponse.json({
        success: true,
        action: "removed",
        message: "Favori supprime",
      });
    }

    // Add favorite
    await query(
      "INSERT INTO favorites (id, user_id, resource_id, created_at) VALUES (UUID(), ?, ?, NOW())",
      [user.id, resourceId]
    );

    return NextResponse.json({
      success: true,
      action: "added",
      message: "Favori ajoute",
    });
  } catch (error) {
    console.error("Error toggling favorite:", error);
    return NextResponse.json(
      { error: "Erreur lors de la modification du favori" },
      { status: 500 }
    );
  }
}
