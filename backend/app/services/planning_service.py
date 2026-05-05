"""
Retirement planning service — halal-aware.

Uses standard compound-growth math. Zakat is modeled as a 2.5% annual
draw on the portfolio starting at retirement, reducing the effective
4% safe withdrawal rate.
"""

import math
from app.schemas.planning import RetirementRequest, RetirementPlan

HALAL_VEHICLES = [
    "Wahed Invest halal robo-advisor",
    "HLAL ETF (Wahed FTSE USA Shariah ETF) in brokerage IRA",
    "AMANX (Amana Growth Fund) in Roth IRA",
    "Self-directed halal stock portfolio (use Screening tab)",
    "UTMA account with AAOIFI-screened equities for children",
]

ZAKAT_RATE = 0.025
SAFE_WITHDRAWAL_RATE = 0.04
TARGET_PORTFOLIO = 1_500_000.0


def compute_retirement_plan(req: RetirementRequest) -> RetirementPlan:
    years = req.target_retirement_age - req.current_age
    if years <= 0:
        years = 1

    monthly_rate = (req.annual_return_pct / 100) / 12
    months = years * 12

    fv_current = req.current_savings * math.pow(1 + monthly_rate, months)
    if monthly_rate > 0:
        fv_contrib = req.monthly_contribution * ((math.pow(1 + monthly_rate, months) - 1) / monthly_rate)
    else:
        fv_contrib = req.monthly_contribution * months

    projected = fv_current + fv_contrib
    monthly_income = projected * SAFE_WITHDRAWAL_RATE / 12
    zakat_at_retirement = projected * ZAKAT_RATE

    on_track = projected >= TARGET_PORTFOLIO
    gap = max(0.0, TARGET_PORTFOLIO - projected)

    suggested_contribution = req.monthly_contribution
    if not on_track and monthly_rate > 0:
        pv_gap = gap / math.pow(1 + monthly_rate, months)
        extra = pv_gap * monthly_rate / (math.pow(1 + monthly_rate, months) - 1)
        suggested_contribution = req.monthly_contribution + extra

    return RetirementPlan(
        projected_value=round(projected, 2),
        monthly_income_at_retirement=round(monthly_income, 2),
        years_to_retirement=years,
        zakat_at_retirement=round(zakat_at_retirement, 2),
        on_track=on_track,
        gap_amount=round(gap, 2),
        suggested_monthly_contribution=round(suggested_contribution, 2),
        halal_vehicle_suggestions=HALAL_VEHICLES,
    )
