"use client";

import { useState } from "react";
import { Search, AlertCircle, CheckCircle, AlertTriangle, XCircle, HelpCircle } from "lucide-react";
import { cn, halalStatusColors, halalStatusLabel, formatPercent } from "@/lib/utils";
import type { HalalStatus, StockScreenResult } from "@/types";

const AAOIFI_THRESHOLDS = {
  debtToAssets: 33,
  interestIncomeRatio: 33,
  cashAndSecuritiesRatio: 33,
  nonPermissibleIncomeRatio: 5,
};

const mockResults: Record<string, StockScreenResult> = {
  MSFT: {
    ticker: "MSFT",
    name: "Microsoft Corporation",
    sector: "Technology",
    status: "halal",
    ratios: { debtToAssets: 18.2, interestIncomeRatio: 2.1, cashAndSecuritiesRatio: 21.4, nonPermissibleIncomeRatio: 0 },
    purificationAmount: 0.12,
    lastChecked: "2026-05-01",
    notes: "Passes all AAOIFI screening criteria. Low debt, minimal interest income.",
  },
  META: {
    ticker: "META",
    name: "Meta Platforms",
    sector: "Communication Services",
    status: "monitor",
    ratios: { debtToAssets: 14.1, interestIncomeRatio: 31.2, cashAndSecuritiesRatio: 28.9, nonPermissibleIncomeRatio: 0 },
    purificationAmount: 0.68,
    lastChecked: "2026-05-01",
    notes: "Interest income ratio approaching 33% threshold. Monitor Q2 filings.",
  },
  AMZN: {
    ticker: "AMZN",
    name: "Amazon.com",
    sector: "Consumer Discretionary",
    status: "halal",
    ratios: { debtToAssets: 27.4, interestIncomeRatio: 4.8, cashAndSecuritiesRatio: 18.2, nonPermissibleIncomeRatio: 0 },
    purificationAmount: 0.24,
    lastChecked: "2026-05-01",
    notes: "Passes screening. Higher debt ratio but well within threshold.",
  },
};

const statusIcon: Record<HalalStatus, React.ElementType> = {
  halal: CheckCircle,
  borderline: AlertTriangle,
  monitor: AlertCircle,
  "not-halal": XCircle,
  unknown: HelpCircle,
};

export default function StockScreener() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<StockScreenResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleScreen = async () => {
    const ticker = query.trim().toUpperCase();
    if (!ticker) return;
    setLoading(true);
    setError("");
    setResult(null);

    await new Promise((r) => setTimeout(r, 600));

    const found = mockResults[ticker];
    if (found) {
      setResult(found);
    } else {
      setError(`No data found for "${ticker}". Try MSFT, META, or AMZN.`);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="flex gap-3">
        <div className="flex-1 flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm focus-within:ring-2 focus-within:ring-brand-500 focus-within:border-transparent">
          <Search className="h-5 w-5 text-gray-400 flex-shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleScreen()}
            placeholder="Enter a ticker (e.g. MSFT, GOOGL, AAPL)"
            className="flex-1 text-sm text-gray-900 placeholder-gray-400 outline-none bg-transparent"
          />
        </div>
        <button
          onClick={handleScreen}
          disabled={loading || !query.trim()}
          className="rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Checking..." : "Screen"}
        </button>
      </div>

      {/* AAOIFI criteria reminder */}
      <div className="rounded-lg bg-gray-50 border border-gray-100 px-4 py-3 text-xs text-gray-500 flex flex-wrap gap-x-6 gap-y-1">
        <span>AAOIFI Thresholds:</span>
        <span>Debt / Total Assets &lt; 33%</span>
        <span>Interest Income / Revenue &lt; 33%</span>
        <span>Cash & Securities / Assets &lt; 33%</span>
        <span>Non-Permissible Income &lt; 5%</span>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl bg-red-50 border border-red-100 p-4 text-sm text-red-700">{error}</div>
      )}

      {/* Result */}
      {result && (
        <div className="rounded-xl bg-white border border-gray-100 shadow-sm overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-gray-900">{result.ticker}</span>
                  <span className="text-gray-500">·</span>
                  <span className="text-gray-600">{result.name}</span>
                </div>
                <div className="text-sm text-gray-400 mt-1">{result.sector} · Last updated {result.lastChecked}</div>
              </div>
              <div className={cn("flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold", halalStatusColors(result.status).bg, halalStatusColors(result.status).text)}>
                {(() => {
                  const Icon = statusIcon[result.status];
                  return <Icon className="h-4 w-4" />;
                })()}
                {halalStatusLabel(result.status)}
              </div>
            </div>
          </div>

          {/* Ratios */}
          <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Debt / Assets", value: result.ratios.debtToAssets, threshold: AAOIFI_THRESHOLDS.debtToAssets },
              { label: "Interest Income", value: result.ratios.interestIncomeRatio, threshold: AAOIFI_THRESHOLDS.interestIncomeRatio },
              { label: "Cash & Securities", value: result.ratios.cashAndSecuritiesRatio, threshold: AAOIFI_THRESHOLDS.cashAndSecuritiesRatio },
              { label: "Non-Permissible Income", value: result.ratios.nonPermissibleIncomeRatio, threshold: AAOIFI_THRESHOLDS.nonPermissibleIncomeRatio },
            ].map((ratio) => {
              const passing = ratio.value < ratio.threshold;
              const pct = Math.min((ratio.value / ratio.threshold) * 100, 100);
              return (
                <div key={ratio.label} className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">{ratio.label}</span>
                    <span className={`font-semibold ${passing ? "text-green-600" : "text-red-600"}`}>
                      {formatPercent(ratio.value)}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${passing ? "bg-green-500" : "bg-red-500"}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-400">Threshold: {formatPercent(ratio.threshold)}</div>
                </div>
              );
            })}
          </div>

          {/* Notes + purification */}
          <div className="px-6 pb-6 flex flex-col md:flex-row gap-4">
            <div className="flex-1 rounded-lg bg-gray-50 p-4">
              <p className="text-xs font-medium text-gray-500 mb-1">Analyst note</p>
              <p className="text-sm text-gray-700">{result.notes}</p>
            </div>
            {result.purificationAmount !== null && (
              <div className="rounded-lg bg-amber-50 border border-amber-100 p-4 min-w-[160px]">
                <p className="text-xs font-medium text-amber-700 mb-1">Purification</p>
                <p className="text-2xl font-bold text-amber-800">${result.purificationAmount}</p>
                <p className="text-xs text-amber-600">per share owned</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
