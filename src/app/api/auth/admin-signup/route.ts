import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/user";
import { sendWelcomeEmail } from "@/lib/email/welcome";
import bcrypt from "bcryptjs";

// Change this secret in your .env.local: ADMIN_SECRET=your-secret-here
const ADMIN_SECRET = process.env.ADMIN_SECRET || "mucamanza-admin-2024";

export async function POST(request: Request) {
  try {
    await connectDB();

    const { username, email, password, secretCode } = await request.json();

    // 1. Reject if secret code is wrong
    if (secretCode !== ADMIN_SECRET) {
      return NextResponse.json({ error: "Invalid secret code" }, { status: 403 });
    }

    if (!username || !email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return NextResponse.json({ error: "Email already taken" }, { status: 400 });
    }

    const hashed = await bcrypt.hash(password, 10);
    await User.create({ username, email, password: hashed, role: "admin", isPaid: true });

    // Send welcome email (non-blocking — registration still succeeds if this fails)
    const origin =
      request.headers.get("origin") ||
      request.headers.get("x-forwarded-host") ||
      process.env.NEXT_PUBLIC_APP_URL ||
      "https://crypto-mch-web.vercel.app";
    const baseUrl = origin.startsWith("http") ? origin : `https://${origin}`;

    await sendWelcomeEmail({
      to: email,
      username,
      loginUrl: `${baseUrl.replace(/\/$/, "")}/login`,
    });

    return NextResponse.json({ message: "Admin account created!" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
