"use client";
// =============================================================
// Categories Page — /categories
// =============================================================
// Shows all learning tracks using the CategoryCard component.
//
// HOW TO ADD A NEW CATEGORY:
//   Add a new object to the `categories` array below.
//   isPaid: true  = requires paid membership
//   isPaid: false = free preview for everyone
// =============================================================

import { useState } from "react";
import CategoryCard from "@/components/CategoryCard";         // Reusable category card
import PaywallModal from "@/components/PaywallModal";         // Access denied popup
import Footer from "@/components/Footer";
import { useCryptoAuth } from "@/lib/auth";
import { downloadBook } from "@/lib/api";

// ---------------------------------------------------------------
// CATEGORIES LIST — ADD NEW CATEGORIES HERE
// ---------------------------------------------------------------
const categories = [
  {
    id: 1,
    title: "Crypto Trading",
    description: "Order flow, on-chain analytics, market structure, and institutional risk frameworks.",
    isPaid: true,
    priceOrInfo: "Full Access — Members Only",
    actionLabel: "Unlock",
  },
  {
    id: 2,
    title: "Forex Trading",
    description: "Macro narratives, session theory, pair correlation, and precision execution strategies.",
    isPaid: true,
    priceOrInfo: "Full Access — Members Only",
    actionLabel: "Unlock",
  },
  {
    id: 3,
    title: "Basic Crypto",
    description: "Free 3-page primer covering wallets, blockchains, exchanges, and self-custody basics.",
    isPaid: false,
    priceOrInfo: "Free Preview — 3 pages",
    actionLabel: "Download",
  },
  {
    id: 4,
    title: "Basic Forex",
    description: "Free essentials: pips, leverage, lot sizes, trading sessions, and order types.",
    isPaid: false,
    priceOrInfo: "Free Preview",
    actionLabel: "Download",
  },

  // ✏️ ADD A NEW CATEGORY HERE — copy and fill in:
  // {
  //   id: 5,
  //   title: "Your New Category",
  //   description: "Short description of what this category covers.",
  //   isPaid: true,
  //   priceOrInfo: "Full Access — Members Only",
  //   actionLabel: "Unlock",
  // },
];

export default function CategoriesPage() {
  const { user } = useCryptoAuth();

  // When paywall has a value, the PaywallModal popup opens
  const [paywall, setPaywall] = useState<string | null>(null);

  // Called when a user clicks Unlock on a paid category
  const handlePaid = (name: string) => {
    if (!user || !user.isPaid) {
      setPaywall(name); // Not paid — show the paywall popup
      return;
    }
    window.location.href = "/books"; // Paid user — go to books
  };

  // Called when a user clicks Download on a free category
  const handleFreePreview = async (label: string) => {
    const filename = `${label.toLowerCase().replace(/\s+/g, "-")}-preview.pdf`;
    const res = await downloadBook("preview", filename);
    if (!res.ok && (res.status === 401 || res.status === 403)) {
      setPaywall(label);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-white">
      <div className="mx-auto max-w-7xl px-4 py-20">

        {/* Page heading */}
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

        {/* Category cards grid — renders one CategoryCard per item above */}
        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {categories.map((cat) => (
            <CategoryCard
              key={cat.id}
              title={cat.title}
              description={cat.description}
              isPaid={cat.isPaid}
              priceOrInfo={cat.priceOrInfo}
              actionLabel={cat.actionLabel}
              onAction={() =>
                cat.isPaid ? handlePaid(cat.title) : handleFreePreview(cat.title)
              }
            />
          ))}
        </div>
      </div>

      {/* Paywall popup */}
      <PaywallModal
        open={!!paywall}
        onClose={() => setPaywall(null)}
        resourceName={paywall || undefined}
      />

      <Footer />
    </div>
  );
}
