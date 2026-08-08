import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/user";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("Paypack webhook received:", body);

    // Paypack sends event type and transaction data
    const { event, data } = body;

    // Only process successful cashin events
    if (event !== "transaction:cashin" || data?.status !== "successful") {
      return NextResponse.json({ received: true });
    }

    const bookId = data?.metadata?.bookId;
    const phone = data?.client;  // phone number used to pay

    if (!bookId || !phone) {
      console.error("Webhook missing bookId or phone:", body);
      return NextResponse.json({ received: true });
    }

    await connectDB();

    // Find user by phone or by any identifier available
    // Push bookId into purchasedBookIds if not already there
    await User.findOneAndUpdate(
      { $or: [{ phone }, { username: data?.metadata?.username }] },
      { $addToSet: { purchasedBookIds: bookId } }
    );

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ received: true }); // always return 200 to Paypack
  }
}
