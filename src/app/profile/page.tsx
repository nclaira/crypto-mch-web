"use client";

import { useCryptoAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { User, BookOpen, ShieldCheck } from "lucide-react";

export default function ProfilePage() {
  const { user } = useCryptoAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) router.push("/login");
  }, [user]);

  if (!user) return null;

  const initial = user.username.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-[#0d1117] text-white px-4 py-16">
      <div className="mx-auto max-w-xl">

        {/* Header */}
        <div className="flex flex-col items-center text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#d4af37] to-[#8a6d1f] text-3xl font-bold text-black shadow-lg shadow-[#d4af37]/30">
            {initial}
          </div>
          <h1 className="mt-4 text-2xl font-bold text-gray-100">{user.username}</h1>
          <p className="mt-1 text-sm text-gray-500">{user.email}</p>
          {user.role === "admin" && (
            <span className="mt-2 flex items-center gap-1.5 rounded-full border border-purple-500/40 px-3 py-0.5 text-xs font-semibold text-purple-300">
              <ShieldCheck className="h-3 w-3" /> Admin
            </span>
          )}
        </div>

        {/* Stats */}
        <div className="mt-10 grid grid-cols-2 gap-4">
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5 text-center">
            <p className="text-2xl font-bold text-[#d4af37]">
              {user.purchasedBookIds?.length || 0}
            </p>
            <p className="mt-1 text-xs uppercase tracking-[0.2em] text-gray-500">Books Purchased</p>
          </div>
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5 text-center">
            <p className="text-2xl font-bold text-[#d4af37]">
              {user.role === "admin" ? "Admin" : "Member"}
            </p>
            <p className="mt-1 text-xs uppercase tracking-[0.2em] text-gray-500">Account Type</p>
          </div>
        </div>

        {/* Purchased books */}
        <div className="mt-8 rounded-2xl border border-white/5 bg-white/[0.02] p-6">
          <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#d4af37]">
            <BookOpen className="h-4 w-4" /> Your Library
          </h2>
          {!user.purchasedBookIds?.length ? (
            <p className="mt-4 text-sm text-gray-500">
              You haven't purchased any books yet.{" "}
              <a href="/books" className="text-[#f3e5ab] hover:underline">Browse the library →</a>
            </p>
          ) : (
            <p className="mt-4 text-sm text-gray-400">
              {user.purchasedBookIds.length} book{user.purchasedBookIds.length > 1 ? "s" : ""} unlocked.{" "}
              <a href="/books" className="text-[#f3e5ab] hover:underline">Go to library →</a>
            </p>
          )}
        </div>

      </div>
    </div>
  );
}
