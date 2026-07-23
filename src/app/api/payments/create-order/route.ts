import { NextResponse } from "next/server";

// This route is not used — payments are handled by Flutterwave
export async function POST() {
  return NextResponse.json({ error: "Not implemented" }, { status: 501 });
}
