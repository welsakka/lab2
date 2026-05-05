"use client";

import { useState } from "react";
import { formatCurrency } from "@/lib/utils";

interface Strategy {
  floatAmount: number;
  bufferNeeded: number;
  investableCash: number;
  investmentReturn: number;
  rewards: number;
  totalGain: number;
  cards: { name: string; limit: number; aprMonths: number; annualFee: number }[];
}

function buildStrategy(monthlySpend: number, creditScore: string): Strategy {
  const avgFloat = monthlySpend * 14;
  const buffer = avgFloat;
  const investable = monthlySpend * 6;
  const investReturn = investable * 0.07 * (14 / 12);
  const rewards = avgFloat * 0.015;
  const totalGain = investReturn + rewards;

  const cards =
    creditScore === "excellent"
      ? [
          { name: "Chase Sapphire Preferred", limit: Math.round(monthlySpend * 6), aprMonths: 15, annualFee: 95 },
          { name: "Citi Double Cash", limit: Math.round(monthlySpend * 4), aprMonths: 18, annualFee: 0 },
        ]
      : [{ name: "Discover it Cash Back", limit: Math.round(monthlySpend * 4), aprMonths: 15, annualFee: 0 }];

  return { floatAmount: avgFloat, bufferNeeded: buffer, investableCash: investable, investmentReturn: investReturn, rewards, totalGain, cards };
}

export default function BufferedArbitrageCalculator() {
  const [monthlySpend, setMonthlySpend] = useState(3000);
  const [creditScore, setCreditScore] = useState("excellent");
  const [riskTolerance, setRiskTolerance] = useState("moderate");
  const [strategy, setStrategy] = useState<Strategy | null>(null);

  const handleGenerate = () => {
    setStrategy(buildStrategy(monthlySpend, creditScore));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Inputs */}
      <div className="rounded-xl bg-white border border-gray-100 shadow-sm p-6 space-y-5">
        <h2 className="font-semibold text-gray-900">Your Situation</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Monthly Spend: {formatCurrency(monthlySpend)}
          </label>
          <input
            type="range"
            min={500}
            max={10000}
            step={250}
            value={monthlySpend}
            onChange={(e) => setMonthlySpend(Number(e.target.value))}
            className="w-full accent-brand-600"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>$500</span><span>$10,000</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Credit Score</label>
          <select
            value={creditScore}
            onChange={(e) => setCreditScore(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="excellent">Excellent (750+)</option>
            <option value="good">Good (700–749)</option>
            <option value="fair">Fair (650–699)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Risk Tolerance</label>
          <div className="grid grid-cols-3 gap-2">
            {["conservative", "moderate", "aggressive"].map((r) => (
              <button
                key={r}
                onClick={() => setRiskTolerance(r)}
                className={`rounded-lg border py-2 text-sm font-medium capitalize transition-colors ${
                  riskTolerance === r
                    ? "border-brand-500 bg-brand-50 text-brand-700"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleGenerate}
          className="w-full rounded-lg bg-brand-600 py-3 text-sm font-semibold text-white hover:bg-brand-700 transition-colors"
        >
          Generate my halal strategy
        </button>
      </div>

      {/* Strategy output */}
      <div className="space-y-4">
        {!strategy ? (
          <div className="rounded-xl bg-gray-50 border border-dashed border-gray-200 p-10 text-center text-sm text-gray-400">
            Fill in your details and click Generate to see your personalized strategy.
          </div>
        ) : (
          <>
            {/* Headline number */}
            <div className="rounded-xl bg-brand-600 text-white p-6">
              <p className="text-brand-100 text-sm mb-1">Projected annual gain</p>
              <p className="text-4xl font-bold">{formatCurrency(strategy.totalGain)}</p>
              <p className="text-brand-200 text-sm mt-2">
                {formatCurrency(strategy.investmentReturn)} investment returns + {formatCurrency(strategy.rewards)} rewards
              </p>
            </div>

            {/* Mechanics */}
            <div className="rounded-xl bg-white border border-gray-100 shadow-sm p-5 space-y-3">
              <h3 className="font-semibold text-gray-900">Strategy mechanics</h3>
              {[
                { label: "Float on cards (avg)", value: formatCurrency(strategy.floatAmount) },
                { label: "Buffer in profit-sharing account", value: formatCurrency(strategy.bufferNeeded) },
                { label: "Investable in halal equities", value: formatCurrency(strategy.investableCash) },
              ].map((item) => (
                <div key={item.label} className="flex justify-between text-sm">
                  <span className="text-gray-500">{item.label}</span>
                  <span className="font-semibold text-gray-900">{item.value}</span>
                </div>
              ))}
            </div>

            {/* Recommended cards */}
            <div className="rounded-xl bg-white border border-gray-100 shadow-sm p-5">
              <h3 className="font-semibold text-gray-900 mb-3">Recommended cards</h3>
              <div className="space-y-3">
                {strategy.cards.map((card) => (
                  <div key={card.name} className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{card.name}</p>
                      <p className="text-xs text-gray-500">{card.aprMonths}-month 0% APR · {card.annualFee === 0 ? "No annual fee" : `$${card.annualFee}/year`}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">{formatCurrency(card.limit)}</p>
                      <p className="text-xs text-gray-400">credit limit</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs text-gray-400">
                Always pay the full balance before the 0% APR period ends. The AI agent will alert you 60 days out.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
