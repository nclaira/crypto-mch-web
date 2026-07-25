"use client";

import { useCryptoAuth } from "@/lib/auth";

interface FlutterwaveProps {
  email: string;
  amount: number;
  name: string;
  bookId: string;
  userId: string;
}

// ✏️ Your Flutterwave public key is read from NEXT_PUBLIC_FLW_PUBLIC_KEY in .env.local
// Make sure it starts with NEXT_PUBLIC_ so Next.js exposes it to the browser
const FLW_PUBLIC_KEY = process.env.NEXT_PUBLIC_FLW_PUBLIC_KEY || "";

export default function FlutterwaveButton({ email, amount, name, bookId, userId }: FlutterwaveProps) {
  const { user, setUser } = useCryptoAuth();

  const handlePayment = () => {
    // Load Flutterwave script if not already loaded
    if (!(window as any).FlutterwaveCheckout) {
      const script = document.createElement("script");
      script.src = "https://checkout.flutterwave.com/v3.js";
      script.onload = () => openCheckout();
      document.body.appendChild(script);
    } else {
      openCheckout();
    }
  };

  const openCheckout = () => {
    (window as any).FlutterwaveCheckout({
      public_key: FLW_PUBLIC_KEY,
      tx_ref: "TX-" + Date.now(),
      amount: amount,
      currency: "RWF",
      payment_options: "card,mobilemoneyrwanda",
      customer: {
        email: email,   // ← real user email
        name: name,     // ← real user name
      },
      customizations: {
        title: "Mucamanza Crypto Hub",
        description: "Payment for Digital Book Purchase",
        logo: "/assets/logo.jpeg",
      },
      callback: async (data: any) => {
        if (data.status === "successful") {
          const verifyRes = await fetch("/api/payments/verify-flutterwave", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              transaction_id: data.transaction_id,
              userId,
              bookId,
              expectedAmount: amount,
            }),
          });
          const verifyData = await verifyRes.json();
          if (verifyData.success) {
            // Update auth context immediately so UI switches to Download button
            if (user) setUser({ ...user, isPaid: true });
            alert("Payment Successful! Your account is now unlocked.");
            window.location.reload();
          } else {
            alert("Verification failed: " + verifyData.message);
          }
        }
      },
      onclose: () => {},
    });
  };

  return (
    <button
      onClick={handlePayment}
      className="w-full rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#d4af37] py-3 font-semibold text-black shadow-lg transition hover:scale-[1.01]"
    >
      Unlock Full Access
    </button>
  );
}
