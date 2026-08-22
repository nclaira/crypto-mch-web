"use client";

import { useState, useEffect } from "react";
import BookCard, { Book } from "@/components/BookCard";
import PaywallModal from "@/components/PaywallModal";
import Footer from "@/components/Footer";
import { useCryptoAuth } from "@/lib/auth";



export default function BooksPage() {
  const { user } = useCryptoAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  useEffect(() => {
    fetch("/api/admin/books")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setBooks(
            data.books.map((b: any) => ({
              id: b._id,                              // MongoDB _id as string
              title: b.title,
              author: b.author,
              tier: b.accessType === "Free" ? "free" : "full",
              fileUrl: b.previewUrl || b.pdfUrl,      // free preview file
              pdfUrl: b.pdfUrl,                       // full paid file
              price: b.price,                         // RWF price from admin
            }))
          );
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Called when a full-tier book's unlock button is clicked
  const handleAction = (book: Book) => {
    setSelectedBook(book);
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:py-20">

        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-[#d4af37]">Library</p>
          <h1 className="mt-3 text-3xl font-bold sm:text-4xl md:text-5xl">
            <span className="bg-gradient-to-r from-[#f3e5ab] via-[#d4af37] to-[#f3e5ab] bg-clip-text text-transparent">
              Premium Resources
            </span>
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-gray-400">
            Gold border = paid full access. Silver border = free preview.
          </p>
        </div>

        {loading ? (
          <p className="mt-16 text-center text-gray-400">Loading library...</p>
        ) : books.length === 0 ? (
          <p className="mt-16 text-center text-gray-400">No books published yet.</p>
        ) : (
          <div className="mt-12 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {books.map((book) => (
              <BookCard key={book.id} book={book} onAction={handleAction} />
            ))}
          </div>
        )}
      </div>

      {/* Pass the full selected book so PaywallModal can read price and id */}
      <PaywallModal
        open={!!selectedBook}
        onClose={() => setSelectedBook(null)}
        book={selectedBook}
      />

      <Footer />
    </div>
  );
}
