"use client";

import { useCryptoAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Settings, Mail, User, LogOut } from "lucide-react";

export default function SettingsPage() {
  const { user, setUser } = useCryptoAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) router.push("/login");
  }, [user]);

  if (!user) return null;

  const handleLogout = () => {
    setUser(null);
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-white px-4 py-16">
      <div className="mx-auto max-w-xl">

        <div className="flex items-center gap-3 mb-8">
          <Settings className="h-6 w-6 text-[#d4af37]" />
          <h1 className="text-2xl font-bold text-gray-100">Settings</h1>
        </div>

        {/* Account info */}
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] divide-y divide-white/5">
          <div className="flex items-center gap-4 p-5">
            <User className="h-5 w-5 shrink-0 text-[#d4af37]" />
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Username</p>
              <p className="mt-0.5 text-sm font-medium text-gray-100">{user.username}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-5">
            <Mail className="h-5 w-5 shrink-0 text-[#d4af37]" />
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Email</p>
              <p className="mt-0.5 text-sm font-medium text-gray-100">{user.email}</p>
            </div>
          </div>
        </div>

        <p className="mt-4 text-xs text-gray-600">
          To change your username or password, please contact support.
        </p>

        {/* Sign out */}
        <div className="mt-10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-xl border border-red-500/30 px-5 py-3 text-sm font-medium text-red-400 transition hover:bg-red-500/10"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>

      </div>
    </div>
  );
}
