import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { query } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Non autorise" }, { status: 401 });
    }

    const config = await query("SELECT * FROM site_config");

    // Convert to object
    const configObject: Record<string, string | number | boolean> = {};
    if (Array.isArray(config)) {
      for (const row of config as { key: string; value: string }[]) {
        // Parse value based on type
        if (row.value === "true" || row.value === "false") {
          configObject[row.key] = row.value === "true";
        } else if (!isNaN(Number(row.value))) {
          configObject[row.key] = Number(row.value);
        } else {
          configObject[row.key] = row.value;
        }
      }
    }

    return NextResponse.json({ config: configObject });
  } catch (error) {
    console.error("Error fetching config:", error);
    return NextResponse.json(
      { error: "Erreur lors de la recuperation de la configuration" },
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

    const config = await request.json();

    // Update each config value
    for (const [key, value] of Object.entries(config)) {
      const stringValue = String(value);

      await query(
        `INSERT INTO site_config (\`key\`, value, updated_at) 
         VALUES (?, ?, NOW())
         ON DUPLICATE KEY UPDATE value = ?, updated_at = NOW()`,
        [key, stringValue, stringValue]
      );
    }

    return NextResponse.json({
      success: true,
      message: "Configuration mise a jour",
    });
  } catch (error) {
    console.error("Error updating config:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise a jour de la configuration" },
      { status: 500 }
    );
  }
}
