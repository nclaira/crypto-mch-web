"use client";
// Contact Page — /contact

import { useState } from "react";
import { Send, Mail, MessageSquare, CheckCircle2 } from "lucide-react";
import Footer from "@/components/Footer";

export default function ContactPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // FUTURE ADDITION: POST to /api/contact to send a real email
    setSent(true);
    setEmail("");
    setMessage("");
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-white">
      <div className="mx-auto max-w-2xl px-4 py-20">

        {/* Page heading */}
        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-[#d4af37]">Get in Touch</p>
          <h1 className="mt-3 text-4xl font-bold md:text-5xl">
            <span className="bg-gradient-to-r from-[#f3e5ab] via-[#d4af37] to-[#f3e5ab] bg-clip-text text-transparent">
              Contact Mucamanza
            </span>
          </h1>
          <p className="mt-3 text-sm text-gray-400">We respond within one trading session.</p>
        </div>

        {/* Contact form */}
        <div
          className="mt-10 rounded-2xl p-[1px]"
          style={{ backgroundImage: "linear-gradient(135deg,#d4af37,#9ca3af,#f3e5ab,#d4af37)" }}
        >
          <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl bg-[#0d1117] p-7">

            {/* Success message — shown for 3 seconds after sending */}
            {sent && (
              <div className="flex items-center gap-2 rounded-lg border border-emerald-400/30 bg-emerald-400/10 p-3 text-sm text-emerald-300">
                <CheckCircle2 className="h-4 w-4" /> Message received — we'll be in touch.
              </div>
            )}

            {/* Email field */}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <input
                required
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-black/30 py-3 pl-10 pr-3 text-sm text-gray-100 placeholder-gray-600 focus:border-[#d4af37] focus:outline-none focus:ring-2 focus:ring-[#d4af37]/30"
              />
            </div>

            {/* Message field */}
            <div className="relative">
              <MessageSquare className="absolute left-3 top-4 h-4 w-4 text-gray-500" />
              <textarea
                required
                rows={5}
                placeholder="How can we help?"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-black/30 py-3 pl-10 pr-3 text-sm text-gray-100 placeholder-gray-600 focus:border-[#d4af37] focus:outline-none focus:ring-2 focus:ring-[#d4af37]/30"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#d4af37] py-3 text-sm font-semibold uppercase tracking-[0.2em] text-black shadow-[0_15px_40px_-15px_rgba(212,175,55,0.7)] transition hover:scale-[1.01]"
            >
              Send Message
            </button>
          </form>
        </div>

        {/* Telegram link */}
        <a
          href="https://t.me/yourgroup"
          target="_blank"
          rel="noreferrer"
          className="mt-5 flex items-center justify-center gap-2 rounded-xl border border-[#d4af37]/40 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#f3e5ab] transition hover:bg-[#d4af37]/10"
        >
          <Send className="h-4 w-4" /> Join the Telegram Inner Circle
        </a>
      </div>
      <Footer />
    </div>
  );
}
