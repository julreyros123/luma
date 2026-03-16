"use client";

import Link from "next/link";
import { BookOpen, Search, Sparkles, Menu, X, LogIn, UserPlus } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState, Suspense } from "react";
import { cn } from "@/lib/utils";
import { SearchBar } from "@/components/search/SearchBar";

export function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: "/search", icon: Search, label: "Explore" },
    { href: "/ask", icon: Sparkles, label: "Ask AI" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
            <BookOpen className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-bold text-slate-900 hidden sm:block">Luma</span>
        </Link>

        {/* Center search hidden on home */}
        {!isHome && (
          <div className="flex-1 hidden sm:block max-w-lg mx-auto">
            <SearchBar size="sm" />
          </div>
        )}

        {/* Spacer on home */}
        {isHome && <div className="flex-1" />}

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-1">
          {navLinks.map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                pathname.startsWith(href)
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
          <div className="w-px h-5 bg-slate-200 mx-1" />
          <Link href="/sign-in" className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors">
            <LogIn className="h-4 w-4" />
            Sign in
          </Link>
          <Link href="/sign-up" className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors ml-1">
            <UserPlus className="h-4 w-4" />
            Sign up
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="sm:hidden ml-auto p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="sm:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-3">
          <SearchBar size="sm" />
          <nav className="flex flex-col gap-1">
            {navLinks.map(({ href, icon: Icon, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                  pathname.startsWith(href)
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-slate-700 hover:bg-slate-50"
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </nav>
          <div className="border-t border-slate-100 pt-3 grid grid-cols-2 gap-2">
            <Link href="/sign-in" onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
              <LogIn className="h-4 w-4" />
              Sign in
            </Link>
            <Link href="/sign-up" onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors">
              <UserPlus className="h-4 w-4" />
              Sign up
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
