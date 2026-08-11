"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      setSuccess(true);
      setTimeout(() => router.push("/login"), 3000);
    } else {
      setError(data.error || "Something went wrong");
    }
  };

  if (!token) {
    return (
      <div className="text-center py-10">
        <p className="text-red-400 text-sm">Invalid reset link. Please request a new one.</p>
        <Link href="/forgot-password" className="mt-4 inline-block text-xs text-[#d4af37] hover:underline">
          Request new link
        </Link>
      </div>
    );
  }

  return (
    <div
      className="mt-8 rounded-2xl p-[1px]"
      style={{ backgroundImage: "linear-gradient(135deg,#d4af37,#9ca3af,#f3e5ab,#d4af37)" }}
    >
      <div className="rounded-2xl bg-[#0d1117] p-8">
        {success ? (
          <div className="flex flex-col items-center gap-4 text-center py-4">
            <CheckCircle2 className="h-12 w-12 text-green-400" />
            <p className="text-sm font-semibold text-gray-100">Password updated!</p>
            <p className="text-sm text-gray-400">Redirecting you to login...</p>
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
              <label className="mb-2 block text-[11px] uppercase tracking-[0.25em] text-gray-400">New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-white/10 bg-black/30 py-3 pl-10 pr-3 text-sm text-gray-100 placeholder-gray-600 focus:border-[#d4af37] focus:outline-none focus:ring-2 focus:ring-[#d4af37]/30"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-[11px] uppercase tracking-[0.25em] text-gray-400">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="••••••••"
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
              {loading ? "Updating..." : "Set New Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="mx-auto my-20 w-full max-w-md px-4">
      <div className="text-center">
        <p className="text-[10px] uppercase tracking-[0.35em] text-[#d4af37]">Account Recovery</p>
        <h1 className="mt-3 text-3xl font-bold">
          <span className="bg-gradient-to-r from-[#f3e5ab] via-[#d4af37] to-[#f3e5ab] bg-clip-text text-transparent">
            Set New Password
          </span>
        </h1>
        <p className="mt-2 text-sm text-gray-400">Enter your new password below</p>
      </div>
      <Suspense fallback={<div className="mt-8 text-center text-gray-400 text-sm">Loading...</div>}>
        <ResetPasswordContent />
      </Suspense>
    </div>
  );
}
