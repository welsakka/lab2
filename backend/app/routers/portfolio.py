from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.database import get_db
from app.models.portfolio import Holding

router = APIRouter()


class AddHoldingRequest(BaseModel):
    ticker: str
    shares: float
    avg_cost: float | None = None


@router.get("/")
def get_portfolio(db: Session = Depends(get_db)):
    # TODO: extract user_id from JWT token (middleware)
    holdings = db.query(Holding).all()
    return holdings


@router.post("/holdings", status_code=201)
def add_holding(req: AddHoldingRequest, db: Session = Depends(get_db)):
    holding = Holding(
        user_id="00000000-0000-0000-0000-000000000000",  # placeholder until auth middleware
        ticker=req.ticker.upper(),
        shares=req.shares,
        avg_cost=req.avg_cost,
    )
    db.add(holding)
    db.commit()
    db.refresh(holding)
    return holding


@router.delete("/holdings/{holding_id}", status_code=204)
def remove_holding(holding_id: str, db: Session = Depends(get_db)):
    holding = db.query(Holding).filter(Holding.id == holding_id).first()
    if not holding:
        raise HTTPException(status_code=404, detail="Holding not found")
    db.delete(holding)
    db.commit()
