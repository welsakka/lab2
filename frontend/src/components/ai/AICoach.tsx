"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User } from "lucide-react";
import type { Message } from "@/types";

const SUGGESTED = [
  "Is AAPL halal to invest in?",
  "How much should I invest monthly to retire at 55?",
  "Explain the Buffered Arbitrage Cycle to me",
  "What's the nisab for Zakat this year?",
  "Are target-date funds halal?",
];

const MOCK_RESPONSES: Record<string, string> = {
  default: `Great question. As your AI financial coach with access to your portfolio and goals, here's a personalized answer:

Based on current AAOIFI screening data, I'd recommend reviewing the latest financials before investing. I'm analyzing your portfolio concentration and risk tolerance to give you the most relevant guidance.

For a deeper dive, ask me a specific question — like "how does this fit my retirement timeline?" or "what's the purification amount if I hold 100 shares?"`,
};

function getMockResponse(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("aapl") || lower.includes("apple")) {
    return `**Apple (AAPL) — Halal Status: Halal** ✅

Based on the latest AAOIFI screening (Q1 2026):
- Debt/Assets: 21.3% (threshold <33%) ✓
- Interest income ratio: 3.8% (threshold <33%) ✓
- Cash & securities ratio: 24.1% (threshold <33%) ✓
- Non-permissible income: 0% (threshold <5%) ✓

**Purification:** $0.08 per share (from minimal interest income)

Apple passes all four AAOIFI criteria. It's considered halal by most mainstream scholars. Given your current portfolio has no tech hardware exposure, AAPL could be a reasonable addition.

Want me to model how 50 shares of AAPL would affect your portfolio's compliance score and overall allocation?`;
  }
  if (lower.includes("retire") || lower.includes("55")) {
    return `Based on your profile (age 32, $85K saved, $2K/month contributions), here's your retirement outlook:

**To retire at 55 with $80K/year income:**
- Target portfolio: ~$2.0M (4% withdrawal rate)
- Current trajectory: ~$1.6M at 55 (7% assumed return)
- **Gap: ~$400K**

**To close the gap, choose one:**
1. Increase contributions by $600/month ($2,600 total)
2. Accept retiring at 57 instead
3. Reduce target income to $65K/year
4. Increase allocation to growth-oriented halal stocks

**Halal vehicle suggestion:** Maximize your Roth IRA ($7K/year), invest in HLAL ETF or build a self-directed halal stock portfolio.

Your Zakat at retirement would be ~$50K/year — factor this into your income planning.

Want me to run a Monte Carlo simulation on your specific scenario?`;
  }
  if (lower.includes("buffered") || lower.includes("arbitrage")) {
    return `**The Buffered Arbitrage Cycle — A Halal Credit Optimization Framework**

The key insight: if you never pay interest, a credit card is just a deferred payment tool — which is permissible.

**The cycle:**
1. Apply for a 0% APR card (15–18 month window)
2. Spend normally on the card — $3-4K/month is typical
3. Keep equivalent cash in a halal profit-sharing account (e.g., Amana Mutual, Saturna)
4. Invest the "freed up" capital in halal equities
5. Before the 0% window ends, pay off the full balance from your buffer
6. Immediately apply for a new 0% card and repeat

**Typical annual gain for $3K/month spend:**
- Investment returns: ~$1,050 (7% on $18K float, 13 months)
- Credit card rewards: ~$450 (1.5% cashback)
- **Total: ~$1,500/year**

Based on your credit score and spending patterns, I'd recommend starting with Chase Sapphire Preferred (15-month 0%) + Citi Double Cash (18-month 0%).

Shall I generate a full personalized strategy?`;
  }
  return MOCK_RESPONSES.default;
};

export default function AICoach() {
  const [messages, setMessages] = useState<Message[]>([
    {
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
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (text?: string) => {
    const content = text ?? input.trim();
    if (!content || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    await new Promise((r) => setTimeout(r, 800));

    const assistantMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: getMockResponse(content),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, assistantMsg]);
    setLoading(false);
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
            <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === "assistant" ? "bg-brand-100" : "bg-gray-100"}`}>
              {msg.role === "assistant"
                ? <Bot className="h-4 w-4 text-brand-700" />
                : <User className="h-4 w-4 text-gray-600" />}
            </div>
            <div
              className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                msg.role === "assistant"
                  ? "bg-gray-50 text-gray-800 rounded-tl-sm"
                  : "bg-brand-600 text-white rounded-tr-sm"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3">
            <div className="h-8 w-8 rounded-full bg-brand-100 flex items-center justify-center">
              <Bot className="h-4 w-4 text-brand-700" />
            </div>
            <div className="bg-gray-50 rounded-2xl rounded-tl-sm px-4 py-3">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="h-2 w-2 rounded-full bg-gray-400 animate-bounce"
                    style={{ animationDelay: `${i * 150}ms` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggested */}
      <div className="px-6 py-2 flex gap-2 overflow-x-auto border-t border-gray-50">
        {SUGGESTED.map((s) => (
          <button
            key={s}
            onClick={() => handleSend(s)}
            className="flex-shrink-0 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors"
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
            placeholder="Ask about halal stocks, Zakat, retirement planning..."
            rows={1}
            className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
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
