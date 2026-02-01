import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { query } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }

    let tickets;

    if (user.role === "admin" || user.role === "moderator") {
      // Admin/mod sees all tickets
      tickets = await query(
        `SELECT t.*, u.username, u.avatar,
         (SELECT COUNT(*) FROM ticket_messages WHERE ticket_id = t.id) as messages_count
         FROM tickets t
         JOIN users u ON t.user_id = u.id
         ORDER BY 
           CASE t.status 
             WHEN 'open' THEN 1 
             WHEN 'in_progress' THEN 2 
             WHEN 'resolved' THEN 3 
             ELSE 4 
           END,
           t.priority DESC,
           t.updated_at DESC`
      );
    } else {
      // User sees only their tickets
      tickets = await query(
        `SELECT t.*,
         (SELECT COUNT(*) FROM ticket_messages WHERE ticket_id = t.id) as messages_count
         FROM tickets t
         WHERE t.user_id = ?
         ORDER BY t.updated_at DESC`,
        [user.id]
      );
    }

    return NextResponse.json({ tickets });
  } catch (error) {
    console.error("Error fetching tickets:", error);
    return NextResponse.json(
      { error: "Erreur lors de la recuperation des tickets" },
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

    const { subject, category, priority, message, resourceSlug } =
      await request.json();

    if (!subject || !category || !message) {
      return NextResponse.json(
        { error: "Champs obligatoires manquants" },
        { status: 400 }
      );
    }

    // Create ticket
    const ticketResult = await query(
      `INSERT INTO tickets (user_id, subject, category, priority, status, resource_slug, created_at, updated_at)
       VALUES (?, ?, ?, ?, 'open', ?, NOW(), NOW())`,
      [user.id, subject, category, priority || "medium", resourceSlug || null]
    );

    const ticketId = (ticketResult as { insertId: number }).insertId;

    // Add first message
    await query(
      `INSERT INTO ticket_messages (ticket_id, user_id, message, is_admin, created_at)
       VALUES (?, ?, ?, 0, NOW())`,
      [ticketId, user.id, message]
    );

    return NextResponse.json({
      success: true,
      message: "Ticket cree avec succes",
      ticketId,
    });
  } catch (error) {
    console.error("Error creating ticket:", error);
    return NextResponse.json(
      { error: "Erreur lors de la creation du ticket" },
      { status: 500 }
    );
  }
}
