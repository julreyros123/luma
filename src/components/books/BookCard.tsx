import Image from "next/image";
import Link from "next/link";
import { Star, BookOpen } from "lucide-react";
import { Book } from "@/types";
import { formatAuthors, truncate } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface BookCardProps {
  book: Book;
  variant?: "grid" | "list";
}

export function BookCard({ book, variant = "grid" }: BookCardProps) {
  if (variant === "list") {
    return (
      <Link href={`/books/${book.id}`} className="block group focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-2xl">
        <div className="flex gap-4 p-4 rounded-2xl border border-slate-200 bg-white hover:border-indigo-200 hover:shadow-md transition-all duration-200">
          <div className="relative flex-shrink-0 w-16 rounded-xl overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200" style={{ aspectRatio: "2/3" }}>
            {book.coverUrl ? (
              <Image src={book.coverUrl} alt={book.title} fill className="object-cover" unoptimized sizes="64px" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-slate-300" />
              </div>
            )}
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <h3 className="font-semibold text-slate-900 text-sm leading-snug line-clamp-2 group-hover:text-indigo-700 transition-colors">{book.title}</h3>
            <p className="mt-1 text-xs text-slate-500 line-clamp-1">{formatAuthors(book.authors)}</p>
            {book.averageRating && (
              <div className="mt-1.5 flex items-center gap-1">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400 flex-shrink-0" />
                <span className="text-xs font-medium text-slate-700">{book.averageRating.toFixed(1)}</span>
              </div>
            )}
            {book.description && (
              <p className="mt-2 text-xs text-slate-400 line-clamp-2 hidden sm:block">
                {truncate(book.description.replace(/<[^>]+>/g, ""), 120)}
              </p>
            )}
            {book.categories && book.categories.length > 0 && (
              <span className="mt-auto pt-2 text-xs text-indigo-600 font-medium truncate">
                {book.categories[0].split("/")[0].trim()}
              </span>
            )}
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/books/${book.id}`} className="block group focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-2xl">
      <div className="flex flex-col rounded-2xl border border-slate-200 bg-white overflow-hidden hover:border-indigo-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
        {/* Cover */}
        <div className="relative w-full bg-gradient-to-br from-slate-100 to-slate-200" style={{ paddingBottom: "150%" }}>
          {book.coverUrl ? (
            <Image
              src={book.coverUrl}
              alt={book.title}
              fill
              className="object-cover"
              unoptimized
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 200px"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-indigo-50 to-slate-100">
              <BookOpen className="h-10 w-10 text-indigo-200" />
            </div>
          )}
          {/* Rating badge */}
          {book.averageRating && (
            <div className="absolute bottom-2 right-2 flex items-center gap-0.5 rounded-full bg-black/60 backdrop-blur-sm px-2 py-1">
              <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
              <span className="text-xs font-medium text-white">{book.averageRating.toFixed(1)}</span>
            </div>
          )}
        </div>
        {/* Info */}
        <div className="p-3">
          <h3 className="font-semibold text-slate-900 text-xs leading-snug line-clamp-2 group-hover:text-indigo-700 transition-colors">
            {book.title}
          </h3>
          <p className="mt-1 text-xs text-slate-400 line-clamp-1 font-medium">
            {formatAuthors(book.authors)}
          </p>
          {book.categories && book.categories.length > 0 && (
            <span className="mt-1.5 inline-block text-xs text-indigo-500 font-medium truncate max-w-full">
              {book.categories[0].split("/")[0].trim()}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
