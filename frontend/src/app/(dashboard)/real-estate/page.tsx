import { Home, Building2, ExternalLink } from "lucide-react";

const mortgagePartners = [
  {
    name: "Guidance Residential",
    structure: "Declining Balance Musharaka",
    states: "Available in 22 states",
    url: "#",
  },
  {
    name: "Lariba",
    structure: "Ijara wa Iqtina",
    states: "Available in 35 states",
    url: "#",
  },
  {
    name: "University Islamic Financial",
    structure: "Musharaka Mutanaqisa",
    states: "Available in 10 states",
    url: "#",
  },
];

const halalREITs = [
  { ticker: "PLD", name: "Prologis", sector: "Industrial", status: "halal", yield: "2.4%" },
  { ticker: "AMT", name: "American Tower", sector: "Telecom Infrastructure", status: "borderline", yield: "2.9%" },
  { ticker: "DRE", name: "Duke Realty", sector: "Industrial", status: "halal", yield: "1.8%" },
];

export default function RealEstatePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Real Estate & Alternatives</h1>
        <p className="text-gray-500 mt-1">
          Halal mortgage finder, REIT screening, gold tracking, and sukuk education.
        </p>
      </div>

      {/* Tabs placeholder */}
      <div className="flex gap-2 border-b border-gray-200">
        {["Halal Mortgages", "REIT Screener", "Gold & Sukuk", "Rent vs Buy"].map((tab, i) => (
          <button
            key={tab}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
              i === 0
                ? "border-brand-500 text-brand-700"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Mortgage partners */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Home className="h-5 w-5 text-brand-600" />
          Halal Mortgage Partners
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mortgagePartners.map((p) => (
            <div key={p.name} className="rounded-xl bg-white border border-gray-100 p-5 shadow-sm">
              <h3 className="font-semibold text-gray-900">{p.name}</h3>
              <p className="text-sm text-brand-600 font-medium mt-1">{p.structure}</p>
              <p className="text-sm text-gray-500 mt-1">{p.states}</p>
              <a
                href={p.url}
                className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-brand-600 hover:underline"
              >
                Learn more <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* REIT screener */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Building2 className="h-5 w-5 text-brand-600" />
          REIT Compliance Screener
        </h2>
        <div className="rounded-xl bg-white border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ticker</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sector</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Yield</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {halalREITs.map((r) => (
                <tr key={r.ticker} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-semibold text-gray-900">{r.ticker}</td>
                  <td className="px-6 py-4 text-gray-700">{r.name}</td>
                  <td className="px-6 py-4 text-gray-500 text-sm">{r.sector}</td>
                  <td className="px-6 py-4 text-gray-700">{r.yield}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                        r.status === "halal"
                          ? "bg-green-100 text-green-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {r.status === "halal" ? "Halal" : "Borderline"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
