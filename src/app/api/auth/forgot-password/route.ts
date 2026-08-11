import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/db";
import { User } from "@/models/user";
import { Resend } from "resend";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    if (!email) return NextResponse.json({ error: "Email is required" }, { status: 400 });

    await connectDB();
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) return NextResponse.json({ success: true });

    const token = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 60 * 60 * 1000);

    await User.findByIdAndUpdate(user._id, {
      resetToken: token,
      resetTokenExpiry: expiry,
    });

    const origin = request.headers.get("origin") 
      || request.headers.get("x-forwarded-host")
      || process.env.NEXT_PUBLIC_APP_URL 
      || "https://crypto-mch-web.vercel.app";

    const baseUrl = origin.startsWith("http") ? origin : `https://${origin}`;
    const resetUrl = `${baseUrl}/reset-password?token=${token}`;

    // Initialize Resend inside the function to avoid build-time errors
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Reset your password — Mucamanza Crypto Hub",
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;background:#0d1117;color:#e5e7eb;padding:32px;border-radius:16px;">
          <h2 style="color:#d4af37;margin-bottom:8px;">Password Reset</h2>
          <p style="color:#9ca3af;font-size:14px;">You requested a password reset for your Mucamanza Crypto Hub account.</p>
          <p style="color:#9ca3af;font-size:14px;">Click the button below to set a new password. This link expires in <strong style="color:#f3e5ab;">1 hour</strong>.</p>
          <a href="${resetUrl}" style="display:inline-block;margin:24px 0;padding:12px 28px;background:linear-gradient(135deg,#d4af37,#f3e5ab);color:#000;font-weight:700;border-radius:10px;text-decoration:none;font-size:14px;">
            Reset My Password
          </a>
          <p style="color:#6b7280;font-size:12px;">If you didn't request this, you can safely ignore this email. Your purchased books and account remain untouched.</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
