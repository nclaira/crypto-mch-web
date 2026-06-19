"use client";
// CategoryCard — premium gold-bordered category tile
// Used on Home + Categories pages.

import { ReactNode } from "react";
import { Lock, Unlock, ArrowUpRight } from "lucide-react";

type Props = {
  title: string;
  description: string;
  isPaid: boolean;         // true = premium gated; false = free "Allowed"
  priceOrInfo: string;
  onAction: () => void;    // delegated to page (paywall check / download / route)
  actionLabel: string;
  icon?: ReactNode;
};

const CategoryCard = ({ title, description, isPaid, priceOrInfo, onAction, actionLabel, icon }: Props) => {
  return (
    <div
      className="group relative rounded-2xl p-[1px] transition duration-500 hover:-translate-y-1"
      style={{
        backgroundImage: isPaid
          ? "linear-gradient(135deg,#d4af37,#8a6d1f,#f3e5ab,#d4af37)"
          : "linear-gradient(135deg,#9ca3af,#4b5563,#e5e7eb,#9ca3af)",
      }}
    >
      <div className="relative h-full rounded-2xl bg-[#0d1117] p-6">
        {/* Badge */}
        <div className="mb-5 flex items-center justify-between">
          <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${
            isPaid
              ? "bg-gradient-to-br from-[#d4af37] to-[#8a6d1f] text-black shadow-[0_0_25px_-5px_rgba(212,175,55,0.6)]"
              : "bg-white/5 text-gray-200 ring-1 ring-white/10"
          }`}>
            {icon ?? (isPaid ? <Lock className="h-5 w-5" /> : <Unlock className="h-5 w-5" />)}
          </div>
          <span className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] ${
            isPaid
              ? "border border-[#d4af37]/40 text-[#f3e5ab]"
              : "border border-emerald-400/30 text-emerald-300"
          }`}>
            {isPaid ? "Premium" : "Allowed"}
          </span>
        </div>

        <h3 className="text-xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#f3e5ab] via-[#d4af37] to-[#f3e5ab]">
          {title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-gray-400">{description}</p>

        <div className="mt-5 flex items-end justify-between">
          <span className="text-xs uppercase tracking-[0.2em] text-gray-500">{priceOrInfo}</span>
          <button
            onClick={onAction}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#d4af37]/40 px-3 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-[#f3e5ab] transition hover:border-[#d4af37] hover:bg-[#d4af37]/10"
          >
            {actionLabel}
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;
