"use client";
// BookCard — single resource in the Books grid
// Two tiers: "free" (preview download) | "full" (premium, paywalled)

import { BookOpen, Download, Lock } from "lucide-react";

export type Book = {
  id: number;
  title: string;
  author: string;
  tier: "free" | "full";
  cover?: string;
};

type Props = {
  book: Book;
  onAction: (book: Book) => void;
};

const BookCard = ({ book, onAction }: Props) => {
  const isFree = book.tier === "free";
  return (
    <div
      className="group rounded-2xl p-[1px] transition hover:-translate-y-1"
      style={{
        backgroundImage: isFree
          ? "linear-gradient(135deg,#9ca3af,#4b5563,#e5e7eb)"
          : "linear-gradient(135deg,#d4af37,#8a6d1f,#f3e5ab,#d4af37)",
      }}
    >
      <div className="flex h-full flex-col overflow-hidden rounded-2xl bg-[#0d1117]">
        <div className="relative flex h-40 items-center justify-center overflow-hidden bg-gradient-to-br from-black to-[#0f141c]">
          {book.cover ? (
            <img src={book.cover} alt={book.title} className="h-full w-full object-cover" />
          ) : (
            <BookOpen className="h-12 w-12 text-[#d4af37]/60" />
          )}
          <span className={`absolute right-3 top-3 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest ${
            isFree
              ? "bg-emerald-400/15 text-emerald-300 border border-emerald-400/30"
              : "bg-[#d4af37]/15 text-[#f3e5ab] border border-[#d4af37]/40"
          }`}>
            {isFree ? "Free Preview" : "Full Access"}
          </span>
        </div>
        <div className="flex flex-1 flex-col p-5">
          <h3 className="font-semibold tracking-wide text-gray-100">{book.title}</h3>
          <p className="mt-1 text-xs uppercase tracking-[0.18em] text-gray-500">by {book.author}</p>
          <button
            onClick={() => onAction(book)}
            className="mt-5 inline-flex items-center justify-center gap-2 rounded-lg border border-[#d4af37]/40 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#f3e5ab] transition hover:border-[#d4af37] hover:bg-[#d4af37]/10"
          >
            {isFree ? <Download className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
            {isFree ? "Download Preview" : "Unlock Full"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
