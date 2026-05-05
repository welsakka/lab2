# Product Specification

## Vision

Halal Finance OS is the first comprehensive financial platform for Muslim households.
"Personal Capital meets YNAB, but Sharia-compliant and AI-powered."

## Target Users

| Persona | Description | Primary Use Case |
|---|---|---|
| Ahmed, 32 | Software engineer, $120K income, starting to invest | Stock screening + credit optimizer |
| Fatima, 45 | Small business owner, high income | Zakat calculation + estate planning |
| Omar, 28 | Recent grad, building wealth | Education + retirement planning |
| The Khan Family | Dual income, 3 kids | Family tier, college savings, inheritance |

## Feature Pillars

### 1. Investment Hub

**Core features:**
- AAOIFI stock screener (live ratios, pass/fail, notes)
- Portfolio tracker (link brokerage accounts via Plaid)
- Real-time compliance monitoring (daily batch refresh, push alerts)
- Purification calculator (auto-calculates impermissible income per share)
- AI rebalancing suggestions

**AAOIFI Screening Criteria:**
1. Total Debt / Total Assets < 33%
2. Interest-bearing income / Total Revenue < 33%
3. Cash + Interest-bearing Securities / Total Assets < 33%
4. Non-permissible income / Total Revenue < 5%

**Status levels:**
- `halal` — all criteria pass with >10% margin
- `monitor` — within 10% of any threshold
- `borderline` — just passing (10–5% margin)
- `not-halal` — fails one or more criteria

**Free tier:** 10 screens/month
**Essential+:** Unlimited + portfolio tracking
**Premium:** + daily monitoring + alerts

---

### 2. Halal Banking & Credit Optimizer

**The Buffered Arbitrage Cycle (proprietary framework):**

No competitor offers this. The insight: 0% APR credit cards are permissible if
no interest is ever paid. By maintaining a cash buffer equal to the card balance,
the user can invest the freed capital in halal equities for 12–18 months.

**Strategy generator inputs:**
- Monthly spend
- Credit score (excellent / good / fair)
- Risk tolerance (conservative / moderate / aggressive)

**Strategy outputs:**
- Recommended card(s) with credit limits
- Float amount on cards
- Buffer amount in profit-sharing account
- Investable surplus in halal equities
- Projected annual gain ($800–$1,500 typical)
- Alert schedule (60 days before 0% APR ends)

**AI Agent (Credit Card Strategist):**
- Monitors all card APR end dates
- Alerts user 60 days out
- Recommends next card to apply for
- Tracks cumulative value generated

---

### 3. Financial Planning

**Retirement Planner:**
- Inputs: age, target retirement age, savings, monthly contribution, assumed return
- Outputs: projected portfolio, monthly income, on-track status, gap analysis
- Zakat modeling: shows annual Zakat at retirement (2.5% of portfolio)
- Suggests halal investment vehicles (HLAL ETF, Amana Funds, etc.)

**Zakat Calculator:**
- Asset classes: cash, stocks, gold, silver, business equity, receivables
- Live gold price for nisab calculation (3 troy oz = nisab threshold)
- Generates downloadable PDF report
- Saves annual records for historical comparison

**Goals (roadmap):**
- Home purchase (halal mortgage timeline, down payment planner)
- College savings (UTMA with screened stocks vs. 529 risk)
- Islamic estate planning (Faraid calculator, Wasiyyah guidance)

---

### 4. Real Estate & Alternatives

**Halal Mortgage Finder:**
- Partner integrations: Guidance Residential, Lariba, University Islamic Financial
- Structures explained: Ijara, Musharaka Mutanaqisa, Murabaha
- State availability lookup
- Comparison vs. renting + investing delta

**REIT Screener:**
- Applies AAOIFI criteria to publicly traded REITs
- Flags income sources (rental = permissible, interest income = impermissible)

**Alternatives:**
- Gold tracking (holdings value, Zakat on gold)
- Sukuk explainer (where to buy, how to evaluate)
- Educational content on halal private equity

---

### 5. Education & Community

**Learning Paths:**
1. Halal Finance 101 (8 lessons, 3 hours) — beginner
2. Advanced Halal Investing (12 lessons, 5 hours) — intermediate
3. Islamic Estate Planning (6 lessons, 2.5 hours) — advanced

**Live Content:**
- Monthly scholar webinars (Premium feature)
- AMA sessions with successful Muslim investors
- Annual Zakat Q&A with qualified scholars

**Community:**
- Discussion forum (Reddit-style)
- Stock discussion threads ("Is TSLA still halal?")
- Accountability groups (Zakat payment reminders, investment clubs)

**Content strategy:**
- SEO articles: "is [STOCK] halal?", "halal investing guide", "Islamic finance 101"
- Substack integration (import existing content)
- YouTube channel (weekly videos)

---

### 6. AI Agents

| Agent | Trigger | Action |
|---|---|---|
| Compliance Monitor | Daily | Scan portfolio for status changes, alert on changes |
| Rebalancing Optimizer | Weekly | Flag drift >5% from target, suggest trades |
| Zakat Calculator | Annually / on demand | Full Zakat report across all accounts |
| Credit Card Strategist | Calendar-based | Alert 60 days before 0% APR ends |
| Financial Coach | User-initiated | Conversational Q&A, personalized to portfolio |

**AI Coach system prompt key behaviors:**
- Ground answers in AAOIFI / OIC Fiqh Academy
- Present disputed opinions honestly
- Be quantitative — show calculations
- Recommend qualified scholar for fatwa
- Add disclaimer only for specific advice

---

## Pricing

| Tier | Price | Key Gate |
|---|---|---|
| Free | $0 | 10 screens/month, read-only community |
| Essential | $20/month | Unlimited screens, portfolio, basic optimizer |
| Premium | $35/month | AI agents, planning, real estate, webinars |
| Family | $50/month | 5 accounts, estate planning, family Zakat |

Annual plans at ~15% discount ($200/$350/$500/year).

---

## Success Metrics (Year 1)

| Metric | Target |
|---|---|
| Email subscribers | 10,000 |
| Free users | 5,000 |
| Paying users | 500 |
| MRR | $10,000 |
| Avg Revenue Per User | $22 |
| Monthly Churn | <5% |
| NPS | >50 |

---

## Regulatory Notes

- Stock screening and educational tools: no license required
- Financial planning tools: disclaim "not financial advice"
- Investment management: do not take custody of assets — integrate with Wahed/Plaid
- Mortgage referrals: real estate referral license may be required by state
- Zakat: purely educational/calculation tool, not a financial institution

Consult legal counsel before launching in each jurisdiction.
