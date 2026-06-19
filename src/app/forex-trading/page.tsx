// FOREX TRADING (PAID) — /crypto/forex-trading

import { useState } from "react";
import Layout from "../components/Layout";
import PaywallModal from "../components/PaywallModal";
import { useCryptoAuth } from "../lib/auth";
import { Lock, Globe, LineChart, BookOpen, ShieldCheck } from "lucide-react";

const features = [
  { icon: Globe,      label: "Macro narrative briefings" },
  { icon: LineChart,  label: "Pair correlation matrices" },
  { icon: BookOpen,   label: "Full Forex playbook PDFs" },
  { icon: ShieldCheck,label: "Execution & risk frameworks" },
];

const ForexTrading = () => {
  const { user } = useCryptoAuth();
  const [paywall, setPaywall] = useState(false);

  return (
    <Layout>
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <div className="mx-auto inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#d4af37] to-[#8a6d1f] shadow-[0_0_60px_-10px_rgba(212,175,55,0.6)]">
          <Lock className="h-9 w-9 text-black" />
        </div>
        <p className="mt-6 text-xs uppercase tracking-[0.3em] text-[#d4af37]">Premium Track</p>
        <h1 className="mt-3 text-4xl font-bold md:text-5xl">
          <span className="bg-gradient-to-r from-[#f3e5ab] via-[#d4af37] to-[#f3e5ab] bg-clip-text text-transparent">
            Forex Trading
          </span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-gray-400">
          Macro frameworks, session theory, and execution playbooks for professionals.
        </p>

        <div className="mt-10 grid gap-3 sm:grid-cols-2">
          {features.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-4 text-left text-sm text-gray-300">
              <Icon className="h-5 w-5 text-[#d4af37]" /> {label}
            </div>
          ))}
        </div>

        <button
          onClick={() => setPaywall(true)}
          className="mt-10 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#d4af37] px-8 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-black shadow-[0_15px_40px_-15px_rgba(212,175,55,0.7)] transition hover:scale-[1.02]"
        >
          {user?.isPaid ? "Access Library" : "Unlock — Buy Now"}
        </button>
      </div>
      <PaywallModal open={paywall} onClose={() => setPaywall(false)} resourceName="Forex Trading" />
    </Layout>
  );
};

export default ForexTrading;
