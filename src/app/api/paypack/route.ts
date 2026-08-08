import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { phone, amount, bookId } = await request.json();

  // 1. Authenticate with Paypack
  const authRes = await fetch("https://payments.paypack.rw/api/auth/agents/authorize", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: process.env.PAYPACK_CLIENT_ID,
      client_secret: process.env.PAYPACK_CLIENT_SECRET,
    }),
  });

  const authData = await authRes.json();
  const access_token = authData?.access;

  if (!access_token) {
    console.error("Paypack auth failed:", authData);
    return NextResponse.json({ success: false, error: "Authentication failed" }, { status: 400 });
  }

  // 2. Trigger cashin — include bookId in metadata if supported
  const cashinRes = await fetch("https://payments.paypack.rw/api/transactions/cashin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token}`,
    },
    body: JSON.stringify({ number: phone, amount, metadata: { bookId } }),
  });

  const cashinData = await cashinRes.json();

  if (!cashinRes.ok) {
    console.error("Paypack cashin failed:", cashinData);
    return NextResponse.json(
      { success: false, error: cashinData.message || "Payment trigger failed" },
      { status: 400 }
    );
  }

  return NextResponse.json({ success: true, ref: cashinData.ref, bookId });
}
