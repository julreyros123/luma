"use client";

import { useState, useRef, useEffect, useCallback, Suspense } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  className?: string;
  autoFocus?: boolean;
  onSearch?: (query: string) => void;
  size?: "sm" | "lg";
  dark?: boolean;
}

function SearchBarInner({ className, autoFocus, onSearch, size = "sm", dark }: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus) setTimeout(() => inputRef.current?.focus(), 100);
  }, [autoFocus]);

  // Sync with URL changes
  useEffect(() => {
    const q = searchParams.get("q") ?? "";
    setQuery(q);
  }, [searchParams]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = query.trim();
      if (!trimmed) return;
      if (onSearch) {
        setIsSearching(true);
        onSearch(trimmed);
        setIsSearching(false);
      } else {
        router.push(`/search?q=${encodeURIComponent(trimmed)}`);
      }
    },
    [query, onSearch, router]
  );

  const handleClear = () => {
    setQuery("");
    inputRef.current?.focus();
  };

  const isLarge = size === "lg";

  return (
    <form onSubmit={handleSubmit} className={cn("w-full", className)}>
      <div className="relative flex items-center">
        <Search
          className={cn(
            "pointer-events-none absolute text-slate-400",
            isLarge ? "left-4 h-5 w-5" : "left-3 h-4 w-4",
            dark && "text-slate-300"
          )}
        />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={isLarge ? "Search books, authors, genres…" : "Search books…"}
          className={cn(
            "w-full rounded-xl border text-sm transition-all pr-12",
            "focus:outline-none focus:ring-2 focus:border-transparent",
            isLarge ? "h-14 pl-12 text-base" : "h-10 pl-9",
            dark
              ? "bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:ring-indigo-400 focus:bg-white/15"
              : "bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:ring-indigo-500 shadow-sm",
          )}
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className={cn(
              "absolute flex items-center justify-center rounded-full transition-colors",
              isLarge ? "right-14 h-6 w-6" : "right-11 h-5 w-5",
              dark ? "text-slate-300 hover:text-white" : "text-slate-400 hover:text-slate-600"
            )}
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
        <button
          type="submit"
          disabled={!query.trim() || isSearching}
          className={cn(
            "absolute right-2 flex items-center justify-center rounded-lg bg-indigo-600 text-white",
            "hover:bg-indigo-700 disabled:opacity-40 disabled:pointer-events-none transition-colors",
            isLarge ? "h-10 w-10" : "h-7 w-7"
          )}
        >
          {isSearching ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
        </button>
      </div>
    </form>
  );
}

export function SearchBar(props: SearchBarProps) {
  return (
    <Suspense fallback={
      <div className={cn(
        "w-full rounded-xl animate-pulse",
        props.size === "lg" ? "h-14 bg-white/10" : "h-10 bg-slate-100"
      )} />
    }>
      <SearchBarInner {...props} />
    </Suspense>
  );
}
