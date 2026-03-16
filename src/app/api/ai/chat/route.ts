import { streamText } from "ai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

function getModel() {
  if (process.env.ANTHROPIC_API_KEY) {
    const anthropic = createAnthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    return anthropic("claude-haiku-4-5");
  }
  const google = createGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY!,
  });
  return google("gemini-2.0-flash");
}

const SYSTEM_PROMPT = `You are Luma, an intelligent book discovery assistant. You help readers find their next great book.

Your capabilities:
- Recommend books based on themes, mood, genres, or books they have enjoyed
- Explain why a book might appeal to a specific reader
- Compare books and series
- Suggest reading order for series or by author
- Discuss themes, writing style, and what makes books unique

Guidelines:
- Be enthusiastic but concise
- Give 3-5 recommendations when asked, with a short reason for each
- Always mention the author with the book title
- Summarise without major spoilers
- Format lists clearly with dashes or numbers`;

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: "Invalid messages" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const result = streamText({
      model: getModel(),
      system: SYSTEM_PROMPT,
      messages,
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("[AI Chat] Error:", error);
    return new Response(JSON.stringify({ error: "AI service unavailable" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
