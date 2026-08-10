"use client";

import { Lock, X, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";
import PaypackButton from "@/components/PaypackButton";
import { useCryptoAuth } from "@/lib/auth";
import { Book } from "@/components/BookCard";

type Props = {
  open: boolean;
  onClose: () => void;
  book?: Book | null;          // full book object — used from books page
  resourceName?: string;       // fallback name — used from other pages
};

const PaywallModal = ({ open, onClose, book, resourceName }: Props) => {
  const { user } = useCryptoAuth();

  if (!open) return null;

  const displayName = book?.title || resourceName || "Mucamanza Crypto Premium";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 sm:p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-2xl p-[1px] shadow-[0_0_60px_-10px_rgba(212,175,55,0.45)] mx-2 sm:mx-0"
        style={{ backgroundImage: "linear-gradient(135deg,#d4af37,#f3e5ab,#9ca3af,#d4af37)" }}
      >
        <div className="rounded-2xl bg-[#0d1117] p-5 sm:p-8 text-center">

          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-[#d4af37] transition"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#d4af37] to-[#8a6d1f] shadow-lg shadow-[#d4af37]/30">
            <Lock className="h-7 w-7 text-black" />
          </div>

          <h2 className="text-2xl font-bold tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-[#f3e5ab] via-[#d4af37] to-[#f3e5ab]">
            {user ? "Unlock Full Access" : "Login Required"}
          </h2>

          <p className="mt-3 text-sm leading-relaxed text-gray-300">
            {user
              ? <>Purchase <span className="text-[#f3e5ab] font-semibold">{displayName}</span> to get lifetime pdf access.</>
              : "You need to log in or create an account before purchasing."
            }
          </p>

          <ul className="mt-5 space-y-2 text-left text-sm text-gray-300">
            <li className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-[#d4af37]" /> Full Crypto & Forex eBooks</li>
            <li className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-[#d4af37]" /> lifetime pdf downloads</li>
            <li className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-[#d4af37]" /> Premium signal community</li>
          </ul>

          <div className="mt-7">
            {!user ? (
              <div className="flex gap-3">
                <Link href="/login" onClick={onClose}
                  className="flex-1 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#d4af37] py-3 text-sm font-semibold text-black transition hover:scale-[1.01]">
                  Login
                </Link>
                <Link href="/signup" onClick={onClose}
                  className="flex-1 rounded-xl border border-[#d4af37]/40 py-3 text-sm font-semibold text-[#f3e5ab] transition hover:border-[#d4af37]">
                  Sign Up
                </Link>
              </div>
            ) : (
              <PaypackButton
                amount={book?.price ?? 5000}
                bookId={book ? String(book.id) : displayName}
              />
            )}
          </div>

          <button onClick={onClose}
            className="mt-4 text-xs uppercase tracking-[0.2em] text-gray-500 hover:text-gray-300">
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaywallModal;
