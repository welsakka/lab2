"use client";

import Link from "next/link";
import { Search, TrendingUp, AlertCircle, RefreshCw, PieChart } from "lucide-react";
import useSWR from "swr";
import { getPortfolio } from "@/lib/api";
import { cn, halalStatusColors, halalStatusLabel } from "@/lib/utils";
import type { HalalStatus } from "@/types";
import PlaidLinkButton from "@/components/investments/PlaidLinkButton";

interface Holding {
  id: string;
  ticker: string;
  shares: number;
  avg_cost: number | null;
  status: HalalStatus;
  purification_per_share: number;
}

const MOCK_HOLDINGS = [
  { id: "m1", ticker: "MSFT", shares: 20, avg_cost: 380, status: "halal" as HalalStatus, purification_per_share: 0.12 },
  { id: "m2", ticker: "GOOGL", shares: 15, avg_cost: 160, status: "halal" as HalalStatus, purification_per_share: 0.08 },
  { id: "m3", ticker: "NVDA", shares: 10, avg_cost: 750, status: "borderline" as HalalStatus, purification_per_share: 0.45 },
];

export default function InvestmentsPage() {
  const { data: holdings, mutate, isLoading } = useSWR<Holding[]>(
    "portfolio",
    getPortfolio,
    { fallbackData: [] }
  );

  const displayHoldings = holdings && holdings.length > 0 ? holdings : MOCK_HOLDINGS;
  const isMock = !holdings || holdings.length === 0;

  const totalValue = displayHoldings.reduce(
    (s, h) => s + h.shares * (h.avg_cost ?? 0),
    0
  );

  const halalPct =
    displayHoldings.length > 0
      ? Math.round(
          (displayHoldings.filter((h) => h.status === "halal").length /
            displayHoldings.length) *
            100
        )
      : 0;

  const purificationTotal = displayHoldings.reduce(
    (s, h) => s + h.shares * h.purification_per_share,
    0
  );

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Investment Hub</h1>
          <p className="text-gray-500 mt-1">
            Portfolio tracking, halal screening, and compliance monitoring
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <PlaidLinkButton onSuccess={() => mutate()} />
          <Link
            href="/investments/screening"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <Search className="h-4 w-4" />
            Screen a stock
          </Link>
        </div>
      </div>

      {isMock && !isLoading && (
        <div className="rounded-lg bg-blue-50 border border-blue-100 px-4 py-3 text-sm text-blue-700">
          Connect a brokerage account to see your real holdings. Showing sample data below.
        </div>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl bg-white border border-gray-100 p-5 shadow-sm">
          <p className="text-sm text-gray-500">Total Cost Basis</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            ${totalValue.toLocaleString("en-US", { maximumFractionDigits: 0 })}
          </p>
          <p className="text-xs text-green-600 font-medium mt-1 flex items-center gap-1">
            <TrendingUp className="h-3 w-3" /> {displayHoldings.length} positions
          </p>
        </div>
        <div className="rounded-xl bg-white border border-gray-100 p-5 shadow-sm">
          <p className="text-sm text-gray-500">Halal Compliance</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{halalPct}%</p>
          <p className="text-xs text-amber-600 font-medium mt-1 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {displayHoldings.filter((h) => h.status !== "halal").length} to review
          </p>
        </div>
        <div className="rounded-xl bg-white border border-gray-100 p-5 shadow-sm">
          <p className="text-sm text-gray-500">Purification Owed</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            ${purificationTotal.toFixed(2)}
          </p>
          <p className="text-xs text-gray-400 font-medium mt-1 flex items-center gap-1">
            <RefreshCw className="h-3 w-3" /> Based on current holdings
          </p>
        </div>
      </div>

      {/* Holdings table */}
      <div className="rounded-xl bg-white border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Holdings</h2>
          <Link href="/investments/screening" className="text-sm text-brand-600 hover:underline">
            Screen a stock →
          </Link>
        </div>

        {isLoading ? (
          <div className="p-10 text-center text-sm text-gray-400">Loading holdings…</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shares</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Cost</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purification/share</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {displayHoldings.map((h) => {
                const colors = halalStatusColors(h.status);
                return (
                  <tr key={h.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-gray-900">{h.ticker}</td>
                    <td className="px-6 py-4 text-gray-700">{h.shares}</td>
                    <td className="px-6 py-4 text-gray-500">
                      {h.avg_cost != null ? `$${h.avg_cost.toFixed(2)}` : "—"}
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn("inline-flex rounded-full px-2 py-0.5 text-xs font-medium", colors.bg, colors.text)}>
                        {halalStatusLabel(h.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {h.purification_per_share > 0
                        ? `$${h.purification_per_share.toFixed(4)}`
                        : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
