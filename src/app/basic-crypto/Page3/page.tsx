"use client";
import FreeLesson from "@/components/FreeLesson";

export default function Page3() {
  return (
    <FreeLesson
      topic="Basic Crypto"
      pageNumber={3}
      title="Your First Trade"
      intro="A step-by-step guide to making your first cryptocurrency trade."
      sections={[
        { heading: "Step 1: Pick an Exchange", body: "Choose a regulated exchange that supports your country and currency." },
        { heading: "Step 2: Verify & Deposit", body: "Complete KYC and deposit funds via bank transfer or card." },
        { heading: "Step 3: Buy & Hold", body: "Start small. Buy a well-known coin like BTC or ETH and hold to learn how prices move." },
      ]}
      prevHref="/basic-crypto/Page2"
    />
  );
}
