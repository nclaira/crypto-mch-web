"use client";
import React, { useEffect } from "react";


interface FlutterwaveProps {
  email: string;
  amount: number;
  name: string;
  bookId: string;
  userId: string;
}


export default function FlutterwaveButton({ email, amount, name, bookId, userId }: FlutterwaveProps) {
 
  // Load Flutterwave inline payment script dynamically
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.flutterwave.com/v3.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);


  const handlePayment = () => {
    if (!(window as any).FlutterwaveCheckout) {
      alert("Flutterwave is still loading... Please try again in a moment.");
      return;
    }


    (window as any).FlutterwaveCheckout({
      public_key: process.env.NEXT_PUBLIC_FLW_PUBLIC_KEY,
      tx_ref: "TX-" + Date.now(),
      amount: amount,
      currency: "RWF", // Set currency (e.g. RWF or USD)
      payment_options: "card, mobilemoneyrwanda",
      customer: {
        email: email,
        name: name,
      },
      customizations: {
        title: "E-Book Store Checkout",
        description: "Payment for Digital Book Purchase",
      },
      callback: async (data: any) => {
        // Automatically triggered upon payment completion
        const verifyRes = await fetch("/api/payments/verify-flutterwave", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            transaction_id: data.transaction_id,
            userId: userId,
            bookId: bookId,
            expectedAmount: amount,
          }),
        });


        const verifyData = await verifyRes.json();
        if (verifyData.success) {
          alert("Payment Successful! Your book is unlocked.");
          window.location.reload();
        } else {
          alert("Verification failed: " + verifyData.message);
        }
      },
      onclose: () => {
        console.log("Payment window closed.");
      },
    });
  };


  return (
    <button
      onClick={handlePayment}
      className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-md"
    >
      Pay with Mobile Money / Card
    </button>
  );
}
