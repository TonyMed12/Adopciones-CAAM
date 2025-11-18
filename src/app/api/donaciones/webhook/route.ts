import { NextResponse } from "next/server";

export async function POST(req: Request) {
  console.log("Webhook recibido");
  return NextResponse.json({ received: true });
}

export async function GET() {
  return NextResponse.json({ status: "ok" });
}
