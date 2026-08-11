import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { User } from "@/models/user";

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json();

    if (!token || !password)
      return NextResponse.json({ error: "Token and password are required" }, { status: 400 });

    if (password.length < 6)
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });

    await connectDB();

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: new Date() }, // token must not be expired
    });

    if (!user)
      return NextResponse.json({ error: "Invalid or expired reset link" }, { status: 400 });

    const hashed = await bcrypt.hash(password, 10);

    // Update password only — purchasedBookIds and everything else stays untouched
    await User.findByIdAndUpdate(user._id, {
      password: hashed,
      resetToken: null,
      resetTokenExpiry: null,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
