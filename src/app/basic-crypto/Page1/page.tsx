"use client";
import FreeLesson from "@/components/FreeLesson";

export default function Page1() {
  return (
    <FreeLesson
      topic="Basic Crypto"
      pageNumber={1}
      title="What is Cryptocurrency?"
      intro="Cryptocurrency is digital money secured by cryptography and running on a decentralised network called a blockchain."
      sections={[
        { heading: "What is a Blockchain?", body: "A blockchain is a public ledger — a list of every transaction ever made, stored across thousands of computers so no single person controls it." },
        { heading: "Bitcoin & Altcoins", body: "Bitcoin was the first cryptocurrency. Altcoins (alternative coins) like Ethereum, Solana, and BNB came after and offer different features." },
        { heading: "Why Does It Have Value?", body: "Crypto has value because people trust it, it is scarce (limited supply), and it can be used to transfer money globally without a bank." },
      ]}
      nextHref="/basic-crypto/Page2"
    />
  );
}
