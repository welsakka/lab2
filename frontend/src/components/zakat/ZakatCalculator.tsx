"use client";

import { useState } from "react";
import { formatCurrency } from "@/lib/utils";

const NISAB_GOLD_OZ = 3.0;
const GOLD_PRICE_PER_OZ = 2340;
const NISAB_THRESHOLD = NISAB_GOLD_OZ * GOLD_PRICE_PER_OZ;
const ZAKAT_RATE = 0.025;

interface Assets {
  cash: string;
  stocks: string;
  gold: string;
  silver: string;
  businessEquity: string;
  receivables: string;
}

export default function ZakatCalculator() {
  const [assets, setAssets] = useState<Assets>({
    cash: "",
    stocks: "",
    gold: "",
    silver: "",
    businessEquity: "",
    receivables: "",
  });
  const [calculated, setCalculated] = useState(false);

  const total = Object.values(assets).reduce((sum, v) => sum + (parseFloat(v) || 0), 0);
  const aboveNisab = total >= NISAB_THRESHOLD;
  const zakatDue = aboveNisab ? total * ZAKAT_RATE : 0;

  const handleChange = (key: keyof Assets) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setAssets((prev) => ({ ...prev, [key]: e.target.value }));
    setCalculated(false);
  };

  const fields: { key: keyof Assets; label: string; placeholder: string }[] = [
    { key: "cash", label: "Cash & Bank Accounts", placeholder: "10,000" },
    { key: "stocks", label: "Halal Stocks & Investments", placeholder: "50,000" },
    { key: "gold", label: "Gold (market value)", placeholder: "5,000" },
    { key: "silver", label: "Silver (market value)", placeholder: "0" },
    { key: "businessEquity", label: "Business Equity", placeholder: "0" },
    { key: "receivables", label: "Money Owed to You", placeholder: "0" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Input form */}
      <div className="rounded-xl bg-white border border-gray-100 shadow-sm p-6 space-y-4">
        <h2 className="font-semibold text-gray-900">Enter your Zakatable assets</h2>
        <p className="text-xs text-gray-500">
          Include assets held for a full lunar year (hawl) above the nisab threshold.
          Nisab = 3 troy oz gold ≈ {formatCurrency(NISAB_THRESHOLD)}.
        </p>

        {fields.map((field) => (
          <div key={field.key}>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{field.label}</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
              <input
                type="number"
                value={assets[field.key]}
                onChange={handleChange(field.key)}
                placeholder={field.placeholder}
                className="w-full rounded-lg border border-gray-200 pl-7 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>
        ))}

        <button
          onClick={() => setCalculated(true)}
          className="w-full rounded-lg bg-brand-600 py-3 text-sm font-semibold text-white hover:bg-brand-700 transition-colors"
        >
          Calculate Zakat
        </button>
      </div>

      {/* Results */}
      <div className="space-y-4">
        {!calculated ? (
          <div className="rounded-xl bg-gray-50 border border-dashed border-gray-200 p-10 text-center text-sm text-gray-400">
            Enter your assets and click Calculate to see your Zakat.
          </div>
        ) : (
          <>
            {/* Nisab check */}
            <div className={`rounded-xl border p-5 ${aboveNisab ? "bg-amber-50 border-amber-100" : "bg-green-50 border-green-100"}`}>
              <p className={`text-sm font-medium ${aboveNisab ? "text-amber-700" : "text-green-700"}`}>
                {aboveNisab ? "Above nisab — Zakat is obligatory" : "Below nisab — Zakat not required this year"}
              </p>
              <p className="text-xs mt-1 text-gray-500">
                Nisab threshold: {formatCurrency(NISAB_THRESHOLD)} (3 oz gold @ {formatCurrency(GOLD_PRICE_PER_OZ)}/oz)
              </p>
            </div>

            {/* Total + Zakat */}
            <div className="rounded-xl bg-white border border-gray-100 shadow-sm p-5 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Total Zakatable Wealth</span>
                <span className="font-semibold text-gray-900">{formatCurrency(total)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Zakat Rate</span>
                <span className="font-semibold text-gray-900">2.5%</span>
              </div>
              <div className="border-t border-gray-100 pt-4 flex justify-between">
                <span className="font-semibold text-gray-900">Zakat Due</span>
                <span className="text-2xl font-bold text-amber-700">{formatCurrency(zakatDue)}</span>
              </div>
            </div>

            {/* Breakdown */}
            <div className="rounded-xl bg-white border border-gray-100 shadow-sm p-5">
              <h3 className="font-semibold text-gray-900 mb-3">Breakdown</h3>
              <div className="space-y-2">
                {fields.map((field) => {
                  const val = parseFloat(assets[field.key]) || 0;
                  if (!val) return null;
                  return (
                    <div key={field.key} className="flex justify-between text-sm">
                      <span className="text-gray-500">{field.label}</span>
                      <span className="text-gray-900">{formatCurrency(val)}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <button className="w-full rounded-xl border border-brand-200 bg-brand-50 py-3 text-sm font-semibold text-brand-700 hover:bg-brand-100 transition-colors">
              Download Zakat Report (PDF)
            </button>
          </>
        )}
      </div>
    </div>
  );
}
