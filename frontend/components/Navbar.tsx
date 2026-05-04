"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowRight, CandlestickChart, LogOut, WalletCards } from "lucide-react";
import { formatCredits } from "@/lib/mockData";
import { useAuthStore } from "@/store/authStore";
import { useWalletStore } from "@/store/walletStore";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/markets", label: "Markets" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/copy-trading", label: "Copy Trading" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/wallet", label: "Wallet" },
  { href: "/admin", label: "Admin" },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const balance = useWalletStore((state) => state.balance);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  function handleLogout() {
    logout();
    router.push("/");
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#05070f]/78 backdrop-blur-xl">
      <nav className="section-container flex flex-wrap items-center justify-between gap-3 py-3">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-cyan-300">
            <CandlestickChart className="h-4 w-4" aria-hidden="true" />
          </span>
          <span>
            <span className="block text-sm font-semibold text-white">PolyTrade</span>
            <span className="block text-[10px] font-medium uppercase tracking-[0.18em] text-slate-500">
              Markets
            </span>
          </span>
        </Link>

        <div className="hidden max-w-[58vw] items-center gap-1 overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.035] p-1 lg:flex lg:max-w-none">
          {navItems.map((item) => {
            const active =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-xl px-3 py-2 text-sm font-medium transition duration-200 ${
                  active
                    ? "bg-white/[0.09] text-white"
                    : "text-slate-400 hover:bg-white/[0.06] hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <Link
                href="/wallet"
                className="hidden items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-medium text-slate-200 transition duration-200 hover:border-white/20 hover:bg-white/[0.07] md:flex"
              >
                <WalletCards className="h-4 w-4 text-cyan-300" aria-hidden="true" />
                {formatCredits(balance)}
              </Link>
              <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] px-2 py-1.5">
                <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-gradient-to-r from-cyan-300 to-blue-400 text-xs font-semibold text-slate-950">
                  {user?.avatarInitials ?? "PT"}
                </span>
                <span className="hidden max-w-24 truncate text-sm font-medium text-white sm:block">
                  {user?.username ?? "trader"}
                </span>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="hidden items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm font-medium text-slate-400 transition duration-200 hover:border-white/20 hover:bg-white/[0.06] hover:text-white sm:flex"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden rounded-2xl px-3 py-2 text-sm font-medium text-slate-400 transition duration-200 hover:bg-white/[0.06] hover:text-white sm:inline-flex"
              >
                Log in
              </Link>
              <Link href="/register" className="premium-button hidden rounded-2xl px-4 py-2 sm:inline-flex">
                Get started
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </>
          )}
        </div>

        <div className="flex w-full gap-1 overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.035] p-1 lg:hidden">
          {navItems.map((item) => {
            const active =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`shrink-0 rounded-xl px-3 py-2 text-xs font-medium transition ${
                  active
                    ? "bg-white/[0.09] text-white"
                    : "text-slate-400 hover:bg-white/[0.06] hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
