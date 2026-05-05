# Halal Finance OS

The first comprehensive financial platform for Muslim households. Think "Personal Capital meets YNAB, but Sharia-compliant and AI-powered."

## What It Is

Halal Finance OS integrates six pillars into one platform:

1. **Investment Hub** — Halal stock screening, portfolio tracking, purification calculator, compliance monitoring
2. **Banking & Credit Optimizer** — Buffered Arbitrage Cycle framework for halal credit card optimization
3. **Financial Planning** — AI retirement planner with Zakat modeling, home purchase strategy, Islamic estate planning
4. **Real Estate & Alternatives** — Halal mortgage finder, REIT screening, sukuk, gold tracking
5. **Education & Community** — Learning paths, scholar Q&A, discussion forums
6. **AI Agents** — Proactive compliance monitor, rebalancing optimizer, Zakat calculator, AI financial coach

## Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS |
| Backend | Python FastAPI, SQLAlchemy, Alembic |
| Database | PostgreSQL 16 |
| Cache | Redis 7 |
| AI | Anthropic Claude API (claude-sonnet-4-6) |
| Auth | Clerk / NextAuth |
| Payments | Stripe |
| Bank Linking | Plaid |

## Pricing Tiers

| Tier | Price | Target |
|---|---|---|
| Free | $0/month | Acquisition, trust-building |
| Essential | $20/month | Self-directed investors |
| Premium | $35/month | Serious wealth builders |
| Family | $50/month | Multi-account households |

## Quick Start

### Prerequisites
- Node.js 20+
- Python 3.12+
- Docker & Docker Compose

### Development

```bash
# Clone and install
git clone <repo>
cd halal-finance-os

# Start all services
docker compose up -d

# Frontend only (hot reload)
cd frontend && npm install && npm run dev

# Backend only
cd backend && python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

Frontend runs at `http://localhost:3000`  
API runs at `http://localhost:8000`  
API docs at `http://localhost:8000/docs`

## Project Structure

```
halal-finance-os/
├── frontend/          # Next.js 14 app
│   └── src/
│       ├── app/       # App Router pages
│       ├── components/
│       ├── lib/
│       └── types/
├── backend/           # FastAPI server
│   └── app/
│       ├── routers/   # API endpoints
│       ├── services/  # Business logic
│       ├── models/    # SQLAlchemy models
│       └── schemas/   # Pydantic schemas
└── docs/              # Architecture & specs
```

## Key Differentiators

- **Buffered Arbitrage Cycle** — Unique halal credit card optimization framework (no one else offers this)
- **Proactive AI agents** — Monitors compliance 24/7, alerts before 0% APR ends, auto-calculates Zakat
- **Comprehensive** — Zoya does screening; we do screening + planning + optimization + education
- **Authenticity** — Built by Muslims, for Muslims

## Roadmap

- [ ] Phase 1: MVP — Stock screening + portfolio tracking + basic credit optimizer (Months 1-3)
- [ ] Phase 2: Launch — 100 paying users, community forum, educational content (Months 4-6)
- [ ] Phase 3: Growth — AI agents, mobile app, 500 users (Months 7-12)
- [ ] Phase 4: Scale — International expansion, B2B, 2,000+ users (Year 2)

## Docs

- [Architecture](docs/architecture.md)
- [API Reference](docs/api.md)
- [Product Spec](docs/product-spec.md)
