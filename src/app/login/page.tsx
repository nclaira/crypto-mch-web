"use client";
// =============================================================
// Login Page — /login
// =============================================================
// This page shows a form where the user types their email and
// password. When they click "Sign In":
//   1. We send the data to POST /api/auth/login
//   2. The backend checks the password and sets an HTTP-Only
//      cookie called "token" in the browser
//   3. We save the user info in the global auth context
//   4. We redirect them to the home page
// =============================================================

import { useState } from "react";
import Link from "next/link";                        // Next.js link (replaces React Router's <Link>)
import { useRouter } from "next/navigation";          // Next.js navigation (replaces useNavigate)
import { Loader2, Mail, Lock, AlertCircle } from "lucide-react";
import { useCryptoAuth } from "@/lib/auth";           // Our shared auth context
import { api } from "@/lib/api";                      // Our fetch helper

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useCryptoAuth(); // Lets us save the user after login

  // Form field values
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();   // Stop the page from refreshing on form submit
    setError(null);
    setLoading(true);

    // Send email + password to the backend login route
    const res = await api<{ user: { username: string; role: string; isPaid: boolean } }>(
      "/api/auth/login",
      { method: "POST", body: JSON.stringify({ email, password }) },
    );

    setLoading(false);

    if (res.ok) {
      // Save the user info globally so Navbar and other pages can read it
      setUser(res.data.user);
      router.push("/"); // Redirect to home after successful login
    } else {
      // Show the error from the backend (e.g. "Wrong password!")
      setError(res.error);
    }
  };

  return (
    <div className="mx-auto my-20 max-w-md px-4">
      {/* Page heading */}
      <div className="text-center">
        <p className="text-[10px] uppercase tracking-[0.35em] text-[#d4af37]">Member Access</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight">
          <span className="bg-gradient-to-r from-[#f3e5ab] via-[#d4af37] to-[#f3e5ab] bg-clip-text text-transparent">
            Welcome Back
          </span>
        </h1>
        <p className="mt-2 text-sm text-gray-400">Sign in to enter the Mucamanza vault</p>
      </div>

      {/* Gold gradient border wrapper around the form */}
      <div
        className="mt-8 rounded-2xl p-[1px] transition focus-within:shadow-[0_0_60px_-15px_rgba(212,175,55,0.55)]"
        style={{ backgroundImage: "linear-gradient(135deg,#d4af37,#9ca3af,#f3e5ab,#d4af37)" }}
      >
        <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl bg-[#0d1117] p-7">

          {/* Error banner — only shown when login fails */}
          {error && (
            <div className="flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
              <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Email field */}
          <div>
            <label className="mb-2 block text-[11px] uppercase tracking-[0.25em] text-gray-400">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@mucamanza.com"
                className="w-full rounded-lg border border-white/10 bg-black/30 py-3 pl-10 pr-3 text-sm text-gray-100 placeholder-gray-600 transition focus:border-[#d4af37] focus:outline-none focus:ring-2 focus:ring-[#d4af37]/30"
              />
            </div>
          </div>

          {/* Password field */}
          <div>
            <label className="mb-2 block text-[11px] uppercase tracking-[0.25em] text-gray-400">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-white/10 bg-black/30 py-3 pl-10 pr-3 text-sm text-gray-100 placeholder-gray-600 transition focus:border-[#d4af37] focus:outline-none focus:ring-2 focus:ring-[#d4af37]/30"
              />
            </div>
          </div>

          {/* Submit button — shows spinner while loading */}
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#d4af37] py-3 text-sm font-semibold uppercase tracking-[0.2em] text-black shadow-[0_15px_40px_-15px_rgba(212,175,55,0.7)] transition hover:scale-[1.01] disabled:opacity-60"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? "Authenticating..." : "Sign In"}
          </button>

          {/* Link to signup page */}
          <p className="text-center text-xs text-gray-500">
            No account?{" "}
            <Link href="/signup" className="text-[#f3e5ab] hover:underline">Create one</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
