from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.models.plaid_item import PlaidItem
from app.models.user import User
from app.services import plaid_service

router = APIRouter()


class ExchangeTokenRequest(BaseModel):
    public_token: str
    institution_name: str = ""


@router.post("/link-token")
def create_link_token(current_user: User = Depends(get_current_user)):
    try:
        token = plaid_service.create_link_token(str(current_user.id))
        return {"link_token": token}
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Plaid error: {str(e)}")


@router.post("/exchange-token", status_code=201)
def exchange_token(
    req: ExchangeTokenRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        access_token, item_id = plaid_service.exchange_public_token(req.public_token)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Plaid exchange error: {str(e)}")

    # Prevent duplicate items
    if db.query(PlaidItem).filter(PlaidItem.item_id == item_id).first():
        return {"ok": True, "message": "Already connected"}

    item = PlaidItem(
        user_id=current_user.id,
        access_token=access_token,
        item_id=item_id,
        institution_name=req.institution_name or None,
    )
    db.add(item)
    db.commit()

    # Trigger initial sync
    plaid_service.sync_holdings(current_user.id, db)

    return {"ok": True, "institution": req.institution_name}


@router.post("/sync")
def sync(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    holdings = plaid_service.sync_holdings(current_user.id, db)
    return {"synced": len(holdings)}
