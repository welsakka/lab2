import BufferedArbitrageCalculator from "@/components/banking/BufferedArbitrageCalculator";

export default function BankingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Halal Credit Optimizer</h1>
        <p className="text-gray-500 mt-1">
          The Buffered Arbitrage Cycle — turn 0% APR windows into investment returns without
          ever paying interest. Permissible under mainstream Islamic finance opinion.
        </p>
      </div>

      {/* Explainer */}
      <div className="rounded-xl bg-blue-50 border border-blue-100 p-6">
        <h2 className="font-semibold text-blue-900 mb-2">How the Buffered Arbitrage Cycle works</h2>
        <ol className="space-y-2 text-sm text-blue-800 list-decimal list-inside">
          <li>Apply for a 0% APR credit card (15–18 month window)</li>
          <li>Route normal spending through the card — do not pay interest</li>
          <li>Keep the equivalent cash in a halal profit-sharing account (buffer)</li>
          <li>Invest remaining cash in halal equities for the duration</li>
          <li>Pay the full balance before the 0% window closes — from your buffer</li>
          <li>Repeat with a new card</li>
        </ol>
        <p className="mt-3 text-xs text-blue-600">
          No interest is ever paid. The permissibility hinges on full payoff before the
          promotional period ends — the AI agent alerts you 60 days out.
        </p>
      </div>

      <BufferedArbitrageCalculator />
    </div>
  );
}
