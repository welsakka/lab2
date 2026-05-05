"""
Buffered Arbitrage Cycle strategy generator.

Framework: use 0% APR promotional windows on credit cards to float
spending while keeping equivalent cash in a halal profit-sharing account
and investing the surplus in halal equities. Zero interest is ever paid
so the arrangement is permissible under mainstream Islamic finance opinion.
"""

from app.schemas.banking import ArbitrageRequest, ArbitrageStrategy, RecommendedCard

CARD_CATALOG = {
    "excellent": [
        RecommendedCard(
            name="Chase Sapphire Preferred",
            bank="Chase",
            credit_limit=0,
            apr_months=15,
            annual_fee=95.0,
            rewards_rate=0.02,
        ),
        RecommendedCard(
            name="Citi Double Cash",
            bank="Citi",
            credit_limit=0,
            apr_months=18,
            annual_fee=0.0,
            rewards_rate=0.02,
        ),
    ],
    "good": [
        RecommendedCard(
            name="Wells Fargo Active Cash",
            bank="Wells Fargo",
            credit_limit=0,
            apr_months=15,
            annual_fee=0.0,
            rewards_rate=0.02,
        ),
    ],
    "fair": [
        RecommendedCard(
            name="Discover it Cash Back",
            bank="Discover",
            credit_limit=0,
            apr_months=15,
            annual_fee=0.0,
            rewards_rate=0.015,
        ),
    ],
}

RETURN_ASSUMPTIONS = {
    "conservative": 0.05,
    "moderate": 0.07,
    "aggressive": 0.09,
}


def generate_strategy(req: ArbitrageRequest) -> ArbitrageStrategy:
    annual_return = RETURN_ASSUMPTIONS[req.risk_tolerance]
    avg_apr_months = 15

    float_amount = req.monthly_spend * avg_apr_months
    buffer = float_amount
    investable = req.monthly_spend * 4

    investment_return = investable * annual_return * (avg_apr_months / 12)
    base_rewards_rate = 0.015
    rewards = float_amount * base_rewards_rate

    total_gain = investment_return + rewards

    cards = CARD_CATALOG.get(req.credit_score, CARD_CATALOG["fair"])
    sized_cards = []
    for card in cards:
        limit = round(req.monthly_spend * 5)
        sized_cards.append(card.model_copy(update={"credit_limit": limit}))

    notes = (
        f"Strategy built for ${req.monthly_spend:,.0f}/month spend, "
        f"{req.credit_score} credit, {req.risk_tolerance} risk tolerance. "
        "Always pay full balance before 0% APR ends — AI agent alerts 60 days out."
    )

    return ArbitrageStrategy(
        float_amount=round(float_amount, 2),
        buffer_needed=round(buffer, 2),
        investable_cash=round(investable, 2),
        investment_return=round(investment_return, 2),
        rewards=round(rewards, 2),
        total_annual_gain=round(total_gain, 2),
        cards=sized_cards,
        notes=notes,
    )
