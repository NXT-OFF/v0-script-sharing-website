import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { query } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const comments = await query(
      `SELECT c.*, u.username, u.avatar, u.role
       FROM comments c
       JOIN users u ON c.user_id = u.id
       WHERE c.resource_id = ?
       ORDER BY c.created_at DESC`,
      [id]
    );

    return NextResponse.json({ comments });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Erreur lors de la recuperation des commentaires" },
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
    const { content, parentId } = await request.json();

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: "Contenu du commentaire manquant" },
        { status: 400 }
      );
    }

    if (content.length > 1000) {
      return NextResponse.json(
        { error: "Commentaire trop long (max 1000 caracteres)" },
        { status: 400 }
      );
    }

    const result = await query(
      `INSERT INTO comments (resource_id, user_id, content, parent_id, created_at)
       VALUES (?, ?, ?, ?, NOW())`,
      [id, user.id, content.trim(), parentId || null]
    );

    return NextResponse.json({
      success: true,
      message: "Commentaire ajoute",
      commentId: (result as { insertId: number }).insertId,
    });
  } catch (error) {
    console.error("Error adding comment:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'ajout du commentaire" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const commentId = searchParams.get("commentId");

    if (!commentId) {
      return NextResponse.json(
        { error: "ID de commentaire manquant" },
        { status: 400 }
      );
    }

    // Check if user owns the comment or is admin
    const comment = await query("SELECT user_id FROM comments WHERE id = ?", [
      commentId,
    ]);

    if (!Array.isArray(comment) || comment.length === 0) {
      return NextResponse.json(
        { error: "Commentaire non trouve" },
        { status: 404 }
      );
    }

    const commentUserId = (comment[0] as { user_id: string }).user_id;

    if (commentUserId !== user.id && user.role !== "admin") {
      return NextResponse.json(
        { error: "Non autorise a supprimer ce commentaire" },
        { status: 403 }
      );
    }

    await query("DELETE FROM comments WHERE id = ?", [commentId]);

    return NextResponse.json({
      success: true,
      message: "Commentaire supprime",
    });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression du commentaire" },
      { status: 500 }
    );
  }
}
