# Architecture

## Overview

Halal Finance OS is a full-stack SaaS application with:
- **Frontend:** Next.js 14 App Router (TypeScript, Tailwind CSS)
- **Backend:** Python FastAPI (async, Pydantic v2)
- **Database:** PostgreSQL 16 via SQLAlchemy 2.0
- **Cache:** Redis 7 (session data, rate limiting, screening cache)
- **AI:** Anthropic Claude API (`claude-sonnet-4-6`) with prompt caching
- **Auth:** JWT (jose) — swap in Clerk for production
- **Payments:** Stripe subscriptions
- **Bank Linking:** Plaid (sandbox → production)
- **Market Data:** yfinance (free) — swap for FMP or Intrinio at scale

## Directory Structure

```
halal-finance-os/
├── frontend/src/
│   ├── app/
│   │   ├── (auth)/              # Login, Signup — no sidebar
│   │   ├── (dashboard)/         # All authenticated pages
│   │   │   ├── dashboard/       # Overview / home
│   │   │   ├── investments/     # Hub + screening + portfolio sub-routes
│   │   │   ├── banking/         # Credit optimizer
│   │   │   ├── planning/        # Retirement + goals
│   │   │   ├── zakat/           # Zakat calculator
│   │   │   ├── real-estate/     # Mortgage finder, REIT screener
│   │   │   ├── education/       # Courses, webinars, community
│   │   │   └── ai-coach/        # Conversational AI
│   │   └── page.tsx             # Public landing page
│   ├── components/
│   │   ├── layout/              # Sidebar, Topbar
│   │   ├── investments/         # StockScreener
│   │   ├── banking/             # BufferedArbitrageCalculator
│   │   ├── planning/            # RetirementPlanner
│   │   ├── zakat/               # ZakatCalculator
│   │   └── ai/                  # AICoach chat UI
│   ├── lib/
│   │   ├── api.ts               # Axios client + typed API helpers
│   │   └── utils.ts             # cn(), formatCurrency(), halalStatus helpers
│   └── types/index.ts           # Shared TypeScript types
│
└── backend/app/
    ├── routers/                 # FastAPI route handlers (thin)
    ├── services/                # Business logic
    │   ├── screening_service.py # AAOIFI screening via yfinance
    │   ├── zakat_service.py     # Zakat calculation + live gold price
    │   ├── arbitrage_service.py # Buffered Arbitrage Cycle strategy
    │   ├── planning_service.py  # Retirement math + Zakat modeling
    │   └── ai_service.py        # Claude streaming with prompt caching
    ├── models/                  # SQLAlchemy ORM models
    └── schemas/                 # Pydantic request/response schemas
```

## Data Flow: Stock Screening

```
User types ticker → StockScreener.tsx
  → GET /api/v1/screening/{ticker}
  → screening.py router
  → screening_service.screen_ticker()
    → yfinance.Ticker(ticker).info
    → compute 4 AAOIFI ratios
    → determine status (halal / borderline / monitor / not-halal)
    → compute purification per share
  ← ScreenResult JSON
← ComplianceBadge + ratio bars rendered
```

## Data Flow: AI Coach

```
User message → AICoach.tsx (optimistic UI)
  → POST /api/v1/ai/coach/stream (SSE)
  → ai_agents.py router
  → ai_service.stream_coach_response()
    → anthropic.messages.stream(
        model="claude-sonnet-4-6",
        system=[{..., cache_control: ephemeral}],  ← cached system prompt
        messages=[...conversation history]
      )
    → yield SSE chunks as "data: {text}" lines
  ← EventSource reads chunks → append to message bubble
```

## Prompt Caching

The AI coach's system prompt (~1,200 tokens) is marked `cache_control: ephemeral`.
On cache hits (same prompt prefix), Anthropic charges ~10% of normal input token cost.
With 100 messages/day per user, this saves ~90% on system prompt costs at scale.

## Screening Data Freshness

| Tier | Refresh Frequency | Source |
|---|---|---|
| Free | On-demand (cached 24h in Redis) | yfinance |
| Essential | Daily background refresh | yfinance |
| Premium | 4-hour refresh + compliance alerts | yfinance + webhook |

At 1,000+ users, replace yfinance with Financial Modeling Prep ($50/month) for
reliable, rate-limit-free fundamental data.

## Authentication Flow

```
POST /api/v1/auth/register → JWT (7 days)
  → stored in httpOnly cookie on frontend
  → all dashboard requests attach cookie
  → backend validates JWT, extracts user_id
```

## Subscription Tiers

Gated in middleware by `user.plan`:
- `free` → 10 screen calls/month (Redis counter)
- `essential` → unlimited screens + portfolio
- `premium` → essential + AI agents + planning
- `family` → premium + up to 5 sub-accounts

Stripe webhook updates `user.plan` on subscription change.
