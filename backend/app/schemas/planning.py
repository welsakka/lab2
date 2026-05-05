from pydantic import BaseModel, Field
from typing import Optional


class RetirementRequest(BaseModel):
    current_age: int = Field(ge=18, le=80)
    target_retirement_age: int = Field(ge=40, le=90)
    current_savings: float = Field(ge=0)
    monthly_contribution: float = Field(ge=0)
    annual_return_pct: float = Field(default=7.0, ge=1, le=15)
    target_monthly_income: Optional[float] = None


class RetirementPlan(BaseModel):
    projected_value: float
    monthly_income_at_retirement: float
    years_to_retirement: int
    zakat_at_retirement: float
    on_track: bool
    gap_amount: float
    suggested_monthly_contribution: float
    halal_vehicle_suggestions: list[str]
