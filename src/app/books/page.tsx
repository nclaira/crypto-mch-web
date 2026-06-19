"use client";
// =============================================================
// Books Page — /books
// =============================================================
// Shows all books in the library using the BookCard component.
// Each book is either "free" (preview) or "full" (paid).
//
// HOW TO ADD A NEW BOOK:
//   Add a new object to the `catalog` array below.
//   tier: "free"  = anyone can download a preview
//   tier: "full"  = only paid members can download
// =============================================================

import { useState } from "react";
import BookCard, { Book } from "@/components/BookCard";       // Reusable book card
import PaywallModal from "@/components/PaywallModal";         // Access denied popup
import Footer from "@/components/Footer";
import { useCryptoAuth } from "@/lib/auth";
import { downloadBook } from "@/lib/api";

// ---------------------------------------------------------------
// BOOK CATALOG — ADD YOUR NEW BOOKS HERE
// ---------------------------------------------------------------
const catalog: Book[] = [
  { id: 1, title: "Crypto Market Microstructure",  author: "M. Mucamanza",       tier: "full" },
  { id: 2, title: "Forex Macro Playbook",           author: "Institutional Desk", tier: "full" },
  { id: 3, title: "On-Chain Signal Architecture",   author: "Mucamanza Labs",     tier: "full" },
  { id: 4, title: "Basic Crypto — Free Preview",    author: "Mucamanza Edu",      tier: "free" },
  { id: 5, title: "Basic Forex — Free Preview",     author: "Mucamanza Edu",      tier: "free" },
  { id: 6, title: "Risk & Position Sizing 101",     author: "Mucamanza Edu",      tier: "free" },

  // ✏️ ADD A NEW BOOK HERE — copy and fill in:
  // { id: 7, title: "Your Book Title", author: "Author Name", tier: "full" },
];

export default function BooksPage() {
  const { user } = useCryptoAuth();

  // When paywall has a value, the PaywallModal popup opens
  const [paywall, setPaywall] = useState<string | null>(null);

  // Runs when a user clicks Download or Unlock on a BookCard
  const handleAction = async (book: Book) => {
    if (book.tier === "free") {
      // Free book — download a preview from the backend
      const res = await downloadBook("preview", `${book.title}.pdf`);
      if (!res.ok && (res.status === 401 || res.status === 403)) {
        setPaywall(book.title); // Backend blocked it — show paywall
      }
      return;
    }

    // Full book — only paid users can access
    if (!user || !user.isPaid) {
      setPaywall(book.title);
      return;
    }

    const res = await downloadBook("full", `${book.title}.pdf`);
    if (!res.ok && (res.status === 401 || res.status === 403)) {
      setPaywall(book.title);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-white">
      <div className="mx-auto max-w-7xl px-4 py-20">

        {/* Page heading */}
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-[#d4af37]">Library</p>
          <h1 className="mt-3 text-4xl font-bold md:text-5xl">
            <span className="bg-gradient-to-r from-[#f3e5ab] via-[#d4af37] to-[#f3e5ab] bg-clip-text text-transparent">
              Premium Resources
            </span>
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-gray-400">
            Gold border = paid full access. Silver border = free preview.
          </p>
        </div>

        {/* Book grid — renders one BookCard per book in the catalog */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {catalog.map((book) => (
            <BookCard key={book.id} book={book} onAction={handleAction} />
          ))}
        </div>
      </div>

      {/* Paywall popup — opens when a non-paid user tries to access a full book */}
      <PaywallModal
        open={!!paywall}
        onClose={() => setPaywall(null)}
        resourceName={paywall || undefined}
      />

      <Footer />
    </div>
  );
}
