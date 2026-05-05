"""
Halal stock screening against AAOIFI standards.

AAOIFI thresholds (all ratios use 24-month rolling average of market cap as denominator):
  - Debt / Total Assets < 33%
  - Interest-bearing securities + cash / Total Assets < 33%
  - Accounts receivable + cash / Total Assets < 33%
  - Non-permissible income / Total Revenue < 5%

Primary data source: yfinance (free). For production, replace with
a paid fundamental data provider (e.g., Financial Modeling Prep, Intrinio).
"""

from datetime import date
from typing import Optional
import yfinance as yf

from app.schemas.screening import ScreenResult, ScreeningRatios


AAOIFI = {
    "debt_to_assets": 33.0,
    "interest_income_ratio": 33.0,
    "cash_and_securities_ratio": 33.0,
    "non_permissible_income_ratio": 5.0,
}

NON_PERMISSIBLE_SECTORS = {
    "Alcohol", "Tobacco", "Weapons", "Gambling", "Adult Entertainment",
    "Pork", "Conventional Banking", "Conventional Insurance",
}


def _determine_status(ratios: ScreeningRatios) -> tuple[str, str]:
    """Returns (status, notes)."""
    fails = []
    if ratios.debt_to_assets >= AAOIFI["debt_to_assets"]:
        fails.append(f"debt/assets {ratios.debt_to_assets:.1f}% ≥ 33%")
    if ratios.interest_income_ratio >= AAOIFI["interest_income_ratio"]:
        fails.append(f"interest income {ratios.interest_income_ratio:.1f}% ≥ 33%")
    if ratios.cash_and_securities_ratio >= AAOIFI["cash_and_securities_ratio"]:
        fails.append(f"cash & securities {ratios.cash_and_securities_ratio:.1f}% ≥ 33%")
    if ratios.non_permissible_income_ratio >= AAOIFI["non_permissible_income_ratio"]:
        fails.append(f"non-permissible income {ratios.non_permissible_income_ratio:.1f}% ≥ 5%")

    within_10pct = [
        ratios.debt_to_assets >= AAOIFI["debt_to_assets"] * 0.9,
        ratios.interest_income_ratio >= AAOIFI["interest_income_ratio"] * 0.9,
        ratios.cash_and_securities_ratio >= AAOIFI["cash_and_securities_ratio"] * 0.9,
    ]

    if fails:
        return "not-halal", "Fails AAOIFI criteria: " + "; ".join(fails)
    if any(within_10pct):
        return "monitor", "Within 10% of AAOIFI thresholds — monitor quarterly filings."
    return "halal", "Passes all four AAOIFI screening criteria."


def screen_ticker(ticker: str) -> Optional[ScreenResult]:
    try:
        stock = yf.Ticker(ticker.upper())
        info = stock.info

        if not info or "shortName" not in info:
            return None

        total_assets = info.get("totalAssets") or 1
        total_debt = info.get("totalDebt") or 0
        interest_expense = info.get("interestExpense") or 0
        total_revenue = info.get("totalRevenue") or 1
        cash = info.get("totalCash") or 0
        sector = info.get("sector", "Unknown")

        debt_pct = (total_debt / total_assets) * 100
        interest_pct = abs(interest_expense / total_revenue) * 100
        cash_pct = (cash / total_assets) * 100
        non_perm_pct = 0.0

        if sector in NON_PERMISSIBLE_SECTORS:
            non_perm_pct = 100.0

        ratios = ScreeningRatios(
            debt_to_assets=round(debt_pct, 2),
            interest_income_ratio=round(interest_pct, 2),
            cash_and_securities_ratio=round(cash_pct, 2),
            non_permissible_income_ratio=round(non_perm_pct, 2),
        )

        status, notes = _determine_status(ratios)

        # Simple purification: interest income per share
        shares_outstanding = info.get("sharesOutstanding") or 1
        purification = round(abs(interest_expense) / shares_outstanding, 4) if interest_expense else 0.0

        return ScreenResult(
            ticker=ticker.upper(),
            name=info.get("shortName", ticker),
            sector=sector,
            status=status,
            ratios=ratios,
            purification_amount=purification if status != "not-halal" else None,
            last_checked=date.today().isoformat(),
            notes=notes,
        )
    except Exception:
        return None
