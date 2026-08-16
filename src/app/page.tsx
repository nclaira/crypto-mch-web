"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, TrendingUp, ShieldCheck } from "lucide-react";
import HeroChart from "../components/HeroChart";
import Footer from "../components/Footer";
import { downloadBook } from "../lib/api";
import { useCryptoAuth } from "@/lib/auth";

const trendingNews = [
  { id: 1, title: "Bitcoin breaks $100K resistance with record volume", source: "CryptoDaily", time: "2h" },
  { id: 2, title: "ECB signals dovish pivot — EUR/USD rallies", source: "ForexLive", time: "5h" },
  { id: 3, title: "Top 5 altcoins institutions are accumulating", source: "CoinDesk", time: "1d" },
];

const Home = () => {
  // Read the logged-in user from the global auth context (set after login)
  const { user } = useCryptoAuth();
  const router = useRouter();

  const handlePaid = (name: string) => {
    if (!user) {
      router.push("/login");
      return;
    }
    router.push("/books");
  };

  const handleFreePreview = async () => {
    await downloadBook("preview", "mucamanza-preview.pdf");
  };

  return (
    // Navbar is rendered once in layout.tsx — do NOT add it here again
    <div className="min-h-screen bg-[#0d1117] text-white">

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, #d4af37 1px, transparent 0)",
            backgroundSize: "26px 26px",
          }}
        />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:py-20 lg:grid-cols-2 lg:py-28">
          
          {/* Left Hero Content */}
          <div className="flex flex-col items-start text-left">
            <span className="inline-flex w-fit gap-2 rounded-full border border-[#d4af37]/30 bg-[#d4af37]/5 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-[#f3e5ab]">
              <Sparkles className="h-3 w-3" /> Elite Crypto Architecture
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
              <span className="block bg-gradient-to-r from-[#f3e5ab] via-[#d4af37] to-[#f3e5ab] bg-clip-text text-transparent">
                Mucamanza
              </span>
              <span className="block bg-gradient-to-r from-[#e5e7eb] via-[#9ca3af] to-[#e5e7eb] bg-clip-text text-transparent">
                Market Hub
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-gray-400">
              Decentralized Resource Distribution & Advanced Crypto Architecture Gateway.
              Curated knowledge, premium signals, and institutional-grade strategies — all under one luxury roof.
            </p>

            {/* Action Buttons - Aligned Left */}
            <div className="mt-8 flex flex-wrap justify-start gap-3">
              <Link
                href="/categories"
                className="rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#d4af37] px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-black shadow-[0_15px_40px_-15px_rgba(212,175,55,0.7)] transition hover:scale-[1.02]"
              >
                Enter the Hub
              </Link>
              <Link
                href="/books"
                className="rounded-xl border border-[#d4af37]/40 px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#f3e5ab] transition hover:border-[#d4af37] hover:bg-[#d4af37]/10"
              >
                Explore Books
              </Link>
            </div>

            {/* Stats Bar - Aligned Left */}
            <div className="mt-10 grid w-full grid-cols-3 gap-2 sm:gap-4 text-left">
              {[
                { k: "12K+", v: "Active Traders" },
                { k: "98%", v: "Member Retention" },
                { k: "24/7", v: "Premium Support" },
              ].map((s) => (
                <div key={s.v} className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
                  <div className="bg-gradient-to-r from-[#f3e5ab] to-[#d4af37] bg-clip-text text-lg sm:text-xl font-bold text-transparent">
                    {s.k}
                  </div>
                  <div className="text-[9px] sm:text-[10px] uppercase tracking-[0.15em] sm:tracking-[0.2em] text-gray-500">{s.v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Hero Visual */}
          <div className="flex items-center justify-center">
            <HeroChart />
          </div>
        </div>
      </section>

      {/* CATEGORIES PREVIEW */}
      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#d4af37]">Curriculum</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
              <span className="bg-gradient-to-r from-[#f3e5ab] to-[#d4af37] bg-clip-text text-transparent">Premium</span>{" "}
              <span className="text-gray-200">Tracks</span>
            </h2>
          </div>
          <Link href="/categories" className="hidden text-xs uppercase tracking-[0.2em] text-gray-400 hover:text-[#f3e5ab] md:inline">
            View all →
          </Link>
        </div>

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { title: "Crypto Trading", desc: "Institutional strategies, advanced order flow, and live signal architecture.", paid: true },
            { title: "Forex Trading", desc: "Master pairs, macro narratives, risk frameworks and execution.", paid: true },
            { title: "Basic Crypto", desc: "Free 3-page primer: wallets, chains, exchanges, and self-custody.", paid: false },
            { title: "Basic Forex", desc: "Free essentials: pips, leverage, sessions, and order types.", paid: false },
          ].map((c) => (
            <div key={c.title} className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 hover:border-[#d4af37]/40 transition">
              <h3 className="text-base font-semibold text-gray-100">{c.title}</h3>
              <p className="mt-2 text-sm text-gray-400">{c.desc}</p>
              <button
                onClick={() => c.paid ? handlePaid(c.title) : handleFreePreview()}
                className="mt-4 rounded-lg border border-[#d4af37]/30 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[#f3e5ab] transition hover:border-[#d4af37]"
              >
                {c.paid ? "Unlock" : "Download"}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* TRENDING FEED */}
      <section className="border-y border-[#d4af37]/10 bg-black/30">
        <div className="mx-auto max-w-7xl px-4 py-20">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[#d4af37]">Live Feed</p>
              <h2 className="mt-2 flex items-center gap-3 text-3xl font-bold md:text-4xl">
                <TrendingUp className="h-7 w-7 text-[#d4af37]" />
                <span className="text-gray-200">Trending Now</span>
              </h2>
            </div>
            <Link href="/trending" className="text-xs uppercase tracking-[0.2em] text-gray-400 hover:text-[#f3e5ab]">
              View dashboard →
            </Link>
          </div>

          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {trendingNews.map((n) => (
              <article
                key={n.id}
                className="group rounded-2xl border border-white/5 bg-white/[0.02] p-6 transition hover:border-[#d4af37]/40 hover:bg-[#d4af37]/[0.03]"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#d4af37]">{n.source}</span>
                  <span className="text-[10px] text-gray-500">{n.time} ago</span>
                </div>
                <h3 className="mt-3 text-base font-semibold leading-snug text-gray-100 transition group-hover:text-[#f3e5ab]">
                  {n.title}
                </h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="mx-auto max-w-7xl px-4 py-16 text-center">
        <ShieldCheck className="mx-auto h-8 w-8 text-[#d4af37]" />
        <p className="mt-3 text-sm uppercase tracking-[0.3em] text-gray-400">
          Secured by HTTP-Only JWT Sessions
        </p>
      </section>

      <Footer />
    </div>
  );
};

export default Home;