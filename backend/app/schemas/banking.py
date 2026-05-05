from pydantic import BaseModel, Field
from typing import Literal, List


class ArbitrageRequest(BaseModel):
    monthly_spend: float = Field(gt=0)
    credit_score: Literal["excellent", "good", "fair"] = "excellent"
    risk_tolerance: Literal["conservative", "moderate", "aggressive"] = "moderate"


class RecommendedCard(BaseModel):
    name: str
    bank: str
    credit_limit: float
    apr_months: int
    annual_fee: float
    rewards_rate: float


class ArbitrageStrategy(BaseModel):
    float_amount: float
    buffer_needed: float
    investable_cash: float
    investment_return: float
    rewards: float
    total_annual_gain: float
    cards: List[RecommendedCard]
    notes: str
