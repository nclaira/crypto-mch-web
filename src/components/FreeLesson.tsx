"use client";
// =============================================================
// FreeLesson — reusable reader for the 6 free lesson pages
// =============================================================
// This component is used by all basic-crypto and basic-forex pages.
// It shows a lesson with sections and a download button.
//
// Props you pass in when using this component:
//   topic      — e.g. "Basic Crypto" or "Basic Forex"
//   pageNumber — 1, 2, or 3
//   title      — the lesson title shown at the top
//   intro      — short paragraph shown under the title
//   sections   — array of { heading, body } content blocks
//   prevHref   — link to the previous lesson page (optional)
//   nextHref   — link to the next lesson page (optional)
// =============================================================

import Link from "next/link";                          // Next.js link (replaces React Router)
import { useState } from "react";
import PaywallModal from "@/components/PaywallModal";  // Access denied popup
import { downloadBook } from "@/lib/api";
import { Download, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

type Props = {
  topic: string;
  pageNumber: number;
  title: string;
  intro: string;
  sections: { heading: string; body: string }[];
  prevHref?: string;  // e.g. "/basic-crypto/page1" — leave empty on first page
  nextHref?: string;  // e.g. "/basic-crypto/page2" — leave empty on last page
};

const FreeLesson = ({ topic, pageNumber, title, intro, sections, prevHref, nextHref }: Props) => {
  const [loading, setLoading] = useState(false);
  const [paywall, setPaywall] = useState(false);

  // Hits GET /api/books/download?type=preview to download the lesson PDF
  const handleDownload = async () => {
    setLoading(true);
    const res = await downloadBook(
      "preview",
      `${topic.replace(/\s+/g, "-")}-lesson-${pageNumber}.pdf`
    );
    setLoading(false);
    // If backend blocks it (401/403), show the paywall popup
    if (!res.ok && (res.status === 401 || res.status === 403)) {
      setPaywall(true);
    }
  };

  return (
    // No <Layout> needed — src/app/layout.tsx already wraps every page
    <article className="mx-auto max-w-3xl px-4 py-16">

      {/* Lesson label — e.g. "Basic Crypto — Lesson 1 of 3" */}
      <p className="text-[10px] uppercase tracking-[0.3em] text-[#d4af37]">
        {topic} — Lesson {pageNumber} of 3
      </p>

      {/* Lesson title */}
      <h1 className="mt-3 text-4xl font-bold leading-tight md:text-5xl">
        <span className="bg-gradient-to-r from-[#f3e5ab] via-[#d4af37] to-[#f3e5ab] bg-clip-text text-transparent">
          {title}
        </span>
      </h1>

      {/* Intro paragraph */}
      <p className="mt-5 text-base leading-relaxed text-gray-300">{intro}</p>

      {/* Content sections — each one is a card with a heading and body text */}
      <div className="mt-10 space-y-8">
        {sections.map((s, i) => (
          <section key={i} className="rounded-xl border border-white/5 bg-white/[0.02] p-6">
            <h2 className="text-lg font-semibold tracking-wide text-[#f3e5ab]">{s.heading}</h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-400">{s.body}</p>
          </section>
        ))}
      </div>

      {/* Download PDF button */}
      <button
        onClick={handleDownload}
        disabled={loading}
        className="mt-10 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#d4af37] px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-black shadow-[0_15px_40px_-15px_rgba(212,175,55,0.7)] transition hover:scale-[1.02] disabled:opacity-60"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
        {loading ? "Preparing PDF..." : "Download Preview PDF"}
      </button>

      {/* Previous / Next navigation */}
      <div className="mt-14 flex justify-between border-t border-[#d4af37]/10 pt-6 text-xs uppercase tracking-[0.2em]">
        {prevHref ? (
          <Link href={prevHref} className="inline-flex items-center gap-1 text-gray-400 hover:text-[#f3e5ab]">
            <ChevronLeft className="h-4 w-4" /> Previous
          </Link>
        ) : <span />}

        {nextHref && (
          <Link href={nextHref} className="inline-flex items-center gap-1 text-gray-400 hover:text-[#f3e5ab]">
            Next <ChevronRight className="h-4 w-4" />
          </Link>
        )}
      </div>

      {/* Paywall popup — shown if backend blocks the download */}
      <PaywallModal
        open={paywall}
        onClose={() => setPaywall(false)}
        resourceName={`${topic} — Lesson ${pageNumber}`}
      />
    </article>
  );
};

export default FreeLesson;
