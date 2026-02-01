import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { query } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }

    const { id } = await params;

    // Get ticket
    const ticketResult = await query(
      `SELECT t.*, u.username, u.avatar
       FROM tickets t
       JOIN users u ON t.user_id = u.id
       WHERE t.id = ?`,
      [id]
    );

    if (!Array.isArray(ticketResult) || ticketResult.length === 0) {
      return NextResponse.json(
        { error: "Ticket non trouve" },
        { status: 404 }
      );
    }

    const ticket = ticketResult[0] as {
      user_id: string;
      [key: string]: unknown;
    };

    // Check access
    if (
      ticket.user_id !== user.id &&
      user.role !== "admin" &&
      user.role !== "moderator"
    ) {
      return NextResponse.json(
        { error: "Acces non autorise" },
        { status: 403 }
      );
    }

    // Get messages
    const messages = await query(
      `SELECT tm.*, u.username, u.avatar, u.role
       FROM ticket_messages tm
       JOIN users u ON tm.user_id = u.id
       WHERE tm.ticket_id = ?
       ORDER BY tm.created_at ASC`,
      [id]
    );

    return NextResponse.json({ ticket, messages });
  } catch (error) {
    console.error("Error fetching ticket:", error);
    return NextResponse.json(
      { error: "Erreur lors de la recuperation du ticket" },
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

    if (!user) {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }

    const { id } = await params;
    const { status, message } = await request.json();

    // Get ticket
    const ticketResult = await query("SELECT user_id FROM tickets WHERE id = ?", [
      id,
    ]);

    if (!Array.isArray(ticketResult) || ticketResult.length === 0) {
      return NextResponse.json(
        { error: "Ticket non trouve" },
        { status: 404 }
      );
    }

    const ticket = ticketResult[0] as { user_id: string };

    // Check access
    const isOwner = ticket.user_id === user.id;
    const isStaff = user.role === "admin" || user.role === "moderator";

    if (!isOwner && !isStaff) {
      return NextResponse.json(
        { error: "Acces non autorise" },
        { status: 403 }
      );
    }

    // Update status if provided (staff only)
    if (status && isStaff) {
      await query(
        "UPDATE tickets SET status = ?, updated_at = NOW() WHERE id = ?",
        [status, id]
      );
    }

    // Add message if provided
    if (message && message.trim()) {
      await query(
        `INSERT INTO ticket_messages (ticket_id, user_id, message, is_admin, created_at)
         VALUES (?, ?, ?, ?, NOW())`,
        [id, user.id, message.trim(), isStaff ? 1 : 0]
      );

      // Update ticket status to in_progress if it was open and staff replied
      if (isStaff) {
        await query(
          `UPDATE tickets SET status = 'in_progress', updated_at = NOW() 
           WHERE id = ? AND status = 'open'`,
          [id]
        );
      }

      await query("UPDATE tickets SET updated_at = NOW() WHERE id = ?", [id]);
    }

    return NextResponse.json({
      success: true,
      message: "Ticket mis a jour",
    });
  } catch (error) {
    console.error("Error updating ticket:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise a jour du ticket" },
      { status: 500 }
    );
  }
}
