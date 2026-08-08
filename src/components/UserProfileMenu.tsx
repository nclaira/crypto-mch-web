"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LogOut, User, Settings } from "lucide-react";
import { useCryptoAuth } from "@/lib/auth";
import Link from "next/link";

export default function UserProfileMenu() {
  const { user, setUser } = useCryptoAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    setUser(null);
    setOpen(false);
    router.push("/");
  };

  if (!user) return null;

  const initial = user.username.charAt(0).toUpperCase();

  return (
    <div className="relative" ref={ref}>
      {/* Avatar button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-xl border border-[#d4af37]/30 px-2 py-1.5 transition hover:border-[#d4af37]"
      >
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[#d4af37] to-[#8a6d1f] text-xs font-bold text-black">
          {initial}
        </div>
        <span className="text-xs font-medium text-gray-200">{user.username}</span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-52 rounded-xl border border-[#d4af37]/20 bg-[#0d1117] shadow-xl shadow-black/50 z-50">
          {/* User info */}
          <div className="border-b border-[#d4af37]/10 px-4 py-3">
            <p className="text-sm font-semibold text-gray-100">{user.username}</p>
            <p className="mt-0.5 text-xs text-gray-500 truncate">{user.email}</p>
          </div>

          {/* Links */}
          <div className="p-1.5">
            <Link
              href="/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-gray-300 transition hover:bg-white/5 hover:text-[#f3e5ab]"
            >
              <User className="h-4 w-4" />
              Your Profile
            </Link>
            <Link
              href="/settings"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-gray-300 transition hover:bg-white/5 hover:text-[#f3e5ab]"
            >
              <Settings className="h-4 w-4" />
              Settings
            </Link>
          </div>

          {/* Sign out */}
          <div className="border-t border-[#d4af37]/10 p-1.5">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-red-400 transition hover:bg-red-500/10"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
