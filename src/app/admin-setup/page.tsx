"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Loader2, AlertCircle, CheckCircle } from "lucide-react";

export default function AdminSetupPage() {
  const router = useRouter();

  const [form, setForm] = useState({ username: "", email: "", password: "", secretCode: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch("/api/auth/admin-signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      setSuccess(true);
      setTimeout(() => router.push("/login"), 2000);
    } else {
      setError(data.error || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <div className="rounded-full border border-purple-500/40 bg-purple-500/10 p-3">
              <ShieldCheck className="h-8 w-8 text-purple-400" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white">Admin Registration</h1>
          <p className="mt-2 text-sm text-gray-400">
            This page is for authorized administrators only.
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-[1px]"
          style={{ backgroundImage: "linear-gradient(135deg,#7c3aed,#9ca3af,#a78bfa,#7c3aed)" }}
        >
          <form onSubmit={handleSubmit} className="rounded-2xl bg-[#0d1117] p-8 space-y-4">

            {/* Success message */}
            {success && (
              <div className="flex items-center gap-2 rounded-lg border border-green-500/30 bg-green-500/10 p-3 text-sm text-green-300">
                <CheckCircle className="h-4 w-4 flex-shrink-0" />
                Admin account created! Redirecting to login...
              </div>
            )}

            {/* Error message */}
            {error && (
              <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <div>
              <label className="text-xs uppercase tracking-widest text-gray-400">Username</label>
              <input
                type="text"
                required
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                placeholder="admin_name"
                className="mt-1 w-full rounded-xl border border-gray-700 bg-black/30 p-3 text-sm text-white focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-widest text-gray-400">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="admin@mucamanza.com"
                className="mt-1 w-full rounded-xl border border-gray-700 bg-black/30 p-3 text-sm text-white focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-widest text-gray-400">Password</label>
              <input
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                className="mt-1 w-full rounded-xl border border-gray-700 bg-black/30 p-3 text-sm text-white focus:border-purple-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs uppercase tracking-widest text-gray-400">
                Secret Code
              </label>
              <input
                type="password"
                required
                value={form.secretCode}
                onChange={(e) => setForm({ ...form, secretCode: e.target.value })}
                placeholder="Enter the admin secret code"
                className="mt-1 w-full rounded-xl border border-gray-700 bg-black/30 p-3 text-sm text-white focus:border-purple-500 focus:outline-none"
              />
              <p className="mt-1 text-[11px] text-gray-500">
                Only people with the secret code can create an admin account.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || success}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-purple-400 py-3 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.01] disabled:opacity-60"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? "Creating..." : "Create Admin Account"}
            </button>

            <p className="text-center text-xs text-gray-500">
              Already have an account?{" "}
              <a href="/login" className="text-purple-400 hover:underline">Login here</a>
            </p>
          </form>
        </div>

        {/* Warning note */}
        <p className="mt-4 text-center text-[11px] text-gray-600">
          ⚠️ Do not share this page URL publicly. For authorized personnel only.
        </p>
      </div>
    </div>
  );
}
