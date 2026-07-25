import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/user";

export async function POST(request: Request) {
  try {
    const { transaction_id, userId, bookId, expectedAmount } = await request.json();

    // 1. Verify transaction with Flutterwave API
    const response = await fetch(`https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    // 2. Validate payment status and amount
    if (
      data.status === "success" &&
      data.data.status === "successful" &&
      data.data.amount >= expectedAmount
    ) {
      // 3. Update user isPaid to true in MongoDB
      await connectDB();
      await User.findOneAndUpdate(
        { username: userId },   // userId is actually the username passed from FlutterwaveButton
        { isPaid: true }
      );

      return NextResponse.json({ success: true, message: "Payment verified successfully!" });
    }

    return NextResponse.json({ success: false, message: "Payment verification failed." }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
