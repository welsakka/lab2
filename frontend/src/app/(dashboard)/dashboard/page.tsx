import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Shield,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";

const stats = [
  { label: "Portfolio Value", value: "$84,320", change: "+3.2%", up: true, icon: DollarSign },
  { label: "Halal Compliance", value: "94%", change: "+1% this month", up: true, icon: Shield },
  { label: "Zakat Due", value: "$2,108", change: "Due in 45 days", up: false, icon: AlertTriangle },
  { label: "Arbitrage Gains YTD", value: "$1,047", change: "+$180 this month", up: true, icon: TrendingUp },
];

const alerts = [
  {
    type: "warning",
    title: "META compliance update",
    body: "Interest income ratio increased to 31% (threshold: 33%). Monitor for Q2 filing.",
    time: "2 hours ago",
  },
  {
    type: "success",
    title: "0% APR period expiring",
    body: "Chase Sapphire 0% ends in 62 days. Your buffer account holds $6,200 — ready to pay off.",
    time: "1 day ago",
  },
  {
    type: "info",
    title: "Rebalancing suggestion",
    body: "Tech allocation at 47% (target 40%). Consider shifting $6K to healthcare sector.",
    time: "3 days ago",
  },
];

const quickLinks = [
  { label: "Screen a stock", href: "/investments/screening" },
  { label: "Calculate Zakat", href: "/zakat" },
  { label: "Optimize credit cards", href: "/banking" },
  { label: "Ask AI coach", href: "/ai-coach" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Good morning, Ahmed</h1>
        <p className="text-gray-500 mt-1">Your halal financial overview — Ramadan 1446 AH</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl bg-white border border-gray-100 p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`rounded-lg p-2 ${stat.up ? "bg-green-50" : "bg-amber-50"}`}>
                <stat.icon className={`h-5 w-5 ${stat.up ? "text-green-600" : "text-amber-600"}`} />
              </div>
            </div>
            <div className={`mt-3 flex items-center gap-1 text-xs font-medium ${stat.up ? "text-green-600" : "text-amber-600"}`}>
              {stat.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {stat.change}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Alerts */}
        <div className="lg:col-span-2 rounded-xl bg-white border border-gray-100 shadow-sm">
          <div className="p-5 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">AI Agent Alerts</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {alerts.map((alert, i) => (
              <div key={i} className="p-5 flex gap-3">
                <div className="mt-0.5 flex-shrink-0">
                  {alert.type === "warning" && <AlertTriangle className="h-5 w-5 text-amber-500" />}
                  {alert.type === "success" && <CheckCircle className="h-5 w-5 text-green-500" />}
                  {alert.type === "info" && <TrendingUp className="h-5 w-5 text-blue-500" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{alert.title}</p>
                  <p className="text-sm text-gray-500 mt-0.5">{alert.body}</p>
                  <p className="text-xs text-gray-400 mt-1">{alert.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <div className="rounded-xl bg-white border border-gray-100 shadow-sm p-5">
            <h2 className="font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-2">
              {quickLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-brand-50 hover:text-brand-700 transition-colors"
                >
                  {link.label}
                  <span className="text-gray-300">→</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Zakat countdown */}
          <div className="rounded-xl bg-amber-50 border border-amber-100 p-5">
            <h3 className="font-semibold text-amber-900 mb-1">Zakat Due</h3>
            <p className="text-2xl font-bold text-amber-700">$2,108</p>
            <p className="text-sm text-amber-600 mt-1">45 days remaining · Based on current holdings</p>
            <Link
              href="/zakat"
              className="mt-3 inline-block text-xs font-semibold text-amber-700 underline underline-offset-2"
            >
              View full breakdown
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
