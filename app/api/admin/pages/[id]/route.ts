import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { query } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const pages = await query("SELECT * FROM pages WHERE id = ? OR slug = ?", [
      id,
      id,
    ]);

    if (!Array.isArray(pages) || pages.length === 0) {
      return NextResponse.json(
        { error: "Page non trouvee" },
        { status: 404 }
      );
    }

    return NextResponse.json({ page: pages[0] });
  } catch (error) {
    console.error("Error fetching page:", error);
    return NextResponse.json(
      { error: "Erreur lors de la recuperation de la page" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const updates: string[] = [];
    const values: (string | number)[] = [];

    if (body.title !== undefined) {
      updates.push("title = ?");
      values.push(body.title);
    }
    if (body.slug !== undefined) {
      updates.push("slug = ?");
      values.push(body.slug);
    }
    if (body.content !== undefined) {
      updates.push("content = ?");
      values.push(body.content);
    }
    if (body.isPublished !== undefined) {
      updates.push("is_published = ?");
      values.push(body.isPublished ? 1 : 0);
    }
    if (body.showInNav !== undefined) {
      updates.push("show_in_nav = ?");
      values.push(body.showInNav ? 1 : 0);
    }
    if (body.order !== undefined) {
      updates.push("`order` = ?");
      values.push(body.order);
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { error: "Aucun champ a mettre a jour" },
        { status: 400 }
      );
    }

    updates.push("updated_at = NOW()");
    values.push(id);

    await query(`UPDATE pages SET ${updates.join(", ")} WHERE id = ?`, values);

    return NextResponse.json({
      success: true,
      message: "Page mise a jour",
    });
  } catch (error) {
    console.error("Error updating page:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise a jour de la page" },
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

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }

    const { id } = await params;

    await query("DELETE FROM pages WHERE id = ?", [id]);

    return NextResponse.json({
      success: true,
      message: "Page supprimee",
    });
  } catch (error) {
    console.error("Error deleting page:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression de la page" },
      { status: 500 }
    );
  }
}
