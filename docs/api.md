# API Reference

Base URL: `http://localhost:8000/api/v1`

Interactive docs: `http://localhost:8000/docs` (Swagger UI)

---

## Authentication

### POST `/auth/register`
```json
{ "name": "Ahmed Khan", "email": "ahmed@example.com", "password": "..." }
```
Returns: `{ "access_token": "...", "token_type": "bearer" }`

### POST `/auth/login`
```json
{ "email": "ahmed@example.com", "password": "..." }
```
Returns: `{ "access_token": "...", "token_type": "bearer" }`

---

## Screening

### GET `/screening/{ticker}`
Screen a single stock against AAOIFI criteria.

**Response:**
```json
{
  "ticker": "MSFT",
  "name": "Microsoft Corporation",
  "sector": "Technology",
  "status": "halal",
  "ratios": {
    "debt_to_assets": 18.2,
    "interest_income_ratio": 2.1,
    "cash_and_securities_ratio": 21.4,
    "non_permissible_income_ratio": 0.0
  },
  "purification_amount": 0.12,
  "last_checked": "2026-05-05",
  "notes": "Passes all AAOIFI screening criteria."
}
```

### POST `/screening/batch`
Screen up to 25 tickers at once.

**Request:** `{ "tickers": ["MSFT", "GOOGL", "AAPL"] }`
**Response:** Array of ScreenResult objects.

---

## Zakat

### POST `/zakat/calculate`
```json
{
  "cash": 10000,
  "stocks": 50000,
  "gold": 5000,
  "silver": 0,
  "business_equity": 0,
  "receivables": 2000
}
```
**Response:**
```json
{
  "total_zakatable": 67000,
  "nisab_threshold": 7020.0,
  "gold_price_per_oz": 2340.0,
  "above_nisab": true,
  "zakat_due": 1675.0,
  "zakat_rate": 0.025,
  "breakdown": { ... },
  "calculated_at": "2026-05-05T12:00:00"
}
```

### GET `/zakat/gold-price`
Returns live gold price and nisab threshold.

---

## Banking

### POST `/banking/arbitrage-strategy`
```json
{
  "monthly_spend": 3000,
  "credit_score": "excellent",
  "risk_tolerance": "moderate"
}
```
**Response:**
```json
{
  "float_amount": 45000,
  "buffer_needed": 45000,
  "investable_cash": 12000,
  "investment_return": 1050.0,
  "rewards": 675.0,
  "total_annual_gain": 1725.0,
  "cards": [
    {
      "name": "Chase Sapphire Preferred",
      "bank": "Chase",
      "credit_limit": 15000,
      "apr_months": 15,
      "annual_fee": 95,
      "rewards_rate": 0.02
    }
  ],
  "notes": "..."
}
```

---

## Planning

### POST `/planning/retirement`
```json
{
  "current_age": 32,
  "target_retirement_age": 55,
  "current_savings": 85000,
  "monthly_contribution": 2000,
  "annual_return_pct": 7.0
}
```
**Response:**
```json
{
  "projected_value": 1623410.50,
  "monthly_income_at_retirement": 5411.37,
  "years_to_retirement": 23,
  "zakat_at_retirement": 40585.26,
  "on_track": true,
  "gap_amount": 0,
  "suggested_monthly_contribution": 2000,
  "halal_vehicle_suggestions": ["HLAL ETF...", "AMANX..."]
}
```

---

## AI Coach

### POST `/ai/coach/stream`
Server-sent events (SSE) endpoint. Returns streamed response.

**Request:**
```json
{
  "messages": [
    { "role": "user", "content": "Is AAPL halal?" }
  ]
}
```

**SSE stream:**
```
data: {"text": "Apple (AAPL)"}
data: {"text": " passes all"}
data: {"text": " AAOIFI criteria..."}
data: [DONE]
```
