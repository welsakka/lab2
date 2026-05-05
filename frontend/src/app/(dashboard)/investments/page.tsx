import Link from "next/link";
import { Search, TrendingUp, AlertCircle, RefreshCw, PieChart } from "lucide-react";

const portfolioHoldings = [
  { ticker: "MSFT", name: "Microsoft", value: "$18,420", weight: "21.8%", status: "halal", change: "+1.2%" },
  { ticker: "GOOGL", name: "Alphabet", value: "$14,200", weight: "16.8%", status: "halal", change: "+0.8%" },
  { ticker: "AMZN", name: "Amazon", value: "$11,050", weight: "13.1%", status: "halal", change: "-0.4%" },
  { ticker: "NVDA", name: "NVIDIA", value: "$9,800", weight: "11.6%", status: "borderline", change: "+2.1%" },
  { ticker: "META", name: "Meta", value: "$8,600", weight: "10.2%", status: "monitor", change: "+0.3%" },
  { ticker: "AAPL", name: "Apple", value: "$7,900", weight: "9.4%", status: "halal", change: "-0.2%" },
];

const statusConfig = {
  halal: { label: "Halal", bg: "bg-green-100", text: "text-green-700" },
  borderline: { label: "Borderline", bg: "bg-amber-100", text: "text-amber-700" },
  monitor: { label: "Monitor", bg: "bg-orange-100", text: "text-orange-700" },
  "not-halal": { label: "Not Halal", bg: "bg-red-100", text: "text-red-700" },
};

export default function InvestmentsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Investment Hub</h1>
          <p className="text-gray-500 mt-1">Portfolio tracking, halal screening, and compliance monitoring</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/investments/screening"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <Search className="h-4 w-4" />
            Screen a stock
          </Link>
          <Link
            href="/investments/portfolio"
            className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
          >
            <PieChart className="h-4 w-4" />
            Portfolio
          </Link>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl bg-white border border-gray-100 p-5 shadow-sm">
          <p className="text-sm text-gray-500">Total Value</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">$84,320</p>
          <p className="text-xs text-green-600 font-medium mt-1 flex items-center gap-1">
            <TrendingUp className="h-3 w-3" /> +3.2% this month
          </p>
        </div>
        <div className="rounded-xl bg-white border border-gray-100 p-5 shadow-sm">
          <p className="text-sm text-gray-500">Halal Compliance</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">94%</p>
          <p className="text-xs text-amber-600 font-medium mt-1 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" /> 2 holdings to review
          </p>
        </div>
        <div className="rounded-xl bg-white border border-gray-100 p-5 shadow-sm">
          <p className="text-sm text-gray-500">Purification Owed</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">$48.30</p>
          <p className="text-xs text-gray-400 font-medium mt-1 flex items-center gap-1">
            <RefreshCw className="h-3 w-3" /> Last updated today
          </p>
        </div>
      </div>

      {/* Holdings table */}
      <div className="rounded-xl bg-white border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">Holdings</h2>
          <Link href="/investments/portfolio" className="text-sm text-brand-600 hover:underline">
            View full portfolio
          </Link>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Weight</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Today</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {portfolioHoldings.map((h) => {
              const s = statusConfig[h.status as keyof typeof statusConfig];
              return (
                <tr key={h.ticker} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <span className="font-semibold text-gray-900">{h.ticker}</span>
                      <span className="ml-2 text-sm text-gray-500">{h.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">{h.value}</td>
                  <td className="px-6 py-4 text-gray-500">{h.weight}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${s.bg} ${s.text}`}>
                      {s.label}
                    </span>
                  </td>
                  <td className={`px-6 py-4 font-medium text-sm ${h.change.startsWith("+") ? "text-green-600" : "text-red-500"}`}>
                    {h.change}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
