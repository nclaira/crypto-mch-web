"use client";
import FreeLesson from "@/components/FreeLesson";

export default function Page2() {
  return (
    <FreeLesson
      topic="Basic Forex"
      pageNumber={2}
      title="Pips, Lots & Leverage"
      intro="Understand the building blocks of every forex trade."
      sections={[
        { heading: "Pips", body: "A pip is the smallest price change in a currency pair, usually the 4th decimal place." },
        { heading: "Lots", body: "A standard lot = 100,000 units. Mini = 10,000. Micro = 1,000." },
        { heading: "Leverage", body: "Leverage lets you control a large position with a small deposit. It amplifies both gains AND losses." },
      ]}
      prevHref="/basic-forex/Page1"
      nextHref="/basic-forex/Page3"
    />
  );
}
