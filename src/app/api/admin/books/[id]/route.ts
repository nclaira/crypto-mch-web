import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Book from "@/models/book";
import { getAuthUser } from "@/lib/authHelper";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = getAuthUser(request);
  if (user?.role !== "admin") {
    return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
  }

  try {
    const { id } = await params;
    await connectDB();
    const body = await request.json();

    // Only allow known editable fields — avoid wiping urls with empty strings
    const updates: Record<string, unknown> = {};
    if (typeof body.title === "string") updates.title = body.title;
    if (typeof body.author === "string") updates.author = body.author;
    if (typeof body.category === "string") updates.category = body.category;
    if (typeof body.accessType === "string") updates.accessType = body.accessType;
    if (typeof body.type === "string") updates.type = body.type;
    if (typeof body.price === "number") updates.price = body.price;
    if (typeof body.description === "string") updates.description = body.description;
    if (typeof body.previewUrl === "string" && body.previewUrl) updates.previewUrl = body.previewUrl;
    if (typeof body.pdfUrl === "string" && body.pdfUrl) updates.pdfUrl = body.pdfUrl;

    const book = await Book.findByIdAndUpdate(id, updates, { new: true });
    if (!book) {
      return NextResponse.json({ success: false, error: "Book not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, book });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Update failed";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
