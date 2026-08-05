"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, LogOut, ShieldCheck } from "lucide-react";
import { useCryptoAuth } from "@/lib/auth";

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, setUser } = useCryptoAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => setMenuOpen(false), [pathname]);

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const handleLogout = () => {
    setUser(null);
    router.push("/");
  };

  const links = [
    { to: "/", label: "Home" },
    { to: "/categories", label: "Categories" },
    { to: "/books", label: "Books" },
    { to: "/trending", label: "Trending" },
    { to: "/contact", label: "Contact" },
  ];

  const isActive = (to: string) =>
    to === "/" ? pathname === "/" : pathname?.startsWith(to);

  return (
    <nav className="sticky top-0 z-50 border-b border-[#d4af37]/15 bg-[#0d1117]/95 backdrop-blur-xl">
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#d4af37]/70 to-transparent" />

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">

        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <div className="h-9 w-9 overflow-hidden rounded-full ring-1 ring-[#d4af37]/40">
            <img src="/assets/logo.jpeg" alt="logo" className="h-full w-full object-cover" />
          </div>
          <div className="leading-tight">
            <div className="text-[9px] uppercase tracking-[0.3em] text-gray-400">Mucamanza</div>
            <div className="bg-gradient-to-r from-[#f3e5ab] via-[#d4af37] to-[#f3e5ab] bg-clip-text text-sm font-bold tracking-wider text-transparent">
              CRYPTO HUB
            </div>
          </div>
        </Link>

        {/* Desktop nav links */}
        {isDesktop && (
          <div className="flex items-center gap-6">
            {links.map((l) => (
              <Link
                key={l.to}
                href={l.to}
                className={`relative text-sm uppercase tracking-[0.15em] transition ${
                  isActive(l.to) ? "text-[#f3e5ab]" : "text-gray-300 hover:text-[#f3e5ab]"
                }`}
              >
                {l.label}
                {isActive(l.to) && (
                  <span className="absolute -bottom-1 left-0 right-0 mx-auto h-px w-6 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent" />
                )}
              </Link>
            ))}
          </div>
        )}

        {/* Desktop auth */}
        {isDesktop && (
          <div className="flex items-center gap-2">
            {user?.role === "admin" && (
              <Link
                href="/admin"
                className="flex items-center gap-1.5 rounded-lg border border-purple-500/40 px-3 py-1.5 text-xs font-semibold text-purple-300 transition hover:border-purple-400"
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                Admin
              </Link>
            )}
            {!user ? (
              <>
                <Link
                  href="/login"
                  className="rounded-lg border border-[#d4af37]/30 px-3 py-1.5 text-xs font-medium text-gray-200 transition hover:border-[#d4af37] hover:text-[#f3e5ab]"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="rounded-lg bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#d4af37] px-3 py-1.5 text-xs font-semibold text-black transition hover:scale-[1.03]"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 rounded-lg border border-[#d4af37]/30 px-3 py-1.5 text-xs font-medium text-gray-200 transition hover:border-[#d4af37] hover:text-[#f3e5ab]"
              >
                <LogOut className="h-3.5 w-3.5" />
                Logout
              </button>
            )}
          </div>
        )}

        {/* Mobile hamburger */}
        {!isDesktop && (
          <button
            className="rounded-md p-2 text-gray-200 hover:text-[#f3e5ab] transition"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        )}
      </div>

      {/* Mobile dropdown */}
      {!isDesktop && menuOpen && (
        <div className="border-t border-[#d4af37]/15 bg-[#0d1117] px-4 pb-5 pt-3">
          <div className="flex flex-col gap-1">
            {links.map((l) => (
              <Link
                key={l.to}
                href={l.to}
                className={`rounded-lg px-3 py-2.5 text-sm uppercase tracking-[0.15em] transition ${
                  isActive(l.to)
                    ? "bg-[#d4af37]/10 text-[#f3e5ab]"
                    : "text-gray-300 hover:bg-white/5 hover:text-[#f3e5ab]"
                }`}
              >
                {l.label}
              </Link>
            ))}
            {user?.role === "admin" && (
              <Link
                href="/admin"
                className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold text-purple-300 hover:bg-white/5 transition"
              >
                <ShieldCheck className="h-4 w-4" />
                Admin Panel
              </Link>
            )}
          </div>
          <div className="mt-4 flex gap-2">
            {!user ? (
              <>
                <Link href="/login" className="flex-1 rounded-xl border border-[#d4af37]/30 py-2.5 text-center text-sm font-medium text-gray-200 hover:border-[#d4af37] transition">
                  Login
                </Link>
                <Link href="/signup" className="flex-1 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#d4af37] py-2.5 text-center text-sm font-semibold text-black transition">
                  Sign Up
                </Link>
              </>
            ) : (
              <button onClick={handleLogout} className="w-full rounded-xl border border-[#d4af37]/30 py-2.5 text-sm text-gray-200 hover:border-[#d4af37] transition">
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
