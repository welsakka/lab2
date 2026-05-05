import StockScreener from "@/components/investments/StockScreener";

export default function ScreeningPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Stock Screener</h1>
        <p className="text-gray-500 mt-1">
          Screen any stock against AAOIFI Sharia standards. Get instant compliance results
          with detailed financial ratios.
        </p>
      </div>
      <StockScreener />
    </div>
  );
}
