import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Book from "@/models/book";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();

    const book = await Book.findById(id);

    if (!book) {
      return NextResponse.json(
        { success: false, message: "Book not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      pdfUrl: book.pdfUrl,
      title: book.title,
      price: book.price,
    });

  } catch {
    return NextResponse.json(
      { success: false, message: "Book not found" },
      { status: 404 }
    );
  }
}
