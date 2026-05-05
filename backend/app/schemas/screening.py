from pydantic import BaseModel
from typing import Literal, Optional


HalalStatus = Literal["halal", "borderline", "monitor", "not-halal", "unknown"]


class ScreeningRatios(BaseModel):
    debt_to_assets: float
    interest_income_ratio: float
    cash_and_securities_ratio: float
    non_permissible_income_ratio: float


class ScreenResult(BaseModel):
    ticker: str
    name: str
    sector: str
    status: HalalStatus
    ratios: ScreeningRatios
    purification_amount: Optional[float]
    last_checked: str
    notes: str


class BatchScreenRequest(BaseModel):
    tickers: list[str]
