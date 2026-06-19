"use client";
// Paywall Modal — premium gold-bordered access-denied overlay
// Triggered when:
//   • backend returns 401 / 403 on a paid resource, OR
//   • the logged-in user state shows isPaid === false

import { Lock, X, ShieldCheck, Sparkles } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  resourceName?: string;
};

const PaywallModal = ({ open, onClose, resourceName = "Mucamanza Crypto Premium" }: Props) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-2xl bg-gradient-to-b from-[#0f141c] to-[#0d1117] p-[1px]
                   shadow-[0_0_60px_-10px_rgba(212,175,55,0.45)]"
        style={{ backgroundImage: "linear-gradient(135deg,#d4af37,#f3e5ab,#9ca3af,#d4af37)" }}
      >
        <div className="rounded-2xl bg-[#0d1117] p-8 text-center">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-[#d4af37] transition"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full
                          bg-gradient-to-br from-[#d4af37] to-[#8a6d1f] shadow-lg shadow-[#d4af37]/30">
            <Lock className="h-7 w-7 text-black" />
          </div>

          <h2 className="text-2xl font-bold tracking-wide text-transparent bg-clip-text
                         bg-gradient-to-r from-[#f3e5ab] via-[#d4af37] to-[#f3e5ab]">
            Access Denied
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-gray-300">
            You must purchase the full book to unlock <span className="text-[#f3e5ab] font-semibold">{resourceName}</span>.
            Premium members get advanced strategies, full PDF library access, and live signal updates.
          </p>

          <ul className="mt-5 space-y-2 text-left text-sm text-gray-300">
            <li className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-[#d4af37]" /> Full Crypto & Forex eBooks</li>
            <li className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-[#d4af37]" /> Lifetime PDF downloads</li>
            <li className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-[#d4af37]" /> Premium signal community</li>
          </ul>

          {/* FUTURE ADDITION: wire this to a real checkout flow (Stripe / crypto wallet payment). */}
          <button
            onClick={() => alert("Checkout flow coming soon — wire to /api/payments/checkout")}
            className="mt-7 w-full rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#d4af37]
                       px-6 py-3 font-semibold tracking-wide text-black
                       shadow-[0_8px_30px_-8px_rgba(212,175,55,0.6)]
                       transition hover:scale-[1.02]"
          >
            Unlock Full Access Now
          </button>

          <button
            onClick={onClose}
            className="mt-3 text-xs uppercase tracking-[0.2em] text-gray-500 hover:text-gray-300"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaywallModal;
