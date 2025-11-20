import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "ecommerce-tracker",
    timestamp: new Date().toISOString(),
    message: "Tracking bot is active and ready!",
  });
}

