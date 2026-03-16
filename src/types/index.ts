// Google Books API types
export interface GoogleBookVolume {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    description?: string;
    imageLinks?: {
      thumbnail?: string;
      smallThumbnail?: string;
    };
    publishedDate?: string;
    pageCount?: number;
    categories?: string[];
    industryIdentifiers?: Array<{
      type: string;
      identifier: string;
    }>;
    language?: string;
    previewLink?: string;
    averageRating?: number;
    ratingsCount?: number;
    infoLink?: string;
  };
  saleInfo?: {
    buyLink?: string;
    listPrice?: {
      amount: number;
      currencyCode: string;
    };
  };
}

// Normalized book type used throughout the app
export interface Book {
  id: string;
  title: string;
  authors: string[];
  description?: string;
  coverUrl?: string;
  publishedDate?: string;
  pageCount?: number;
  categories?: string[];
  isbn?: string;
  language?: string;
  previewLink?: string;
  buyLink?: string;
  averageRating?: number;
  ratingsCount?: number;
}

export interface GoogleBooksResponse {
  totalItems: number;
  items?: GoogleBookVolume[];
}

export interface SearchState {
  query: string;
  results: Book[];
  isLoading: boolean;
  error?: string;
  totalItems?: number;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}
