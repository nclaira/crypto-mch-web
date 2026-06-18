"use client";
// =============================================================
// Navbar — sticky premium header with Mucamanza Crypto Hub logo
// =============================================================
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, LogOut } from "lucide-react";

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const user = null; // TODO: wire up your auth context
  const logout = () => {};
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => setMenuOpen(false), [pathname]);

  const handleLogout = () => {
    logout();
    router.push("/crypto");
  };

  const links = [
    { to: "/crypto", label: "Home" },
    { to: "/crypto/categories", label: "Categories" },
    { to: "/crypto/books", label: "Books" },
    { to: "/crypto/trending", label: "Trending" },
    { to: "/crypto/contact", label: "Contact" },
  ];

  const isActive = (to: string) =>
    to === "/crypto" ? pathname === "/crypto" : pathname?.startsWith(to);

  return (
    <nav className="sticky top-0 z-50 border-b border-[#d4af37]/15 bg-[#0d1117]/85 backdrop-blur-xl">
      {/* Hair-thin gold gradient bar */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#d4af37]/70 to-transparent" />

      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/crypto" className="group flex items-center gap-3">
          <div className="relative h-12 w-12 overflow-hidden rounded-full ring-1 ring-[#d4af37]/40 shadow-[0_0_25px_-6px_rgba(212,175,55,0.6)] bg-[#d4af37]/20" />
          <div className="leading-tight">
            <div className="text-[10px] uppercase tracking-[0.35em] text-gray-400">Mucamanza</div>
            <div className="bg-gradient-to-r from-[#f3e5ab] via-[#d4af37] to-[#f3e5ab] bg-clip-text text-lg font-bold tracking-wider text-transparent">
              CRYPTO HUB
            </div>
          </div>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              href={l.to}
              className={`relative text-sm uppercase tracking-[0.18em] transition ${
                isActive(l.to) ? "text-[#f3e5ab]" : "text-gray-300 hover:text-[#f3e5ab]"
              }`}
            >
              {l.label}
              {isActive(l.to) && (
                <span className="absolute -bottom-2 left-0 right-0 mx-auto h-px w-8 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent" />
              )}
            </Link>
          ))}
        </div>

        {/* Auth area (desktop) */}
        <div className="hidden items-center gap-3 md:flex">
          {!user ? (
            <>
              <Link
                href="/crypto/login"
                className="rounded-lg border border-[#d4af37]/30 px-4 py-2 text-sm font-medium tracking-wide text-gray-200 transition hover:border-[#d4af37] hover:text-[#f3e5ab]"
              >
                Login
              </Link>
              <Link
                href="/crypto/signup"
                className="rounded-lg bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#d4af37] px-4 py-2 text-sm font-semibold tracking-wide text-black shadow-[0_8px_25px_-10px_rgba(212,175,55,0.7)] transition hover:scale-[1.03]"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-lg border border-[#d4af37]/30 px-4 py-2 text-sm font-medium text-gray-200 transition hover:border-[#d4af37] hover:text-[#f3e5ab]"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="rounded-md p-2 text-gray-200 md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="border-t border-[#d4af37]/15 bg-[#0d1117]/95 px-4 py-4 md:hidden">
          {links.map((l) => (
            <Link
              key={l.to}
              href={l.to}
              className="block py-2 text-sm uppercase tracking-[0.18em] text-gray-300 hover:text-[#f3e5ab]"
            >
              {l.label}
            </Link>
          ))}
          <div className="mt-3 flex gap-2">
            {!user ? (
              <>
                <Link href="/crypto/login" className="flex-1 rounded-lg border border-[#d4af37]/30 py-2 text-center text-sm">Login</Link>
                <Link href="/crypto/signup" className="flex-1 rounded-lg bg-gradient-to-r from-[#d4af37] to-[#f3e5ab] py-2 text-center text-sm font-semibold text-black">Sign Up</Link>
              </>
            ) : (
              <button onClick={handleLogout} className="w-full rounded-lg border border-[#d4af37]/30 py-2 text-sm">Logout</button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
