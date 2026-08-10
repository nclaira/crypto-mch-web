import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/user";

export async function POST(request: NextRequest) {
  const { ref, bookId, username } = await request.json();

  if (!ref) {
    return NextResponse.json({ success: false, error: "Missing ref" }, { status: 400 });
  }

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
    return NextResponse.json({ success: false, error: "Auth failed" }, { status: 400 });
  }

  // 2. Fetch recent events and find the one matching our ref
  const eventsRes = await fetch(
    "https://payments.paypack.rw/api/events/transactions?limit=20&offset=0",
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
    }
  );

  const eventsData = await eventsRes.json();
  const transactions = eventsData?.transactions ?? [];

  const match = transactions.find(
    (t: any) => t.data?.ref === ref && t.event_kind === "transaction:processed"
  );

  if (!match) {
    return NextResponse.json({ success: true, paid: false, status: "pending" });
  }

  const status = match.data?.status;
  const paid = status === "successful";

  // 3. If paid, permanently save bookId to user's purchasedBookIds in DB
  if (paid && bookId && username) {
    try {
      await connectDB();
      await User.findOneAndUpdate(
        { username },
        { $addToSet: { purchasedBookIds: bookId } }
      );
    } catch (err) {
      console.error("Failed to save purchasedBookId:", err);
    }
  }

  return NextResponse.json({ success: true, paid, status });
}
