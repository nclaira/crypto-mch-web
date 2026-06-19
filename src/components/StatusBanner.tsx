// Floating Live Access Status badge — bottom-right corner
// Reflects the current session data from the backend JWT payload.

"use client";
import { useCryptoAuth } from "@/lib/auth";
import { User2, ShieldCheck, ShieldOff } from "lucide-react";

const StatusBanner = () => {
  const { user } = useCryptoAuth();

  const isGuest = !user;
  const paid = user?.isPaid;

  return (
    <div className="fixed bottom-4 right-4 z-40">
      <div
        className="rounded-full p-[1px] shadow-[0_0_25px_-5px_rgba(212,175,55,0.5)]"
        style={{ backgroundImage: "linear-gradient(135deg,#d4af37,#9ca3af,#d4af37)" }}
      >
        <div className="flex items-center gap-2 rounded-full bg-[#0d1117]/95 px-3 py-2 text-xs backdrop-blur">
          {isGuest ? (
            <User2 className="h-3.5 w-3.5 text-gray-400" />
          ) : paid ? (
            <ShieldCheck className="h-3.5 w-3.5 text-[#d4af37]" />
          ) : (
            <ShieldOff className="h-3.5 w-3.5 text-gray-400" />
          )}

          <span className="text-gray-400 uppercase tracking-[0.15em]">Access:</span>

          {isGuest ? (
            <span className="font-semibold text-gray-200">Guest</span>
          ) : (
            <>
              <span className="font-semibold text-[#f3e5ab]">{user!.username}</span>
              <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-gray-300">
                {user!.role}
              </span>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wider ${
                  paid
                    ? "bg-[#d4af37]/20 text-[#f3e5ab] border border-[#d4af37]/40"
                    : "bg-gray-700/40 text-gray-300 border border-gray-600/40"
                }`}
              >
                {paid ? "Premium" : "Free"}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatusBanner;
