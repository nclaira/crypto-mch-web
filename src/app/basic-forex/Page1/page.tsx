"use client";
import FreeLesson from "@/components/FreeLesson";

export default function Page1() {
  return (
    <FreeLesson
      topic="Basic Forex"
      pageNumber={1}
      title="What is Forex?"
      intro="Foreign exchange (forex) is the global market where currencies are traded."
      sections={[
        { heading: "The Market", body: "Forex is the largest financial market in the world, with over $7 trillion traded daily." },
        { heading: "Currency Pairs", body: "You always trade one currency against another, e.g. EUR/USD or GBP/JPY." },
        { heading: "Who Trades", body: "Banks, governments, corporations, and retail traders all participate in forex." },
      ]}
      nextHref="/basic-forex/Page2"
    />
  );
}
