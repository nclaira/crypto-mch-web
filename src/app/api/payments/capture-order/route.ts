import { NextResponse } from "next/server";

// PayPal not used — payments handled by Flutterwave
export async function POST() {
  return NextResponse.json({ error: "Not implemented" }, { status: 501 });
}
