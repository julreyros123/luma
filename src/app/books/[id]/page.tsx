import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Star, BookOpen, ExternalLink, ShoppingCart, ChevronLeft, Calendar, Hash } from "lucide-react";
import { getBookById } from "@/lib/google-books";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatAuthors } from "@/lib/utils";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const book = await getBookById(id);
  if (!book) return { title: "Book not found" };
  return {
    title: book.title + " by " + formatAuthors(book.authors),
    description: book.description?.replace(/<[^>]+>/g, "").slice(0, 160),
    openGraph: {
      images: book.coverUrl ? [book.coverUrl] : [],
    },
  };
}

export default async function BookPage({ params }: Props) {
  const { id } = await params;
  const book = await getBookById(id);
  if (!book) notFound();

  const description = book.description?.replace(/<[^>]+>/g, "") ?? "No description available.";

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8">
      <Link
        href="/search"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 mb-8 transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to search
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-8 lg:gap-12">
        {/* Cover */}
        <div className="flex flex-col items-center md:items-start gap-4">
          <div
            className="relative w-48 md:w-full rounded-xl overflow-hidden bg-slate-100 shadow-md"
            style={{ aspectRatio: "2/3" }}
          >
            {book.coverUrl ? (
              <Image
                src={book.coverUrl}
                alt={"Cover of " + book.title}
                fill
                className="object-cover"
                priority
                unoptimized
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <BookOpen className="h-12 w-12 text-slate-300" />
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2 w-full max-w-[220px]">
            {book.buyLink && (
              <Button asChild size="md" variant="primary" className="w-full">
                <a href={book.buyLink} target="_blank" rel="noopener noreferrer">
                  <ShoppingCart className="h-4 w-4" />
                  Buy Book
                </a>
              </Button>
            )}
            {book.previewLink && (
              <Button asChild size="md" variant="outline" className="w-full">
                <a href={book.previewLink} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                  Preview
                </a>
              </Button>
            )}
          </div>
        </div>

        {/* Details */}
        <div>
          {book.categories && book.categories.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {book.categories.slice(0, 3).map((cat) => (
                <Badge key={cat} variant="default">
                  {cat.split("/")[0].trim()}
                </Badge>
              ))}
            </div>
          )}
          <h1 className="text-3xl font-bold text-slate-900 leading-tight">{book.title}</h1>
          <p className="mt-2 text-lg text-slate-600">{formatAuthors(book.authors)}</p>

          {book.averageRating && (
            <div className="mt-3 flex items-center gap-2">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={"h-4 w-4 " + (i < Math.round(book.averageRating!) ? "fill-amber-400 text-amber-400" : "text-slate-200")}
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-slate-700">{book.averageRating.toFixed(1)}</span>
              {book.ratingsCount && (
                <span className="text-sm text-slate-400">({book.ratingsCount.toLocaleString()} ratings)</span>
              )}
            </div>
          )}

          <div className="mt-5 flex flex-wrap gap-4">
            {book.publishedDate && (
              <div className="flex items-center gap-1.5 text-sm text-slate-500">
                <Calendar className="h-4 w-4" />
                {book.publishedDate}
              </div>
            )}
            {book.pageCount && (
              <div className="flex items-center gap-1.5 text-sm text-slate-500">
                <BookOpen className="h-4 w-4" />
                {book.pageCount.toLocaleString()} pages
              </div>
            )}
            {book.isbn && (
              <div className="flex items-center gap-1.5 text-sm text-slate-500">
                <Hash className="h-4 w-4" />
                ISBN: {book.isbn}
              </div>
            )}
          </div>

          <div className="mt-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 mb-3">
              About this book
            </h2>
            <p className="text-slate-700 leading-relaxed whitespace-pre-line">{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
