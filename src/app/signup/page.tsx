"use client";
// =============================================================
// Signup Page — /signup
// =============================================================
// This page lets a new user create an account. When they submit:
//   1. We validate passwords match on the frontend
//   2. We POST { username, email, password } to /api/auth/signup
//   3. On success, we redirect them to /login to sign in
//   4. On failure, we show the backend error message
// =============================================================

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, User, Mail, Lock, AlertCircle } from "lucide-react";
import { api } from "@/lib/api"; // Our fetch helper

export default function SignupPage() {
  const router = useRouter();

  // All form fields stored in one object for convenience
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirm: "",  // Confirm password — only checked on the frontend
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Generic change handler — updates the matching key in the form object
  const handleChange = (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm({ ...form, [key]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Frontend check: make sure passwords match before sending to backend
    if (form.password !== form.confirm) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    // Send username, email and password to the real signup API route
    const res = await api<{ message: string }>(
      "/api/auth/signup",
      {
        method: "POST",
        body: JSON.stringify({
          username: form.username,
          email: form.email,
          password: form.password,
        }),
      },
    );

    setLoading(false);

    if (res.ok) {
      // Account created — send them to login page
      router.push("/login");
    } else {
      // Show backend error (e.g. "Email already taken")
      setError(res.error);
    }
  };

  // Field config array — keeps the JSX clean and DRY
  const fields = [
    { icon: User,  key: "username" as const, type: "text",     placeholder: "Username" },
    { icon: Mail,  key: "email"    as const, type: "email",    placeholder: "Email" },
    { icon: Lock,  key: "password" as const, type: "password", placeholder: "Password" },
    { icon: Lock,  key: "confirm"  as const, type: "password", placeholder: "Confirm password" },
  ];

  return (
    <div className="mx-auto my-20 max-w-md px-4">
      {/* Page heading */}
      <div className="text-center">
        <p className="text-[10px] uppercase tracking-[0.35em] text-[#d4af37]">Join the Hub</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight">
          <span className="bg-gradient-to-r from-[#f3e5ab] via-[#d4af37] to-[#f3e5ab] bg-clip-text text-transparent">
            Create Account
          </span>
        </h1>
        <p className="mt-2 text-sm text-gray-400">Register for access to free previews & premium tracks</p>
      </div>

      {/* Gold gradient border wrapper */}
      <div
        className="mt-8 rounded-2xl p-[1px] transition focus-within:shadow-[0_0_60px_-15px_rgba(212,175,55,0.55)]"
        style={{ backgroundImage: "linear-gradient(135deg,#d4af37,#9ca3af,#f3e5ab,#d4af37)" }}
      >
        <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl bg-[#0d1117] p-7">

          {/* Error banner */}
          {error && (
            <div className="flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
              <AlertCircle className="mt-0.5 h-4 w-4" />
              <span>{error}</span>
            </div>
          )}

          {/* Render all 4 input fields from the config array above */}
          {fields.map(({ icon: Icon, key, type, placeholder }) => (
            <div key={key} className="relative">
              <Icon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <input
                required
                type={type}
                placeholder={placeholder}
                value={form[key]}
                onChange={handleChange(key)}
                className="w-full rounded-lg border border-white/10 bg-black/30 py-3 pl-10 pr-3 text-sm text-gray-100 placeholder-gray-600 transition focus:border-[#d4af37] focus:outline-none focus:ring-2 focus:ring-[#d4af37]/30"
              />
            </div>
          ))}

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#d4af37] py-3 text-sm font-semibold uppercase tracking-[0.2em] text-black shadow-[0_15px_40px_-15px_rgba(212,175,55,0.7)] transition hover:scale-[1.01] disabled:opacity-60"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? "Creating..." : "Create Account"}
          </button>

          {/* Link back to login */}
          <p className="text-center text-xs text-gray-500">
            Already a member?{" "}
            <Link href="/login" className="text-[#f3e5ab] hover:underline">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
