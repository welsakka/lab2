from fastapi import APIRouter
from app.schemas.banking import ArbitrageRequest, ArbitrageStrategy
from app.services.arbitrage_service import generate_strategy

router = APIRouter()


@router.post("/arbitrage-strategy", response_model=ArbitrageStrategy)
def arbitrage_strategy(req: ArbitrageRequest):
    return generate_strategy(req)
