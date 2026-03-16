"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { SearchResults } from "@/components/search/SearchResults";
import { Book } from "@/types";
import { SlidersHorizontal, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

const SORT_OPTIONS = [
  { value: "relevance", label: "Most Relevant" },
  { value: "newest", label: "Newest First" },
];

const FILTERS = [
  { value: "", label: "All" },
  { value: "fiction", label: "Fiction" },
  { value: "science fiction", label: "Sci-Fi" },
  { value: "fantasy", label: "Fantasy" },
  { value: "mystery", label: "Mystery" },
  { value: "romance", label: "Romance" },
  { value: "biography", label: "Biography" },
  { value: "history", label: "History" },
  { value: "self help", label: "Self Help" },
];

function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const [books, setBooks] = useState<Book[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [sortBy, setSortBy] = useState<"relevance" | "newest">("relevance");
  const [filter, setFilter] = useState("");

  const effectiveQuery = query + (filter ? " " + filter : "");

  useEffect(() => {
    if (!query.trim()) { setBooks([]); setTotalItems(0); return; }
    const controller = new AbortController();
    setIsLoading(true);
    setError(undefined);
    fetch(`/api/search?q=${encodeURIComponent(effectiveQuery)}&orderBy=${sortBy}`, { signal: controller.signal })
      .then((res) => { if (!res.ok) throw new Error("Search failed: " + res.status); return res.json(); })
      .then((data) => { setBooks(data.books ?? []); setTotalItems(data.totalItems ?? 0); })
      .catch((err) => { if (err.name !== "AbortError") setError(err.message ?? "Something went wrong"); })
      .finally(() => setIsLoading(false));
    return () => controller.abort();
  }, [query, sortBy, filter, effectiveQuery]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6">
      {/* Filters — only show when there's a query */}
      {query && (
        <div className="mb-5 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          {/* Category filter chips */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <SlidersHorizontal className="h-4 w-4 text-slate-400 flex-shrink-0" />
            <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-hide">
              {FILTERS.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setFilter(value)}
                  className={cn(
                    "flex-shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-all border",
                    filter === value
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                      : "bg-white border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-700"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "relevance" | "newest")}
              className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      <SearchResults
        books={books}
        isLoading={isLoading}
        error={error}
        query={query}
        totalItems={totalItems}
      />

      {!query && !isLoading && (
        <div className="text-center py-24">
          <p className="text-slate-400 text-sm">Use the search bar above to find books</p>
        </div>
      )}
    </div>
  );
}

export default function SearchPageWrapper() {
  return (
    <Suspense>
      <SearchPage />
    </Suspense>
  );
}
