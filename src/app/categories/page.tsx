"use client";
// =============================================================
// Categories Page — /categories
// =============================================================
// This page shows all the learning tracks (categories).
// Each category is either paid (Full Access) or free (Preview).
//
// HOW TO ADD A NEW CATEGORY:
//   Find the `categories` array below and add a new object.
//   Copy the format of the existing ones.
//   Set paid: true  → users must purchase to access
//   Set paid: false → anyone can download a free preview
// =============================================================

import { useState } from "react";
import Link from "next/link";
import { Lock, Download, ChevronRight } from "lucide-react";
import { useCryptoAuth } from "@/lib/auth";
import { downloadBook } from "@/lib/api";
import Footer from "@/components/Footer";

// ---------------------------------------------------------------
// CATEGORIES LIST — ADD NEW CATEGORIES HERE
// Each category needs: id, title, description, paid, info
// paid: true  = requires paid membership
// paid: false = free preview available for everyone
// ---------------------------------------------------------------
const categories = [
  {
    id: 1,
    title: "Crypto Trading",
    description: "Order flow, on-chain analytics, market structure, and institutional risk frameworks.",
    paid: true,
    info: "Full Access — Members Only",
  },
  {
    id: 2,
    title: "Forex Trading",
    description: "Macro narratives, session theory, pair correlation, and precision execution strategies.",
    paid: true,
    info: "Full Access — Members Only",
  },
  {
    id: 3,
    title: "Basic Crypto",
    description: "Free 3-page primer covering wallets, blockchains, exchanges, and self-custody basics.",
    paid: false,
    info: "Free Preview — 3 pages",
  },
  {
    id: 4,
    title: "Basic Forex",
    description: "Free essentials: pips, leverage, lot sizes, trading sessions, and order types.",
    paid: false,
    info: "Free Preview",
  },

  // ✏️  WANT TO ADD A NEW CATEGORY? Copy the block below and fill it in:
  // {
  //   id: 5,
  //   title: "Your New Category",
  //   description: "Short description of what this category covers.",
  //   paid: true,
  //   info: "Full Access — Members Only",
  // },
];

export default function CategoriesPage() {
  // Get the logged-in user from the global auth context
  const { user } = useCryptoAuth();

  // paywall stores the category name the user tried to access
  // when it has a value, the paywall popup appears
  const [paywall, setPaywall] = useState<string | null>(null);

  // Called when a user clicks "Unlock" on a paid category
  const handlePaid = (name: string) => {
    if (!user || !user.isPaid) {
      setPaywall(name); // Not paid — show the paywall popup
      return;
    }
    // Paid user — send them to the books page
    window.location.href = "/books";
  };

  // Called when a user clicks "Download" on a free category
  const handleFreePreview = async (label: string) => {
    const filename = `${label.toLowerCase().replace(/\s+/g, "-")}-preview.pdf`;
    const res = await downloadBook("preview", filename);
    if (!res.ok && (res.status === 401 || res.status === 403)) {
      setPaywall(label); // Backend blocked it — show paywall
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-white">

      {/* Page heading */}
      <div className="mx-auto max-w-7xl px-4 py-20">
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-[#d4af37]">Curriculum</p>
          <h1 className="mt-3 text-4xl font-bold md:text-5xl">
            <span className="bg-gradient-to-r from-[#f3e5ab] via-[#d4af37] to-[#f3e5ab] bg-clip-text text-transparent">
              Choose Your Track
            </span>
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-gray-400">
            Free previews are open to everyone. Premium tracks unlock the full Mucamanza vault.
          </p>
        </div>

        {/* Category cards grid */}
        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {categories.map((cat) => (
            <div
              key={cat.id}
              // Gold border for paid, silver for free
              className={`rounded-2xl p-[1px] ${
                cat.paid
                  ? "bg-gradient-to-br from-[#d4af37] via-[#8a6d1f] to-[#f3e5ab]"
                  : "bg-gradient-to-br from-gray-500 via-gray-600 to-gray-400"
              }`}
            >
              <div className="flex h-full flex-col justify-between rounded-2xl bg-[#0d1117] p-7">
                <div>
                  {/* Paid / Free badge */}
                  <span className={`text-[10px] uppercase tracking-[0.3em] ${cat.paid ? "text-[#d4af37]" : "text-gray-400"}`}>
                    {cat.info}
                  </span>

                  {/* Title */}
                  <h2 className="mt-3 text-xl font-bold text-gray-100">{cat.title}</h2>

                  {/* Description */}
                  <p className="mt-2 text-sm leading-relaxed text-gray-400">{cat.description}</p>
                </div>

                {/* Action button */}
                <button
                  onClick={() => cat.paid ? handlePaid(cat.title) : handleFreePreview(cat.title)}
                  className={`mt-6 flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold uppercase tracking-[0.18em] transition ${
                    cat.paid
                      ? "bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#d4af37] text-black hover:scale-[1.02]"
                      : "border border-[#d4af37]/30 text-[#f3e5ab] hover:border-[#d4af37] hover:bg-[#d4af37]/10"
                  }`}
                >
                  {cat.paid ? (
                    <><Lock className="h-4 w-4" /> Unlock Track <ChevronRight className="h-4 w-4" /></>
                  ) : (
                    <><Download className="h-4 w-4" /> Download Free Preview</>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Paywall popup — shown when a non-paid user tries to access a paid category */}
      {paywall && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-sm rounded-2xl border border-[#d4af37]/30 bg-[#0d1117] p-8 text-center">
            <Lock className="mx-auto h-8 w-8 text-[#d4af37]" />
            <h2 className="mt-4 text-lg font-bold text-[#f3e5ab]">Premium Access Required</h2>
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
