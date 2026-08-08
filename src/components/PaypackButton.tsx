"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useCryptoAuth } from "@/lib/auth";

interface PaypackProps {
  amount: number;
  bookId: string;
}

export default function PaypackButton({ amount, bookId }: PaypackProps) {
  const router = useRouter();
  const { user, setUser } = useCryptoAuth();
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
      const res = await fetch("/api/paypack", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, amount, bookId }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Payment failed. Please try again.");
        setLoading(false);
        return;
      }

      setLoading(false);
      setPolling(true);
      pollStatus(data.ref);
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  const pollStatus = (ref: string) => {
    let attempts = 0;
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
          clearInterval(interval);
          setPolling(false);
          // Update context — add this bookId to purchasedBookIds
          if (user) {
            const updated = {
              ...user,
              purchasedBookIds: [...(user.purchasedBookIds || []), bookId],
            };
            setUser(updated);
          }
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
        // keep polling on network hiccup
      }

      if (attempts >= 20) {
        clearInterval(interval);
        setPolling(false);
        setError("Payment timed out. If you paid, please contact support.");
      }
    }, 3000);
  };

  return (
    <div className="flex w-full flex-col gap-3">
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

      {error && <p className="text-xs text-red-400">{error}</p>}

      {polling ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-[#d4af37]/30 bg-[#d4af37]/5 p-4">
          <Loader2 className="h-6 w-6 animate-spin text-[#d4af37]" />
          <p className="text-sm font-semibold text-[#f3e5ab]">Waiting for payment...</p>
          <p className="text-xs text-center text-gray-400">
            Enter your MoMo PIN to confirm{" "}
            <span className="font-semibold text-white">RWF {amount.toLocaleString()}</span>.
          </p>
        </div>
      ) : (
        <button
          onClick={handlePayment}
          disabled={loading}
          className="w-full rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#d4af37] py-3 font-semibold text-black shadow-lg transition hover:scale-[1.01] disabled:opacity-60"
        >
          {loading
            ? <span className="flex items-center justify-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Sending to phone...</span>
            : `Pay Now — RWF ${amount.toLocaleString()}`
          }
        </button>
      )}
    </div>
  );
}
