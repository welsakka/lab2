"use client";

import { useState, useRef, useEffect, useId } from "react";
import { Send, Bot, User, AlertCircle } from "lucide-react";
import { streamAICoach } from "@/lib/api";
import type { Message } from "@/types";

const SUGGESTED = [
  "Is AAPL halal to invest in?",
  "How much should I invest monthly to retire at 55?",
  "Explain the Buffered Arbitrage Cycle to me",
  "What's the nisab for Zakat this year?",
  "Are target-date funds halal?",
];

const WELCOME: Message = {
  id: "welcome",
  role: "assistant",
  content: `Assalamu alaikum! I'm your AI financial coach — I have context on your portfolio, goals, and halal finance principles.

I can help you with:
- Stock screening & compliance questions
- Retirement and financial planning
- Zakat calculation
- Credit card optimization (Buffered Arbitrage Cycle)
- Anything else halal finance related

What would you like to explore?`,
  timestamp: new Date().toISOString(),
};

export default function AICoach() {
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [streamError, setStreamError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const idCounter = useRef(0);

  const nextId = () => {
    idCounter.current += 1;
    return String(idCounter.current);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || loading) return;

    setInput("");
    setStreamError("");

    const userMsg: Message = {
      id: nextId(),
      role: "user",
      content,
      timestamp: new Date().toISOString(),
    };

    const assistantId = nextId();
    const assistantMsg: Message = {
      id: assistantId,
      role: "assistant",
      content: "",
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setLoading(true);

    const historyForApi = [...messages, userMsg].map((m) => ({
      role: m.role,
      content: m.content,
    }));

    try {
      await streamAICoach(
        historyForApi,
        (chunk) => {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId ? { ...m, content: m.content + chunk } : m
            )
          );
        },
        (errMsg) => {
          setStreamError(errMsg);
          setMessages((prev) => prev.filter((m) => m.id !== assistantId));
        }
      );
    } catch (err: unknown) {
      const msg =
        (err as Error)?.message ?? "AI coach is currently unavailable. Try again in a moment.";
      setStreamError(msg);
      setMessages((prev) => prev.filter((m) => m.id !== assistantId));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 rounded-xl bg-white border border-gray-100 shadow-sm overflow-hidden">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
          >
            <div
              className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                msg.role === "assistant" ? "bg-brand-100" : "bg-gray-100"
              }`}
            >
              {msg.role === "assistant" ? (
                <Bot className="h-4 w-4 text-brand-700" />
              ) : (
                <User className="h-4 w-4 text-gray-600" />
              )}
            </div>
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                msg.role === "assistant"
                  ? "bg-gray-50 text-gray-800 rounded-tl-sm"
                  : "bg-brand-600 text-white rounded-tr-sm"
              }`}
            >
              {msg.content}
              {msg.role === "assistant" && msg.content === "" && loading && (
                <span className="inline-flex gap-1 items-center">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="h-1.5 w-1.5 rounded-full bg-gray-400 animate-bounce"
                      style={{ animationDelay: `${i * 150}ms` }}
                    />
                  ))}
                </span>
              )}
            </div>
          </div>
        ))}

        {streamError && (
          <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            {streamError}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Suggested prompts */}
      <div className="px-6 py-2 flex gap-2 overflow-x-auto border-t border-gray-50">
        {SUGGESTED.map((s) => (
          <button
            key={s}
            onClick={() => handleSend(s)}
            disabled={loading}
            className="flex-shrink-0 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50 transition-colors"
          >
            {s}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex gap-3 items-end">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask about halal stocks, Zakat, retirement planning…"
            rows={1}
            disabled={loading}
            className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent disabled:bg-gray-50"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || loading}
            className="h-11 w-11 rounded-xl bg-brand-600 flex items-center justify-center hover:bg-brand-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex-shrink-0"
          >
            <Send className="h-4 w-4 text-white" />
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-2 text-center">
          Not financial advice. Consult a qualified advisor for major decisions.
        </p>
      </div>
    </div>
  );
}
