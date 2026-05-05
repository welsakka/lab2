"use client";

import { useState } from "react";
import { formatCurrency } from "@/lib/utils";
import { CheckCircle, XCircle } from "lucide-react";

interface Plan {
  projectedValue: number;
  monthlyIncome: number;
  yearsToRetirement: number;
  zakatAtRetirement: number;
  onTrack: boolean;
  gapAmount: number;
}

function computePlan(
  currentAge: number,
  targetAge: number,
  currentSavings: number,
  monthlyContribution: number,
  annualReturn: number
): Plan {
  const years = targetAge - currentAge;
  const monthlyRate = annualReturn / 12 / 100;
  const months = years * 12;

  const fvCurrent = currentSavings * Math.pow(1 + monthlyRate, months);
  const fvContributions = monthlyContribution * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
  const projected = fvCurrent + fvContributions;

  const targetPortfolio = 1_500_000;
  const monthlyIncome = projected * 0.04 / 12;
  const zakatAtRetirement = projected * 0.025;
  const onTrack = projected >= targetPortfolio;
  const gapAmount = Math.max(0, targetPortfolio - projected);

  return { projectedValue: projected, monthlyIncome, yearsToRetirement: years, zakatAtRetirement, onTrack, gapAmount };
}

export default function RetirementPlanner() {
  const [currentAge, setCurrentAge] = useState(32);
  const [targetAge, setTargetAge] = useState(55);
  const [currentSavings, setCurrentSavings] = useState(85000);
  const [monthlyContribution, setMonthlyContribution] = useState(2000);
  const [annualReturn, setAnnualReturn] = useState(7);
  const [plan, setPlan] = useState<Plan | null>(null);

  const handleCompute = () => {
    setPlan(computePlan(currentAge, targetAge, currentSavings, monthlyContribution, annualReturn));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Inputs */}
      <div className="rounded-xl bg-white border border-gray-100 shadow-sm p-6 space-y-5">
        <h2 className="font-semibold text-gray-900">Your retirement inputs</h2>

        {[
          { label: `Current age: ${currentAge}`, min: 18, max: 70, value: currentAge, setter: setCurrentAge },
          { label: `Target retirement age: ${targetAge}`, min: 40, max: 80, value: targetAge, setter: setTargetAge },
          { label: `Annual return assumption: ${annualReturn}%`, min: 3, max: 12, value: annualReturn, setter: setAnnualReturn, step: 0.5 },
        ].map((slider) => (
          <div key={slider.label}>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{slider.label}</label>
            <input
              type="range"
              min={slider.min}
              max={slider.max}
              step={slider.step ?? 1}
              value={slider.value}
              onChange={(e) => slider.setter(Number(e.target.value))}
              className="w-full accent-brand-600"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>{slider.min}</span><span>{slider.max}</span>
            </div>
          </div>
        ))}

        {[
          { label: "Current savings / invested assets", value: currentSavings, setter: setCurrentSavings },
          { label: "Monthly contribution", value: monthlyContribution, setter: setMonthlyContribution },
        ].map((input) => (
          <div key={input.label}>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{input.label}</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
              <input
                type="number"
                value={input.value}
                onChange={(e) => input.setter(Number(e.target.value))}
                className="w-full rounded-lg border border-gray-200 pl-7 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>
        ))}

        <button
          onClick={handleCompute}
          className="w-full rounded-lg bg-brand-600 py-3 text-sm font-semibold text-white hover:bg-brand-700 transition-colors"
        >
          Build my retirement roadmap
        </button>
      </div>

      {/* Results */}
      <div className="space-y-4">
        {!plan ? (
          <div className="rounded-xl bg-gray-50 border border-dashed border-gray-200 p-10 text-center text-sm text-gray-400">
            Fill in your details and click Build to see your personalized roadmap.
          </div>
        ) : (
          <>
            <div className={`rounded-xl border p-5 ${plan.onTrack ? "bg-green-50 border-green-100" : "bg-red-50 border-red-100"}`}>
              <div className="flex items-center gap-2">
                {plan.onTrack
                  ? <CheckCircle className="h-5 w-5 text-green-600" />
                  : <XCircle className="h-5 w-5 text-red-500" />}
                <span className={`font-semibold ${plan.onTrack ? "text-green-800" : "text-red-700"}`}>
                  {plan.onTrack ? "You're on track to retire at " + targetAge : "Gap detected — adjust contributions"}
                </span>
              </div>
              {!plan.onTrack && (
                <p className="text-sm mt-1 text-red-600">
                  Projected shortfall: {formatCurrency(plan.gapAmount)}
                </p>
              )}
            </div>

            <div className="rounded-xl bg-white border border-gray-100 shadow-sm p-5 space-y-4">
              <h3 className="font-semibold text-gray-900">Retirement snapshot</h3>
              {[
                { label: "Projected portfolio value", value: formatCurrency(plan.projectedValue) },
                { label: "Monthly income (4% rule)", value: formatCurrency(plan.monthlyIncome) },
                { label: "Years to retirement", value: `${plan.yearsToRetirement} years` },
                { label: "Estimated annual Zakat at retirement", value: formatCurrency(plan.zakatAtRetirement), note: "Plan for this in advance" },
              ].map((row) => (
                <div key={row.label} className="flex justify-between items-start text-sm">
                  <div>
                    <span className="text-gray-500">{row.label}</span>
                    {row.note && <p className="text-xs text-amber-600">{row.note}</p>}
                  </div>
                  <span className="font-semibold text-gray-900">{row.value}</span>
                </div>
              ))}
            </div>

            <div className="rounded-xl bg-blue-50 border border-blue-100 p-4 text-sm text-blue-800">
              <p className="font-medium mb-1">Halal investment vehicles</p>
              <ul className="space-y-1 text-blue-700 list-disc list-inside text-xs">
                <li>AMANX / HLAL ETF in your brokerage IRA</li>
                <li>Self-directed 401(k) with halal fund selection</li>
                <li>UTMA account with screened individual stocks</li>
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
