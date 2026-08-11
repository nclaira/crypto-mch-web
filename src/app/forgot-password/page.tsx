"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      setSuccess(true);
    } else {
      setError(data.error || "Something went wrong");
    }
  };

  return (
    <div className="mx-auto my-20 w-full max-w-md px-4">
      <div className="text-center">
        <p className="text-[10px] uppercase tracking-[0.35em] text-[#d4af37]">Account Recovery</p>
        <h1 className="mt-3 text-3xl font-bold">
          <span className="bg-gradient-to-r from-[#f3e5ab] via-[#d4af37] to-[#f3e5ab] bg-clip-text text-transparent">
            Forgot Password
          </span>
        </h1>
        <p className="mt-2 text-sm text-gray-400">
          Enter your email and we'll send you a reset link
        </p>
      </div>

      <div
        className="mt-8 rounded-2xl p-[1px]"
        style={{ backgroundImage: "linear-gradient(135deg,#d4af37,#9ca3af,#f3e5ab,#d4af37)" }}
      >
        <div className="rounded-2xl bg-[#0d1117] p-8">
          {success ? (
            <div className="flex flex-col items-center gap-4 text-center py-4">
              <CheckCircle2 className="h-12 w-12 text-green-400" />
              <p className="text-sm font-semibold text-gray-100">Check your inbox!</p>
              <p className="text-sm text-gray-400">
                If an account exists for <span className="text-[#f3e5ab]">{email}</span>, a reset link has been sent.
              </p>
              <Link href="/login" className="mt-2 text-xs uppercase tracking-[0.2em] text-[#d4af37] hover:underline">
                Back to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {error}
                </div>
              )}

              <div>
                <label className="mb-2 block text-[11px] uppercase tracking-[0.25em] text-gray-400">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-lg border border-white/10 bg-black/30 py-3 pl-10 pr-3 text-sm text-gray-100 placeholder-gray-600 focus:border-[#d4af37] focus:outline-none focus:ring-2 focus:ring-[#d4af37]/30"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#d4af37] py-3 text-sm font-semibold uppercase tracking-[0.2em] text-black transition hover:scale-[1.01] disabled:opacity-60"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                {loading ? "Sending..." : "Send Reset Link"}
              </button>

              <p className="text-center text-xs text-gray-500">
                Remembered it?{" "}
                <Link href="/login" className="text-[#f3e5ab] hover:underline">Sign in</Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
