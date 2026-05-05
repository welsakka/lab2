import Link from "next/link";
import { ArrowRight, Shield, TrendingUp, Calculator, CreditCard, BookOpen, Bot } from "lucide-react";

const pillars = [
  {
    icon: TrendingUp,
    title: "Investment Hub",
    description:
      "Screen any stock against AAOIFI standards, track your halal portfolio in real-time, and get AI alerts when compliance changes.",
    href: "/investments",
    color: "bg-green-50 text-green-700",
  },
  {
    icon: CreditCard,
    title: "Credit Optimizer",
    description:
      "The Buffered Arbitrage Cycle — earn $800–1,200/year from credit cards without touching interest. Uniquely halal.",
    href: "/banking",
    color: "bg-blue-50 text-blue-700",
  },
  {
    icon: Calculator,
    title: "Financial Planning",
    description:
      "AI retirement roadmap with Zakat modeling, halal home-purchase strategy, and Islamic estate planning (Faraid).",
    href: "/planning",
    color: "bg-purple-50 text-purple-700",
  },
  {
    icon: Shield,
    title: "Zakat Calculator",
    description:
      "Auto-calculate your annual Zakat across stocks, cash, gold, and business equity. Generates a shareable report.",
    href: "/zakat",
    color: "bg-amber-50 text-amber-700",
  },
  {
    icon: BookOpen,
    title: "Education & Community",
    description:
      "Structured learning paths from Halal Finance 101 to advanced estate planning, plus scholar Q&A and discussion forums.",
    href: "/education",
    color: "bg-rose-50 text-rose-700",
  },
  {
    icon: Bot,
    title: "AI Coach",
    description:
      "Ask anything — is this stock halal? How much should I invest? Get personalized answers grounded in your actual portfolio.",
    href: "/ai-coach",
    color: "bg-indigo-50 text-indigo-700",
  },
];

const tiers = [
  {
    name: "Free",
    price: "$0",
    description: "Get started with the basics.",
    features: [
      "10 stock screens / month",
      "Basic Zakat calculator",
      "Community forum (read-only)",
      "Halal Finance 101 course",
    ],
    cta: "Start for free",
    href: "/signup",
    highlight: false,
  },
  {
    name: "Essential",
    price: "$20",
    period: "/month",
    description: "For self-directed investors who want tools.",
    features: [
      "Unlimited stock screening",
      "Portfolio tracking & compliance alerts",
      "Purification calculator",
      "Credit card optimizer (basic)",
      "Community participation",
    ],
    cta: "Start Essential",
    href: "/signup?plan=essential",
    highlight: false,
  },
  {
    name: "Premium",
    price: "$35",
    period: "/month",
    description: "Serious wealth builders.",
    features: [
      "Everything in Essential",
      "AI financial planning (retirement, goals)",
      "Daily AI compliance monitoring",
      "Advanced credit optimizer + automation",
      "Real estate tools & halal mortgage finder",
      "Live scholar webinars",
    ],
    cta: "Start Premium",
    href: "/signup?plan=premium",
    highlight: true,
  },
  {
    name: "Family",
    price: "$50",
    period: "/month",
    description: "For households managing multiple accounts.",
    features: [
      "Everything in Premium",
      "Up to 5 user accounts",
      "Shared financial planning",
      "Islamic estate planning (Faraid)",
      "Family Zakat tracking",
    ],
    cta: "Start Family",
    href: "/signup?plan=family",
    highlight: false,
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-gray-100 px-6 py-4">
        <div className="mx-auto max-w-6xl flex items-center justify-between">
          <span className="text-xl font-bold text-brand-700">Halal Finance OS</span>
          <div className="flex items-center gap-6">
            <Link href="#pillars" className="text-sm text-gray-600 hover:text-gray-900">Features</Link>
            <Link href="#pricing" className="text-sm text-gray-600 hover:text-gray-900">Pricing</Link>
            <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900">Sign in</Link>
            <Link
              href="/signup"
              className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 transition-colors"
            >
              Get started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 py-24 text-center">
        <div className="mx-auto max-w-3xl">
          <span className="inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700 mb-6">
            Built by Muslims, for Muslims
          </span>
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 mb-6">
            The complete financial platform{" "}
            <span className="text-brand-600">for Muslim households</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 text-balance">
            Screen stocks, optimize credit cards the halal way, plan your retirement with Zakat
            modeling, and get AI-powered guidance — all in one platform. Stop cobbling together
            5 separate apps.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-6 py-3 font-semibold text-white hover:bg-brand-700 transition-colors"
            >
              Start for free <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="#pillars"
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              See how it works
            </Link>
          </div>
          <p className="mt-6 text-sm text-gray-500">
            No credit card required · Free plan available · Cancel anytime
          </p>
        </div>
      </section>

      {/* Cost of inaction */}
      <section className="bg-gray-50 px-6 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Without the right tools, you&apos;re leaving ~$175K on the table
          </h2>
          <p className="text-gray-600 mb-10">
            Over 10 years, a typical Muslim household loses this much through inaction — lost investment
            returns, missed credit card optimization, Zakat overpayments, and delayed retirement.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: "Lost investment returns", amount: "$150,000", detail: "Keeping $50K in checking instead of halal equities" },
              { label: "Missed credit optimization", amount: "$15,000", detail: "Not using Buffered Arbitrage Cycle strategy" },
              { label: "Zakat overpayment", amount: "$10,000", detail: "Estimating instead of calculating precisely" },
            ].map((item) => (
              <div key={item.label} className="rounded-xl bg-white border border-gray-100 p-6 text-left shadow-sm">
                <div className="text-2xl font-bold text-red-600 mb-1">{item.amount}</div>
                <div className="font-medium text-gray-900 mb-2">{item.label}</div>
                <div className="text-sm text-gray-500">{item.detail}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section id="pillars" className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything in one platform</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Zoya does screening. Wahed does robo-advising. We do both — plus planning, optimization,
              education, and AI agents that work for you 24/7.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pillars.map((pillar) => (
              <Link
                key={pillar.title}
                href={pillar.href}
                className="group rounded-xl border border-gray-100 p-6 hover:shadow-md transition-shadow"
              >
                <div className={`inline-flex rounded-lg p-2 ${pillar.color} mb-4`}>
                  <pillar.icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-brand-600 transition-colors">
                  {pillar.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">{pillar.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="bg-gray-50 px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Simple, transparent pricing</h2>
            <p className="text-gray-600">Start free. Upgrade when you need more.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`rounded-xl border p-6 flex flex-col ${
                  tier.highlight
                    ? "border-brand-500 bg-brand-600 text-white shadow-lg"
                    : "border-gray-200 bg-white"
                }`}
              >
                <div className="mb-4">
                  <div className={`text-sm font-medium mb-1 ${tier.highlight ? "text-brand-100" : "text-gray-500"}`}>
                    {tier.name}
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold">{tier.price}</span>
                    {tier.period && (
                      <span className={`text-sm ${tier.highlight ? "text-brand-200" : "text-gray-500"}`}>
                        {tier.period}
                      </span>
                    )}
                  </div>
                  <p className={`text-sm mt-1 ${tier.highlight ? "text-brand-100" : "text-gray-500"}`}>
                    {tier.description}
                  </p>
                </div>
                <ul className="space-y-2 mb-6 flex-1">
                  {tier.features.map((f) => (
                    <li key={f} className={`text-sm flex gap-2 ${tier.highlight ? "text-brand-100" : "text-gray-600"}`}>
                      <span className={tier.highlight ? "text-brand-200" : "text-brand-500"}>✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={tier.href}
                  className={`block text-center rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${
                    tier.highlight
                      ? "bg-white text-brand-700 hover:bg-brand-50"
                      : "bg-brand-600 text-white hover:bg-brand-700"
                  }`}
                >
                  {tier.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 px-6 py-12">
        <div className="mx-auto max-w-6xl flex flex-col md:flex-row justify-between gap-8">
          <div>
            <span className="text-lg font-bold text-brand-700">Halal Finance OS</span>
            <p className="mt-2 text-sm text-gray-500 max-w-xs">
              The comprehensive financial platform for Muslim households. Built with integrity.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Platform</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><Link href="/investments" className="hover:text-gray-900">Investments</Link></li>
                <li><Link href="/banking" className="hover:text-gray-900">Credit Optimizer</Link></li>
                <li><Link href="/planning" className="hover:text-gray-900">Planning</Link></li>
                <li><Link href="/zakat" className="hover:text-gray-900">Zakat</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Learn</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><Link href="/education" className="hover:text-gray-900">Education Hub</Link></li>
                <li><Link href="/education/101" className="hover:text-gray-900">Halal Finance 101</Link></li>
                <li><Link href="/education/community" className="hover:text-gray-900">Community</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Company</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><Link href="/about" className="hover:text-gray-900">About</Link></li>
                <li><Link href="/privacy" className="hover:text-gray-900">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-gray-900">Terms</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mx-auto max-w-6xl mt-8 pt-8 border-t border-gray-100 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} Halal Finance OS. Not financial advice.
          All investment decisions should be made in consultation with a qualified advisor.
        </div>
      </footer>
    </div>
  );
}
