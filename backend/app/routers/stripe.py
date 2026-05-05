import stripe as stripe_lib
from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import PlanTier, User

router = APIRouter()

_PRICE_TO_PLAN: dict[str, PlanTier] = {}


def _build_price_map() -> dict[str, PlanTier]:
    return {
        p: t
        for p, t in [
            (settings.stripe_price_essential, PlanTier.essential),
            (settings.stripe_price_premium, PlanTier.premium),
            (settings.stripe_price_family, PlanTier.family),
        ]
        if p
    }


def _price_to_plan(price_id: str) -> PlanTier:
    mapping = _build_price_map()
    return mapping.get(price_id, PlanTier.free)


class CheckoutRequest(BaseModel):
    price_id: str


@router.post("/checkout")
def create_checkout(
    req: CheckoutRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    stripe_lib.api_key = settings.stripe_secret_key

    customer_id = current_user.stripe_customer_id
    if not customer_id:
        customer = stripe_lib.Customer.create(
            email=current_user.email,
            name=current_user.name,
        )
        customer_id = customer.id
        db.query(User).filter(User.id == current_user.id).update(
            {"stripe_customer_id": customer_id}
        )
        db.commit()

    session = stripe_lib.checkout.Session.create(
        customer=customer_id,
        payment_method_types=["card"],
        line_items=[{"price": req.price_id, "quantity": 1}],
        mode="subscription",
        success_url=f"{settings.frontend_url}/dashboard?upgraded=1",
        cancel_url=f"{settings.frontend_url}/dashboard",
    )
    return {"checkout_url": session.url}


@router.post("/webhook")
async def stripe_webhook(request: Request, db: Session = Depends(get_db)):
    """
    Handles Stripe subscription lifecycle events.
    Must be unprotected (Stripe calls this directly, not the browser).
    Reads raw body for signature verification — do NOT use Pydantic model here.

    Test locally: stripe listen --forward-to localhost:8000/api/v1/stripe/webhook
    """
    stripe_lib.api_key = settings.stripe_secret_key
    payload = await request.body()
    sig = request.headers.get("stripe-signature", "")

    try:
        event = stripe_lib.Webhook.construct_event(
            payload, sig, settings.stripe_webhook_secret
        )
    except stripe_lib.error.SignatureVerificationError:
        raise HTTPException(status_code=400, detail="Invalid Stripe signature")
    except Exception:
        raise HTTPException(status_code=400, detail="Malformed webhook payload")

    event_type = event["type"]

    if event_type in ("customer.subscription.created", "customer.subscription.updated"):
        subscription = event["data"]["object"]
        price_id = subscription["items"]["data"][0]["price"]["id"]
        customer_id = subscription["customer"]
        plan = _price_to_plan(price_id)
        db.query(User).filter(User.stripe_customer_id == customer_id).update(
            {"plan": plan}
        )
        db.commit()

    elif event_type == "customer.subscription.deleted":
        customer_id = event["data"]["object"]["customer"]
        db.query(User).filter(User.stripe_customer_id == customer_id).update(
            {"plan": PlanTier.free}
        )
        db.commit()

    return {"ok": True}
