"use client";
// =============================================================
// Trending Page — /trending
// =============================================================
// This page has two sections:
//   1. News Feed   — latest crypto & forex headlines
//   2. Copy Trading — top trader profiles with performance stats
//
// HOW TO ADD A NEW NEWS ARTICLE:
//   Find the `news` array below and add a new object.
//
// HOW TO ADD A NEW TRADER PROFILE:
//   Find the `traders` array below and add a new object.
//
// FUTURE ADDITION: Replace the mock data below with a real
// live API (e.g. CoinGecko, CryptoPanic, or your own backend).
// =============================================================

import { useState } from "react";
import { RefreshCw, TrendingUp, TrendingDown, Trophy, Copy } from "lucide-react";
import Footer from "@/components/Footer";

// ---------------------------------------------------------------
// NEWS FEED DATA — ADD NEW ARTICLES HERE
// Each article needs: id, cat, title, src, time
// cat: "Crypto" or "Forex" (controls the badge color)
// ---------------------------------------------------------------
const news = [
  { id: 1, cat: "Crypto", title: "BTC reclaims $100K — dealer gamma flips long",  src: "CryptoDaily", time: "2h" },
  { id: 2, cat: "Forex",  title: "ECB pivots dovish — EUR/USD rallies 80 pips",    src: "ForexLive",   time: "4h" },
  { id: 3, cat: "Crypto", title: "ETH ETF inflows hit weekly record",               src: "Bloomberg",   time: "6h" },
  { id: 4, cat: "Forex",  title: "USD/JPY pierces 158 as carry trades return",      src: "Reuters",     time: "9h" },
  { id: 5, cat: "Crypto", title: "Solana RWA volume crosses $1B",                   src: "The Block",   time: "12h" },
  { id: 6, cat: "Forex",  title: "GBP/USD eyes 1.30 after CPI surprise",            src: "FXStreet",    time: "1d" },

  // ✏️  ADD A NEW ARTICLE HERE:
  // { id: 7, cat: "Crypto", title: "Your headline here", src: "Source Name", time: "1h" },
];

// ---------------------------------------------------------------
// COPY TRADING PROFILES — ADD NEW TRADERS HERE
// trend: "up" = green card border, "down" = grey card border
// ---------------------------------------------------------------
const traders = [
  { handle: "claire_dev",   role: "Quant",  return30: 42.8, winRate: 78, trades: 142, copying: 312, trend: "up"   as const },
  { handle: "alpha_macro",  role: "Macro",  return30: 31.5, winRate: 71, trades: 88,  copying: 220, trend: "up"   as const },
  { handle: "neo_scalper",  role: "Scalp",  return30: -4.2, winRate: 49, trades: 412, copying: 95,  trend: "down" as const },
  { handle: "mucamanza_v1", role: "Hybrid", return30: 58.1, winRate: 81, trades: 65,  copying: 540, trend: "up"   as const },

  // ✏️  ADD A NEW TRADER HERE:
  // { handle: "your_handle", role: "Swing", return30: 20.0, winRate: 65, trades: 50, copying: 100, trend: "up" },
];

export default function TrendingPage() {
  // refreshing controls the spinning icon on the Refresh button
  const [refreshing, setRefreshing] = useState(false);

  // Simulates a data refresh — replace with a real API call later
  const refresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 700);
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-white">
      <div className="mx-auto max-w-7xl px-4 py-16">

        {/* Page heading + Refresh button */}
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#d4af37]">Live Dashboard</p>
            <h1 className="mt-3 text-4xl font-bold md:text-5xl">
              <span className="bg-gradient-to-r from-[#f3e5ab] via-[#d4af37] to-[#f3e5ab] bg-clip-text text-transparent">
                Market Trending
              </span>
            </h1>
          </div>
          {/* Refresh button — the icon spins while refreshing is true */}
          <button
            onClick={refresh}
            className="flex items-center gap-2 rounded-lg border border-[#d4af37]/40 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#f3e5ab] transition hover:bg-[#d4af37]/10"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {/* ── SECTION 1: NEWS FEED ── */}
        <section className="mt-12">
          <h2 className="mb-5 text-sm uppercase tracking-[0.25em] text-gray-400">
            Crypto & Forex News
          </h2>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {news.map((n) => (
              <article
                key={n.id}
                className="group rounded-xl border border-white/5 bg-white/[0.02] p-5 transition hover:border-[#d4af37]/40 hover:bg-[#d4af37]/[0.04]"
              >
                {/* Category badge + time */}
                <div className="flex items-center justify-between">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest ${
                      n.cat === "Crypto"
                        ? "border border-[#d4af37]/40 text-[#f3e5ab]"  // Gold for Crypto
                        : "border border-gray-400/30 text-gray-200"     // Silver for Forex
                    }`}
                  >
                    {n.cat}
                  </span>
                  <span className="text-[10px] text-gray-500">{n.time} ago</span>
                </div>

                {/* Article headline */}
                <h3 className="mt-3 text-sm font-semibold leading-snug text-gray-100 transition group-hover:text-[#f3e5ab]">
                  {n.title}
                </h3>

                {/* Source name */}
                <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-gray-500">{n.src}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ── SECTION 2: COPY TRADING LEADERBOARD ── */}
        <section className="mt-16">
          <div className="mb-5 flex items-center gap-2">
            <Trophy className="h-5 w-5 text-[#d4af37]" />
            <h2 className="text-sm uppercase tracking-[0.25em] text-gray-400">
              Copy Trading — Top Profiles
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {traders.map((t) => {
              const isUp = t.trend === "up"; // true = green/gold, false = red/grey
              return (
                <div
                  key={t.handle}
                  // Gold gradient border for profitable traders, grey for losing ones
                  className="rounded-2xl p-[1px]"
                  style={{
                    backgroundImage: isUp
                      ? "linear-gradient(135deg,#d4af37,#8a6d1f,#f3e5ab)"
                      : "linear-gradient(135deg,#9ca3af,#4b5563,#e5e7eb)",
                  }}
                >
                  <div className="flex items-center justify-between rounded-2xl bg-[#0d1117] p-5">

                    {/* Left: avatar + handle + stats */}
                    <div className="flex items-center gap-4">
                      {/* Avatar — shows first 2 letters of handle */}
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#d4af37] to-[#8a6d1f] text-sm font-bold text-black">
                        {t.handle.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold tracking-wide text-gray-100">@{t.handle}</div>
                        <div className="mt-0.5 flex items-center gap-2 text-[10px] uppercase tracking-widest text-gray-500">
                          <span className="rounded-full bg-white/5 px-2 py-0.5">{t.role}</span>
                          <span>{t.trades} trades</span>
                          <span>{t.copying} copying</span>
                        </div>
                      </div>
                    </div>

                    {/* Right: return % + win rate + copy button */}
                    <div className="text-right">
                      {/* 30-day return — green if up, red if down */}
                      <div className={`flex items-center justify-end gap-1 text-lg font-bold ${isUp ? "text-emerald-300" : "text-red-400"}`}>
                        {isUp ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                        {isUp ? "+" : ""}{t.return30}%
                      </div>
                      <div className="text-[10px] uppercase tracking-widest text-gray-500">
                        30d • {t.winRate}% win
                      </div>
                      {/* Copy button — wire to real copy-trading logic later */}
                      <button className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-[#d4af37]/40 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#f3e5ab] transition hover:bg-[#d4af37]/10">
                        <Copy className="h-3 w-3" /> Copy
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
