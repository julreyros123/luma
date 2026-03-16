"use client";

import { Book } from "@/types";
import { BookCard } from "@/components/books/BookCard";
import { Loader2, BookX, LayoutGrid, List } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface SearchResultsProps {
  books: Book[];
  isLoading?: boolean;
  error?: string;
  query?: string;
  totalItems?: number;
}

export function SearchResults({ books, isLoading, error, query, totalItems }: SearchResultsProps) {
  const [layout, setLayout] = useState<"grid" | "list">("grid");

  if (isLoading) {
    return (
      <div>
        <div className="flex items-center justify-between mb-5">
          <div className="h-4 w-48 bg-slate-100 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="rounded-2xl overflow-hidden">
              <div className="bg-slate-100 animate-pulse" style={{ paddingBottom: "150%" }} />
              <div className="p-3 space-y-2 bg-white border border-slate-100 rounded-b-2xl">
                <div className="h-3 w-full bg-slate-100 rounded animate-pulse" />
                <div className="h-3 w-2/3 bg-slate-100 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <BookX className="h-10 w-10 text-red-400" />
        <p className="text-slate-700 font-medium">Something went wrong</p>
        <p className="text-slate-500 text-sm text-center max-w-xs">{error}</p>
      </div>
    );
  }

  if (!query) return null;

  if (books.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <BookX className="h-10 w-10 text-slate-300" />
        <p className="text-slate-700 font-medium">No books found</p>
        <p className="text-slate-500 text-sm">Try a different search term or remove filters</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">
          {totalItems ? (
            <>Showing <span className="font-medium text-slate-700">{books.length}</span> of <span className="font-medium text-slate-700">{totalItems.toLocaleString()}</span> results for <span className="font-semibold text-slate-900">"{query}"</span></>
          ) : (
            <>Results for <span className="font-semibold text-slate-900">"{query}"</span></>
          )}
        </p>
        <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white p-1">
          <button
            onClick={() => setLayout("grid")}
            className={cn("rounded-lg p-1.5 transition-colors", layout === "grid" ? "bg-indigo-100 text-indigo-700" : "text-slate-400 hover:text-slate-700")}
            title="Grid view"
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setLayout("list")}
            className={cn("rounded-lg p-1.5 transition-colors", layout === "list" ? "bg-indigo-100 text-indigo-700" : "text-slate-400 hover:text-slate-700")}
            title="List view"
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Results */}
      {layout === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {books.map((book) => (
            <BookCard key={book.id} book={book} variant="grid" />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {books.map((book) => (
            <BookCard key={book.id} book={book} variant="list" />
          ))}
        </div>
      )}
    </div>
  );
}
