import { GoogleBooksResponse, Book } from "@/types";
import { normalizeGoogleBook } from "./utils";

const BASE_URL = "https://www.googleapis.com/books/v1";

interface SearchOptions {
  query: string;
  maxResults?: number;
  startIndex?: number;
  orderBy?: "relevance" | "newest";
}

export async function searchBooks({
  query,
  maxResults = 20,
  startIndex = 0,
  orderBy = "relevance",
}: SearchOptions): Promise<{ books: Book[]; totalItems: number }> {
  const apiKey = process.env.GOOGLE_BOOKS_API_KEY;

  const params = new URLSearchParams({
    q: query,
    maxResults: String(maxResults),
    startIndex: String(startIndex),
    orderBy,
    langRestrict: "en",
    printType: "books",
    ...(apiKey && { key: apiKey }),
  });

  const res = await fetch(BASE_URL + "/volumes?" + params.toString(), {
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error("Google Books API error: " + res.status + " " + res.statusText);
  }

  const data: GoogleBooksResponse = await res.json();

  return {
    books: (data.items ?? []).map(normalizeGoogleBook),
    totalItems: data.totalItems,
  };
}

export async function getBookById(id: string): Promise<Book | null> {
  const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
  const params = new URLSearchParams(apiKey ? { key: apiKey } : {});

  const res = await fetch(BASE_URL + "/volumes/" + id + "?" + params.toString(), {
    next: { revalidate: 86400 },
  });

  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error("Google Books API error: " + res.status + " " + res.statusText);
  }

  const data = await res.json();
  return normalizeGoogleBook(data);
}
