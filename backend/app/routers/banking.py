from fastapi import APIRouter, Depends

from app.dependencies import get_current_user
from app.models.user import User
from app.schemas.banking import ArbitrageRequest, ArbitrageStrategy
from app.services.arbitrage_service import generate_strategy

router = APIRouter()


@router.post("/arbitrage-strategy", response_model=ArbitrageStrategy)
def arbitrage_strategy(
    req: ArbitrageRequest,
    current_user: User = Depends(get_current_user),
):
    return generate_strategy(req)
