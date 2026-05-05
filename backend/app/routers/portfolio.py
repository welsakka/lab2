from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.models.portfolio import Holding
from app.models.user import User

router = APIRouter()


class AddHoldingRequest(BaseModel):
    ticker: str
    shares: float
    avg_cost: float | None = None


class HoldingResponse(BaseModel):
    id: str
    ticker: str
    shares: float
    avg_cost: float | None
    status: str
    purification_per_share: float

    class Config:
        from_attributes = True


@router.get("/", response_model=list[HoldingResponse])
def get_portfolio(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    holdings = db.query(Holding).filter(Holding.user_id == current_user.id).all()
    return [
        HoldingResponse(
            id=str(h.id),
            ticker=h.ticker,
            shares=h.shares,
            avg_cost=h.avg_cost,
            status=h.status.value if h.status else "unknown",
            purification_per_share=h.purification_per_share or 0.0,
        )
        for h in holdings
    ]


@router.post("/holdings", status_code=status.HTTP_201_CREATED, response_model=HoldingResponse)
def add_holding(
    req: AddHoldingRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    holding = Holding(
        user_id=current_user.id,
        ticker=req.ticker.upper(),
        shares=req.shares,
        avg_cost=req.avg_cost,
    )
    db.add(holding)
    db.commit()
    db.refresh(holding)
    return HoldingResponse(
        id=str(holding.id),
        ticker=holding.ticker,
        shares=holding.shares,
        avg_cost=holding.avg_cost,
        status=holding.status.value if holding.status else "unknown",
        purification_per_share=holding.purification_per_share or 0.0,
    )


@router.delete("/holdings/{holding_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_holding(
    holding_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    holding = db.query(Holding).filter(Holding.id == holding_id).first()
    if not holding:
        raise HTTPException(status_code=404, detail="Holding not found")
    if holding.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    db.delete(holding)
    db.commit()
