import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { GoogleBookVolume, Book } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function normalizeGoogleBook(volume: GoogleBookVolume): Book {
  const { id, volumeInfo, saleInfo } = volume;
  const isbn = volumeInfo.industryIdentifiers?.find(
    (i) => i.type === "ISBN_13" || i.type === "ISBN_10"
  )?.identifier;

  const rawCover =
    volumeInfo.imageLinks?.thumbnail ||
    volumeInfo.imageLinks?.smallThumbnail;
  const coverUrl = rawCover
    ? rawCover.replace("http://", "https://").replace("&zoom=1", "&zoom=2")
    : undefined;

  return {
    id,
    title: volumeInfo.title,
    authors: volumeInfo.authors ?? [],
    description: volumeInfo.description,
    coverUrl,
    publishedDate: volumeInfo.publishedDate,
    pageCount: volumeInfo.pageCount,
    categories: volumeInfo.categories,
    isbn,
    language: volumeInfo.language,
    previewLink: volumeInfo.previewLink,
    buyLink: saleInfo?.buyLink,
    averageRating: volumeInfo.averageRating,
    ratingsCount: volumeInfo.ratingsCount,
  };
}

export function formatAuthors(authors: string[]): string {
  if (!authors.length) return "Unknown Author";
  if (authors.length === 1) return authors[0];
  if (authors.length === 2) return authors.join(" & ");
  return authors[0] + " & " + (authors.length - 1) + " others";
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "…";
}
