import { NextRequest, NextResponse } from "next/server";
import { checkStock } from "@/lib/tracker";

// Disable caching for this route
export const dynamic = "force-dynamic";
export const maxDuration = 60; // Max execution time in seconds for Vercel

export async function GET(request: NextRequest) {
  try {
    console.log("\n" + "═".repeat(70));
    console.log("🔔 CRON JOB TRIGGERED");
    console.log("⏰ Timestamp:", new Date().toISOString());
    console.log("═".repeat(70));

    // Security: Check for CRON_SECRET if configured
    const cronSecret = process.env.CRON_SECRET;
    if (cronSecret) {
      const authHeader = request.headers.get("authorization");
      const providedSecret = authHeader?.replace("Bearer ", "");

      if (providedSecret !== cronSecret) {
        console.error("❌ CRON JOB FAILED: Unauthorized access attempt");
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      console.log("✅ Authorization successful");
    } else {
      console.log("⚠️ No CRON_SECRET configured - running without auth");
    }

    // Run the stock checking
    await checkStock();

    console.log("═".repeat(70));
    console.log("✅ CRON JOB COMPLETED SUCCESSFULLY");
    console.log("⏰ Timestamp:", new Date().toISOString());
    console.log("═".repeat(70) + "\n");

    return NextResponse.json({
      success: true,
      message: "Stock check completed",
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("\n" + "═".repeat(70));
    console.error("❌ CRON JOB FAILED");
    console.error("⏰ Timestamp:", new Date().toISOString());
    console.error("Error:", error);
    console.error("═".repeat(70) + "\n");
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  // Support both GET and POST for flexibility
  return GET(request);
}
