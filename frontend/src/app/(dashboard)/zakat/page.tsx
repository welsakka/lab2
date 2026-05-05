import ZakatCalculator from "@/components/zakat/ZakatCalculator";

export default function ZakatPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Zakat Calculator</h1>
        <p className="text-gray-500 mt-1">
          Calculate your annual Zakat across all asset classes — stocks, cash, gold, business
          equity. Tracks nisab against live gold prices.
        </p>
      </div>
      <ZakatCalculator />
    </div>
  );
}
