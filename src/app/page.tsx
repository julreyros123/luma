import { Suspense } from "react";
import { Sparkles, TrendingUp, BookOpen, Star, Zap } from "lucide-react";
import { SearchBar } from "@/components/search/SearchBar";
import { searchBooks } from "@/lib/google-books";
import { BookCard } from "@/components/books/BookCard";
import Link from "next/link";

const GENRES = [
  { label: "Sci-Fi", emoji: "🚀", q: "science fiction" },
  { label: "Fantasy", emoji: "🧙", q: "epic fantasy" },
  { label: "Mystery", emoji: "🔍", q: "mystery thriller" },
  { label: "Romance", emoji: "💕", q: "romance novels" },
  { label: "Self Help", emoji: "✨", q: "self improvement" },
  { label: "History", emoji: "📜", q: "world history" },
  { label: "Biography", emoji: "👤", q: "biography memoir" },
  { label: "Business", emoji: "💼", q: "business strategy" },
];

const QUICK_SEARCHES = ["science fiction classics", "mindfulness", "historical fiction", "startup stories"];

async function TrendingBooks() {
  try {
    const { books } = await searchBooks({ query: "bestseller fiction 2024", maxResults: 6 });
    if (!books.length) return null;
    return (
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-indigo-600" />
              <h2 className="text-xl font-bold text-slate-900">Trending Now</h2>
            </div>
            <Link href="/search?q=bestseller+2024" className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors">
              See all
            </Link>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 sm:gap-4">
            {books.map((book) => (
              <BookCard key={book.id} book={book} variant="grid" />
            ))}
          </div>
        </div>
      </section>
    );
  } catch {
    return null;
  }
}

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-indigo-600/20 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-purple-600/20 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 py-20 sm:py-28 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-sm font-medium text-indigo-300 mb-6">
            <Sparkles className="h-3.5 w-3.5" />
            AI-powered book discovery
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight">
            Find your next
            <span className="block text-indigo-400">favourite book</span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-400 max-w-xl mx-auto">
            Search 40 million books, get AI recommendations, and build your perfect reading list.
          </p>

          <div className="mt-8 max-w-xl mx-auto">
            <Suspense fallback={<div className="h-14 w-full rounded-xl bg-white/10 animate-pulse" />}>
              <SearchBar size="lg" autoFocus dark />
            </Suspense>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs text-slate-500">Try:</span>
            {QUICK_SEARCHES.map((q) => (
              <Link
                key={q}
                href={`/search?q=${encodeURIComponent(q)}`}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
              >
                {q}
              </Link>
            ))}
          </div>

          <div className="mt-12 flex items-center justify-center gap-8 sm:gap-14">
            {[
              { icon: BookOpen, value: "40M+", label: "Books" },
              { icon: Star, value: "Free", label: "To use" },
              { icon: Zap, value: "AI", label: "Powered" },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex flex-col items-center gap-1">
                <Icon className="h-4 w-4 text-indigo-400 mb-0.5" />
                <span className="text-xl font-bold text-white">{value}</span>
                <span className="text-xs text-slate-500">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Genre grid */}
      <section className="py-12 bg-slate-50 border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <h2 className="text-lg font-bold text-slate-900 mb-5">Explore by genre</h2>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-2 sm:gap-3">
            {GENRES.map(({ label, emoji, q }) => (
              <Link
                key={q}
                href={`/search?q=${encodeURIComponent(q)}`}
                className="flex flex-col items-center gap-2 rounded-xl border border-slate-200 bg-white p-3 sm:p-4 hover:border-indigo-300 hover:bg-indigo-50 hover:shadow-sm transition-all group"
              >
                <span className="text-2xl">{emoji}</span>
                <span className="text-xs font-medium text-slate-600 group-hover:text-indigo-700 text-center leading-tight transition-colors">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trending */}
      <div className="bg-white">
        <Suspense
          fallback={
            <section className="py-16">
              <div className="mx-auto max-w-7xl px-4 sm:px-6">
                <div className="h-7 w-36 rounded-lg bg-slate-100 animate-pulse mb-8" />
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 sm:gap-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="rounded-2xl bg-slate-100 animate-pulse" style={{ paddingBottom: "150%" }} />
                  ))}
                </div>
              </div>
            </section>
          }
        >
          <TrendingBooks />
        </Suspense>
      </div>

      {/* AI CTA */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-indigo-600 to-purple-700">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 mb-4">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Not sure what to read?</h2>
          <p className="mt-3 text-indigo-200 text-sm sm:text-base max-w-md mx-auto">
            Describe your mood, a book you loved, or a topic — Luma AI finds the perfect match instantly.
          </p>
          <Link
            href="/ask"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-indigo-700 hover:bg-indigo-50 transition-colors shadow-lg"
          >
            <Sparkles className="h-4 w-4" />
            Ask Luma AI
          </Link>
        </div>
      </section>
    </div>
  );
}
