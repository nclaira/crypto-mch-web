import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { phone, amount } = await request.json();

  console.log("Paypack cashin attempt:", { phone, amount });

  // 1. Authenticate
  const authRes = await fetch("https://payments.paypack.rw/api/auth/agents/authorize", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: process.env.PAYPACK_CLIENT_ID,
      client_secret: process.env.PAYPACK_CLIENT_SECRET,
    }),
  });

  const authData = await authRes.json();
  console.log("Paypack auth response:", authData);

  const access_token = authData?.access;

  if (!access_token) {
    return NextResponse.json({ success: false, error: "Authentication failed: " + JSON.stringify(authData) }, { status: 400 });
  }

  // 2. Trigger cashin
  const cashinRes = await fetch("https://payments.paypack.rw/api/transactions/cashin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token}`,
    },
    body: JSON.stringify({ number: phone, amount }),
  });

  const cashinData = await cashinRes.json();
  console.log("Paypack cashin response:", cashinData);

  if (!cashinRes.ok) {
    return NextResponse.json(
      { success: false, error: cashinData.message || JSON.stringify(cashinData) },
      { status: 400 }
    );
  }

  return NextResponse.json({
    success: true,
    ref: cashinData.ref,
  });
}
