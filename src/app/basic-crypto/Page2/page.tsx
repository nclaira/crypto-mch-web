"use client";
import FreeLesson from "@/components/FreeLesson";

export default function Page2() {
  return (
    <FreeLesson
      topic="Basic Crypto"
      pageNumber={2}
      title="Wallets & Exchanges"
      intro="Learn how to store crypto safely and where to buy/sell it."
      sections={[
        { heading: "Wallets", body: "A crypto wallet stores your private keys. Hot wallets (apps) are convenient; cold wallets (hardware) are safer." },
        { heading: "Exchanges", body: "Platforms like Binance, Coinbase, and Kraken let you trade crypto. Always enable 2FA." },
        { heading: "Security Tips", body: "Never share your seed phrase. Beware of phishing. Use hardware wallets for large amounts." },
      ]}
      prevHref="/basic-crypto/Page1"
      nextHref="/basic-crypto/Page3"
    />
  );
}
