from pydantic import BaseModel, Field


class ZakatAssetsInput(BaseModel):
    cash: float = Field(default=0.0, ge=0)
    stocks: float = Field(default=0.0, ge=0)
    gold: float = Field(default=0.0, ge=0)
    silver: float = Field(default=0.0, ge=0)
    business_equity: float = Field(default=0.0, ge=0)
    receivables: float = Field(default=0.0, ge=0)


class ZakatReport(BaseModel):
    total_zakatable: float
    nisab_threshold: float
    gold_price_per_oz: float
    above_nisab: bool
    zakat_due: float
    zakat_rate: float = 0.025
    breakdown: ZakatAssetsInput
    calculated_at: str
