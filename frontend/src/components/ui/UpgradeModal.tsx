"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { X, Zap } from "lucide-react";
import { useUpgradeStore } from "@/lib/upgrade-store";
import { createCheckout } from "@/lib/api";

const PLAN_INFO: Record<string, { label: string; price: string; priceId: string; features: string[] }> = {
  essential: {
    label: "Essential",
    price: "$20/month",
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ESSENTIAL ?? "",
    features: [
      "Unlimited stock screening",
      "Portfolio tracking",
      "Credit card optimizer",
      "Compliance alerts",
    ],
  },
  premium: {
    label: "Premium",
    price: "$35/month",
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PREMIUM ?? "",
    features: [
      "Everything in Essential",
      "AI financial planning",
      "AI compliance monitoring",
      "Live scholar webinars",
      "Real estate tools",
    ],
  },
  family: {
    label: "Family",
    price: "$50/month",
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_FAMILY ?? "",
    features: [
      "Everything in Premium",
      "Up to 5 accounts",
      "Islamic estate planning",
      "Family Zakat tracking",
    ],
  },
};

export default function UpgradeModal() {
  const { requiredPlans, clear } = useUpgradeStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  if (!requiredPlans || requiredPlans.length === 0) return null;

  // Show the cheapest required plan
  const planKey = requiredPlans[0];
  const plan = PLAN_INFO[planKey];

  if (!plan) return null;

  const handleUpgrade = async () => {
    if (!plan.priceId) {
      router.push("/settings");
      clear();
      return;
    }
    setLoading(true);
    setError("");
    try {
      const { checkout_url } = await createCheckout(plan.priceId);
      window.location.href = checkout_url;
    } catch {
      setError("Could not start checkout. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={clear} />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-sm mx-4 rounded-2xl bg-white shadow-xl p-6">
        <button
          onClick={clear}
          className="absolute top-4 right-4 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <div className="rounded-lg bg-brand-100 p-1.5">
            <Zap className="h-4 w-4 text-brand-700" />
          </div>
          <span className="text-xs font-semibold text-brand-700 uppercase tracking-wide">
            Upgrade required
          </span>
        </div>

        <h2 className="text-xl font-bold text-gray-900 mt-3 mb-1">
          {plan.label} — {plan.price}
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          This feature requires the {plan.label} plan. Upgrade to unlock:
        </p>

        <ul className="space-y-1.5 mb-6">
          {plan.features.map((f) => (
            <li key={f} className="flex items-center gap-2 text-sm text-gray-700">
              <span className="text-brand-500 font-bold">✓</span> {f}
            </li>
          ))}
        </ul>

        {error && (
          <p className="text-xs text-red-600 mb-3">{error}</p>
        )}

        <button
          onClick={handleUpgrade}
          disabled={loading}
          className="w-full rounded-xl bg-brand-600 py-3 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Redirecting to checkout…" : `Upgrade to ${plan.label}`}
        </button>

        <button
          onClick={clear}
          className="w-full mt-2 py-2 text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
          Maybe later
        </button>
      </div>
    </div>
  );
}
