import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { query } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const pages = await query(
      `SELECT id, title, slug, is_published, show_in_nav, \`order\`, created_at, updated_at
       FROM pages ORDER BY \`order\` ASC`
    );

    return NextResponse.json({ pages });
  } catch (error) {
    console.error("Error fetching pages:", error);
    return NextResponse.json(
      { error: "Erreur lors de la recuperation des pages" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }

    const { title, slug, content, isPublished, showInNav } = await request.json();

    if (!title || !slug) {
      return NextResponse.json(
        { error: "Titre et slug obligatoires" },
        { status: 400 }
      );
    }

    // Check if slug exists
    const existing = await query("SELECT id FROM pages WHERE slug = ?", [slug]);

    if (Array.isArray(existing) && existing.length > 0) {
      return NextResponse.json(
        { error: "Ce slug existe deja" },
        { status: 400 }
      );
    }

    // Get max order
    const orderResult = await query(
      "SELECT MAX(`order`) as max_order FROM pages"
    );
    const maxOrder =
      Array.isArray(orderResult) && orderResult.length > 0
        ? ((orderResult[0] as { max_order: number }).max_order || 0) + 1
        : 1;

    const result = await query(
      `INSERT INTO pages (title, slug, content, is_published, show_in_nav, \`order\`, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [title, slug, content || "", isPublished ? 1 : 0, showInNav ? 1 : 0, maxOrder]
    );

    return NextResponse.json({
      success: true,
      message: "Page creee",
      pageId: (result as { insertId: number }).insertId,
    });
  } catch (error) {
    console.error("Error creating page:", error);
    return NextResponse.json(
      { error: "Erreur lors de la creation de la page" },
      { status: 500 }
    );
  }
}
