import { NextRequest, NextResponse } from "next/server";
import { checkBigbasketOffers } from "@/lib/bigbasketService";
import { BIGBASKET_TRACKERS } from "@/lib/config";

// Disable caching for this route
export const dynamic = "force-dynamic";
export const maxDuration = 60; // Max execution time in seconds for Vercel

export async function POST(request: NextRequest) {
  try {
    console.log("\n" + "═".repeat(70));
    console.log("🔔 BIGBASKET API TRIGGERED");
    console.log("⏰ Timestamp:", new Date().toISOString());
    console.log("═".repeat(70));

    // Run the BigBasket checking with config from the app
    await checkBigbasketOffers(BIGBASKET_TRACKERS);

    console.log("═".repeat(70));
    console.log("✅ BIGBASKET API COMPLETED SUCCESSFULLY");
    console.log("⏰ Timestamp:", new Date().toISOString());
    console.log("═".repeat(70) + "\n");

    return NextResponse.json({
      success: true,
      message: "BigBasket check completed",
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("\n" + "═".repeat(70));
    console.error("❌ BIGBASKET API FAILED");
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

export async function GET(request: NextRequest) {
  // Support both GET and POST for flexibility
  return POST(request);
}
