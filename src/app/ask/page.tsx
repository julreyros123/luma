"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Sparkles, Send, BookOpen, Loader2 } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const STARTER_PROMPTS = [
  "I loved The Martian — what should I read next?",
  "Best sci-fi books for someone new to the genre?",
  "Recommend books similar to Atomic Habits",
  "Dark fantasy series with complex magic systems",
];

function getTextFromParts(parts: unknown[]): string {
  return parts
    .filter((p: unknown) => (p as { type: string }).type === "text")
    .map((p: unknown) => (p as { text: string }).text)
    .join("");
}

export default function AskPage() {
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/ai/chat" }),
  });
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const isLoading = status === "submitted" || status === "streaming";

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleStarterClick = (prompt: string) => {
    setInput(prompt);
    inputRef.current?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    sendMessage({ text: trimmed });
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="border-b border-slate-200 bg-white px-4 sm:px-6 py-4">
        <div className="mx-auto max-w-3xl flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="font-semibold text-slate-900">Ask Luma</h1>
            <p className="text-xs text-slate-500">Your AI book discovery assistant</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 py-6">
          {isEmpty ? (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-indigo-200 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-slate-900 mb-2">
                What are you looking to read?
              </h2>
              <p className="text-slate-500 text-sm mb-8">
                Ask me anything and I will find the perfect book for you.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-lg mx-auto">
                {STARTER_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handleStarterClick(prompt)}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 text-left hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((message) => {
                const text = getTextFromParts(message.parts as unknown[]);
                return (
                  <div
                    key={message.id}
                    className={cn(
                      "flex gap-3",
                      message.role === "user" ? "flex-row-reverse" : "flex-row"
                    )}
                  >
                    <div
                      className={cn(
                        "flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center text-sm",
                        message.role === "user"
                          ? "bg-indigo-600 text-white font-medium"
                          : "bg-slate-100 text-slate-600"
                      )}
                    >
                      {message.role === "user" ? "You" : <Sparkles className="h-4 w-4" />}
                    </div>
                    <div
                      className={cn(
                        "max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap",
                        message.role === "user"
                          ? "bg-indigo-600 text-white rounded-tr-sm"
                          : "bg-white border border-slate-200 text-slate-800 rounded-tl-sm shadow-sm"
                      )}
                    >
                      {text}
                    </div>
                  </div>
                );
              })}
              {isLoading && (
                <div className="flex gap-3">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-slate-600" />
                  </div>
                  <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                    <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-slate-200 bg-white px-4 sm:px-6 py-4">
        <form onSubmit={handleSubmit} className="mx-auto max-w-3xl flex items-end gap-3">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about books, genres, or get a recommendation..."
            rows={1}
            className={cn(
              "flex-1 resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900",
              "placeholder:text-slate-400 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent",
              "max-h-32 overflow-y-auto"
            )}
            style={{ minHeight: "44px" }}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:pointer-events-none transition-colors"
          >
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          </button>
        </form>
        <p className="mt-2 text-center text-xs text-slate-400 mx-auto max-w-3xl">
          Press Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
