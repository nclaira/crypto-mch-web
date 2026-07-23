import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/user";
import { getAuthUser } from "@/lib/authHelper";

function isAdmin(request: NextRequest) {
  const user = getAuthUser(request);
  return user?.role === "admin";
}

export async function GET(request: NextRequest) {
  if (!isAdmin(request))
    return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
  try {
    await connectDB();
    const users = await User.find({}, "-password").sort({ createdAt: -1 });
    return NextResponse.json({ success: true, users });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!isAdmin(request))
    return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
  try {
    await connectDB();
    const { userId } = await request.json();
    if (!userId)
      return NextResponse.json({ success: false, message: "User ID required" }, { status: 400 });
    await User.findByIdAndDelete(userId);
    return NextResponse.json({ success: true, message: "User deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
