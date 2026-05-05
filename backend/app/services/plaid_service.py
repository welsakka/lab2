"""
Plaid integration service — Investment account sync.

Uses Plaid Investments product (/investments/holdings/get) to fetch
brokerage holdings and upsert them into the local holdings table.
After upsert, newly-added tickers are screened via screening_service.

NOTE: The sync runs synchronously in-request. For a user with many holdings
this can take several seconds due to yfinance network calls. Post-MVP upgrade
path: move screening to FastAPI BackgroundTasks or a Celery worker.

Plaid environments:
  sandbox   → plaid.Environment.Sandbox
  development → plaid.Environment.Development
  production  → plaid.Environment.Production
"""

import uuid
from datetime import datetime, timezone, timedelta
from typing import Optional
from uuid import UUID

import plaid
from plaid.api import plaid_api
from plaid.model.item_public_token_exchange_request import ItemPublicTokenExchangeRequest
from plaid.model.investments_holdings_get_request import InvestmentsHoldingsGetRequest
from plaid.model.link_token_create_request import LinkTokenCreateRequest
from plaid.model.link_token_create_request_user import LinkTokenCreateRequestUser
from plaid.model.products import Products
from plaid.model.country_code import CountryCode
from sqlalchemy.orm import Session

from app.config import settings
from app.models.plaid_item import PlaidItem
from app.models.portfolio import Holding, HalalStatus
from app.services.screening_service import screen_ticker

SCREENING_TTL = timedelta(hours=24)

_ENV_MAP = {
    "sandbox": plaid.Environment.Sandbox,
    "development": plaid.Environment.Development,
    "production": plaid.Environment.Production,
}


def _get_plaid_client() -> plaid_api.PlaidApi:
    env = _ENV_MAP.get(settings.plaid_env, plaid.Environment.Sandbox)
    configuration = plaid.Configuration(
        host=env,
        api_key={
            "clientId": settings.plaid_client_id,
            "secret": settings.plaid_secret,
        },
    )
    return plaid_api.PlaidApi(plaid.ApiClient(configuration))


def create_link_token(user_id: str) -> str:
    client = _get_plaid_client()
    req = LinkTokenCreateRequest(
        products=[Products("investments")],
        client_name="Halal Finance OS",
        country_codes=[CountryCode("US")],
        language="en",
        user=LinkTokenCreateRequestUser(client_user_id=user_id),
    )
    response = client.link_token_create(req)
    return response["link_token"]


def exchange_public_token(public_token: str) -> tuple[str, str]:
    """Returns (access_token, item_id)."""
    client = _get_plaid_client()
    req = ItemPublicTokenExchangeRequest(public_token=public_token)
    response = client.item_public_token_exchange(req)
    return response["access_token"], response["item_id"]


def sync_holdings(user_id: UUID, db: Session) -> list[Holding]:
    """
    Fetch all holdings from every connected Plaid item for this user.
    Upserts into the holdings table. Screens newly-added tickers.
    Returns the updated list of holdings.
    """
    items = db.query(PlaidItem).filter(PlaidItem.user_id == user_id).all()
    if not items:
        return []

    client = _get_plaid_client()
    now = datetime.now(timezone.utc)

    for item in items:
        try:
            req = InvestmentsHoldingsGetRequest(access_token=item.access_token)
            resp = client.investments_holdings_get(req)
        except Exception:
            # If one item fails (e.g., token expired), skip it and continue
            continue

        # Build a lookup of security_id → ticker_symbol
        securities = {s["security_id"]: s for s in resp["securities"]}

        for ph in resp["holdings"]:
            sec = securities.get(ph["security_id"], {})
            ticker = sec.get("ticker_symbol")
            if not ticker:
                continue  # Skip mutual funds and other non-ticker securities

            ticker = ticker.upper()
            shares = float(ph.get("quantity", 0))
            cost_basis = ph.get("cost_basis")
            avg_cost = float(cost_basis) / shares if cost_basis and shares else None

            # Upsert: match on user_id + ticker + plaid_item_id
            existing = (
                db.query(Holding)
                .filter(
                    Holding.user_id == user_id,
                    Holding.ticker == ticker,
                    Holding.plaid_item_id == item.id,
                )
                .first()
            )

            if existing:
                existing.shares = shares
                existing.avg_cost = avg_cost
                existing.updated_at = now
            else:
                existing = Holding(
                    user_id=user_id,
                    ticker=ticker,
                    shares=shares,
                    avg_cost=avg_cost,
                    plaid_item_id=item.id,
                )
                db.add(existing)

            db.flush()

            # Screen if never screened or stale
            needs_screen = (
                existing.last_screened_at is None
                or now - existing.last_screened_at.replace(tzinfo=timezone.utc) > SCREENING_TTL
            )
            if needs_screen:
                result = screen_ticker(ticker)
                if result:
                    existing.status = HalalStatus(result.status)
                    existing.purification_per_share = result.purification_amount or 0.0
                    existing.last_screened_at = now

    db.commit()
    return db.query(Holding).filter(Holding.user_id == user_id).all()
