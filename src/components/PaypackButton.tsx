"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle2 } from "lucide-react";

interface PaypackProps {
  amount: number;
  bookId: string;
}

export default function PaypackButton({ amount, bookId }: PaypackProps) {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [polling, setPolling] = useState(false);
  const [error, setError] = useState("");

  const handlePayment = async () => {
    if (!phone || phone.length < 9) {
      setError("Please enter a valid MoMo phone number.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // 1. Trigger the MoMo prompt on the user's phone
      const res = await fetch("/api/paypack", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, amount }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        // Show the exact error from Paypack so we can diagnose it
        setError(data.error || `Error ${res.status}: Payment failed.`);
        setLoading(false);
        return;
      }

      // 2. Prompt sent — now poll until user enters their PIN
      setLoading(false);
      setPolling(true);
      pollStatus(data.ref);

    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  // Poll /api/paypack/status every 3 seconds up to 20 times (1 minute)
  const pollStatus = (ref: string) => {
    let attempts = 0;
    const maxAttempts = 20;

    const interval = setInterval(async () => {
      attempts++;

      try {
        const res = await fetch("/api/paypack/status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ref }),
        });

        const data = await res.json();

        if (data.paid) {
          // Payment confirmed — go to download page
          clearInterval(interval);
          setPolling(false);
          router.push(`/download?status=success&bookId=${bookId}`);
          return;
        }

        if (data.status === "failed") {
          clearInterval(interval);
          setPolling(false);
          setError("Payment was declined. Please try again.");
          return;
        }

      } catch {
        // Network hiccup — keep polling
      }

      // Timed out after 1 minute
      if (attempts >= maxAttempts) {
        clearInterval(interval);
        setPolling(false);
        setError("Payment timed out. If you paid, please contact support.");
      }
    }, 3000); // check every 3 seconds
  };

  return (
    <div className="flex w-full flex-col gap-3">
      {/* Phone input — hidden while polling */}
      {!polling && (
        <input
          type="tel"
          placeholder="MoMo number e.g. 078XXXXXXX"
          value={phone}
          onChange={(e) => { setPhone(e.target.value); setError(""); }}
          disabled={loading}
          className="w-full rounded-xl border border-gray-700 bg-black/40 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] disabled:opacity-50"
        />
      )}

      {/* Error message */}
      {error && <p className="text-xs text-red-400">{error}</p>}

      {/* Polling state — waiting for user to enter PIN */}
      {polling ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-[#d4af37]/30 bg-[#d4af37]/5 p-4">
          <Loader2 className="h-6 w-6 animate-spin text-[#d4af37]" />
          <p className="text-sm font-semibold text-[#f3e5ab]">Waiting for payment...</p>
          <p className="text-xs text-gray-400 text-center">
            Check your phone and enter your MoMo PIN to confirm the payment of{" "}
            <span className="text-white font-semibold">RWF {amount.toLocaleString()}</span>.
          </p>
        </div>
      ) : (
        <button
          onClick={handlePayment}
          disabled={loading}
          className="w-full rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#d4af37] py-3 font-semibold text-black shadow-lg shadow-[#d4af37]/20 transition hover:scale-[1.01] disabled:opacity-60"
        >
          {loading
            ? <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Sending to phone...
              </span>
            : `Pay RWF ${amount.toLocaleString()}`
          }
        </button>
      )}
    </div>
  );
}
