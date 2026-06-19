"use client";
import FreeLesson from "@/components/FreeLesson";

export default function Page3() {
  return (
    <FreeLesson
      topic="Basic Forex"
      pageNumber={3}
      title="Risk Management Basics"
      intro="The most important skill in forex isn't winning — it's not losing too much."
      sections={[
        { heading: "Stop Loss", body: "Always set a stop loss. It automatically closes losing trades to protect your capital." },
        { heading: "1-2% Rule", body: "Never risk more than 1-2% of your account on a single trade." },
        { heading: "Risk/Reward", body: "Aim for trades where potential reward is at least 2x the risk." },
      ]}
      prevHref="/basic-forex/Page2"
    />
  );
}
