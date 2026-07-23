import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Book from "@/models/book";
import { getAuthUser } from "@/lib/authHelper";

function isAdmin(request: NextRequest) {
  const user = getAuthUser(request);
  return user?.role === "admin";
}

export async function GET() {
  // GET is public — users need to see the book list
  try {
    await connectDB();
    const books = await Book.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, books });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!isAdmin(request))
    return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
  try {
    await connectDB();
    const body = await request.json();
    const book = await Book.create(body);
    return NextResponse.json({ success: true, book });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!isAdmin(request))
    return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
  try {
    await connectDB();
    const { bookId } = await request.json();
    await Book.findByIdAndDelete(bookId);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
