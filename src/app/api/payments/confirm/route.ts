import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { parse } from "cookie";
import { connectDB } from "@/lib/db";
import { User } from "@/models/user";

const SECRET = process.env.JWT_SECRET || "my_super_secret_offline_key";

export async function POST(request: NextRequest) {
  try {
    // 1. Get the logged-in user from their JWT cookie
    const cookieHeader = request.headers.get("cookie") || "";
    const cookies = parse(cookieHeader);
    const token = cookies.token;

    if (!token) {
      return NextResponse.json({ success: false, error: "Not logged in" }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, SECRET);
    const { bookId } = await request.json();

    await connectDB();

    // 2. Mark user as paid and add book to their purchased list
    const updated = await User.findByIdAndUpdate(
      decoded.userId,
      {
        isPaid: true,
        $addToSet: { purchasedBooks: bookId },
      },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
