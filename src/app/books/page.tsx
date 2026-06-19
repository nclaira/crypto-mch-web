"use client";
// =============================================================
// Books Page — /books
// =============================================================
// This page shows all the books in the library.
// Each book has a "tier": "free" or "full"
//   - free  → anyone can download a preview
//   - full  → only paid users can download the full book
//
// HOW TO ADD A NEW BOOK:
//   Just add a new object to the `catalog` array below.
//   Copy the format of the existing ones.
//   Set tier: "free" for free previews, tier: "full" for paid books.
// =============================================================

import { useState } from "react";
import Link from "next/link";
import { BookOpen, Lock, Download } from "lucide-react";
import { useCryptoAuth } from "@/lib/auth";
import { downloadBook } from "@/lib/api";
import Footer from "@/components/Footer";

// ---------------------------------------------------------------
// BOOK CATALOG — ADD YOUR NEW BOOKS HERE
// Each book needs: id, title, author, category, tier
// tier: "free"  = anyone can download a 5-page preview
// tier: "full"  = only paid members can download the full book
// ---------------------------------------------------------------
const catalog = [
  { id: 1, title: "Crypto Market Microstructure",  author: "M. Mucamanza",       category: "Crypto Trading", tier: "full" as const },
  { id: 2, title: "Forex Macro Playbook",           author: "Institutional Desk", category: "Forex Trading",  tier: "full" as const },
  { id: 3, title: "On-Chain Signal Architecture",   author: "Mucamanza Labs",     category: "Crypto Trading", tier: "full" as const },
  { id: 4, title: "Basic Crypto — Free Preview",    author: "Mucamanza Edu",      category: "Basic Crypto",   tier: "free" as const },
  { id: 5, title: "Basic Forex — Free Preview",     author: "Mucamanza Edu",      category: "Basic Forex",    tier: "free" as const },
  { id: 6, title: "Risk & Position Sizing 101",     author: "Mucamanza Edu",      category: "Basic Crypto",   tier: "free" as const },

  // ✏️  WANT TO ADD A NEW BOOK? Copy the line below and fill it in:
  // { id: 7, title: "Your Book Title", author: "Author Name", category: "Crypto Trading", tier: "full" },
];

export default function BooksPage() {
  // Get the logged-in user from the global auth context
  const { user } = useCryptoAuth();

  // paywall stores the name of the book the user tried to access
  // when it has a value, the paywall popup appears
  const [paywall, setPaywall] = useState<string | null>(null);

  // This function runs when someone clicks Download or Unlock
  const handleAction = async (book: typeof catalog[0]) => {

    if (book.tier === "free") {
      // Free book — try to download a preview from the backend
      const res = await downloadBook("preview", `${book.title}.pdf`);
      if (!res.ok && (res.status === 401 || res.status === 403)) {
        setPaywall(book.title); // Backend blocked it — show paywall
      }
      return;
    }

    // Full book — check if user is logged in and has paid
    if (!user || !user.isPaid) {
      setPaywall(book.title); // Not paid — show paywall popup
      return;
    }

    // User is paid — download the full book
    const res = await downloadBook("full", `${book.title}.pdf`);
    if (!res.ok && (res.status === 401 || res.status === 403)) {
      setPaywall(book.title);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-white">

      {/* Page heading */}
      <div className="mx-auto max-w-7xl px-4 py-20">
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

        {/* Book grid — one card per book in the catalog array */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {catalog.map((book) => (
            <div
              key={book.id}
              // Gold border for paid books, silver for free
              className={`rounded-2xl p-[1px] ${
                book.tier === "full"
                  ? "bg-gradient-to-br from-[#d4af37] via-[#8a6d1f] to-[#f3e5ab]"
                  : "bg-gradient-to-br from-gray-500 via-gray-600 to-gray-400"
              }`}
            >
              <div className="flex h-full flex-col justify-between rounded-2xl bg-[#0d1117] p-6">
                <div>
                  {/* Category badge */}
                  <span className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] uppercase tracking-widest text-gray-400">
                    {book.category}
                  </span>

                  {/* Book icon + title */}
                  <div className="mt-4 flex items-start gap-3">
                    <BookOpen className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#d4af37]" />
                    <div>
                      <h3 className="font-semibold text-gray-100">{book.title}</h3>
                      <p className="mt-1 text-xs text-gray-500">{book.author}</p>
                    </div>
                  </div>
                </div>

                {/* Download / Unlock button */}
                <button
                  onClick={() => handleAction(book)}
                  className="mt-6 flex items-center justify-center gap-2 rounded-xl border border-[#d4af37]/30 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#f3e5ab] transition hover:border-[#d4af37] hover:bg-[#d4af37]/10"
                >
                  {book.tier === "full" ? (
                    <><Lock className="h-3 w-3" /> Unlock Full Book</>
                  ) : (
                    <><Download className="h-3 w-3" /> Download Preview</>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Paywall popup — appears when a guest or free user tries to access a paid book */}
      {paywall && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-sm rounded-2xl border border-[#d4af37]/30 bg-[#0d1117] p-8 text-center">
            <Lock className="mx-auto h-8 w-8 text-[#d4af37]" />
            <h2 className="mt-4 text-lg font-bold text-[#f3e5ab]">Full Access Required</h2>
            <p className="mt-2 text-sm text-gray-400">
              Purchase a membership to unlock <strong className="text-gray-200">{paywall}</strong>.
            </p>
            <div className="mt-6 flex gap-3 justify-center">
              <Link
                href="/signup"
                className="rounded-lg bg-gradient-to-r from-[#d4af37] to-[#f3e5ab] px-5 py-2 text-sm font-semibold text-black"
              >
                Get Access
              </Link>
              <button
                onClick={() => setPaywall(null)}
                className="rounded-lg border border-white/10 px-5 py-2 text-sm text-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
