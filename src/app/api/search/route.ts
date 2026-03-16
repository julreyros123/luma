import { NextRequest, NextResponse } from "next/server";
import { searchBooks } from "@/lib/google-books";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");
  const page = parseInt(searchParams.get("page") ?? "1", 10);
  const maxResults = parseInt(searchParams.get("limit") ?? "20", 10);

  if (!query || query.trim().length === 0) {
    return NextResponse.json({ error: "Query parameter 'q' is required" }, { status: 400 });
  }

  try {
    const startIndex = (page - 1) * maxResults;
    const { books, totalItems } = await searchBooks({
      query: query.trim(),
      maxResults,
      startIndex,
    });

    return NextResponse.json({ books, totalItems, page, query });
  } catch (error) {
    console.error("[Search API] Error:", error);
    return NextResponse.json(
      { error: "Failed to search books. Please try again." },
      { status: 500 }
    );
  }
}
