"use client";

import { BookOpen, Lock, Download } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCryptoAuth } from "@/lib/auth";
import DownloadButton from "@/components/DownloadButton";

export type Book = {
  id: string;
  title: string;
  author: string;
  tier: "free" | "full";
  cover?: string;
  fileUrl?: string;   // free preview file
  pdfUrl?: string;    // full paid file
  price?: number;     // price in RWF — used by Paypack checkout
};

type Props = {
  book: Book;
  onAction: (book: Book) => void; // opens paywall modal
};

const BookCard = ({ book, onAction }: Props) => {
  const { user } = useCryptoAuth();
  const router = useRouter();
  const isFree = book.tier === "free";

  // User has access to THIS specific book
  const hasAccess = user?.purchasedBookIds?.includes(String(book.id)) || user?.role === "admin";

  const handleUnlockClick = () => {
    // Not logged in → send to login
    if (!user) {
      router.push("/login");
      return;
    }
    // Logged in but not paid → open paywall/payment modal
    onAction(book);
  };

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

        {/* Cover */}
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

        {/* Info */}
        <div className="flex flex-1 flex-col p-5">
          <h3 className="font-semibold tracking-wide text-gray-100">{book.title}</h3>
          <p className="mt-1 text-xs uppercase tracking-[0.18em] text-gray-500">by {book.author}</p>
          {!isFree && book.price && (
            <p className="mt-1 text-sm font-semibold text-[#d4af37]">RWF {book.price.toLocaleString()}</p>
          )}

          <div className="mt-5">
            {isFree ? (
              // Free book — direct download
              book.fileUrl ? (
                <DownloadButton
                  fileUrl={book.fileUrl}
                  title={book.title}
                  label="Download Preview"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-emerald-400/40 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300 transition hover:bg-emerald-400/10"
                />
              ) : (
                <span className="text-xs text-gray-500">No file available</span>
              )
            ) : hasAccess && book.pdfUrl ? (
              // Paid user — show download button for the full PDF
              <a
                href={book.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#d4af37] py-2 text-xs font-semibold uppercase tracking-[0.18em] text-black transition hover:scale-[1.02]"
              >
                <Download className="h-3.5 w-3.5" />
                Download Full PDF
              </a>
            ) : (
              // Not paid or not logged in — show unlock button
              <button
                onClick={handleUnlockClick}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[#d4af37]/40 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#f3e5ab] transition hover:border-[#d4af37] hover:bg-[#d4af37]/10"
              >
                <Lock className="h-3.5 w-3.5" />
                {!user ? "Login to Unlock" : "Unlock Full"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
