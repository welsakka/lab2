"""
Zakat calculation service.

Nisab = 3 troy oz of gold (Hanafi: 7.5 tola silver or 3 oz gold; we use gold standard).
Zakat rate = 2.5% on net zakatable wealth held for one full lunar year (hawl).
"""

from datetime import datetime
import httpx

from app.schemas.zakat import ZakatAssetsInput, ZakatReport

NISAB_GOLD_OZ = 3.0
ZAKAT_RATE = 0.025
FALLBACK_GOLD_PRICE = 2340.0


async def get_gold_price_usd() -> float:
    """Fetch live gold price (USD/troy oz). Falls back to hardcoded price."""
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            r = await client.get("https://api.metals.live/v1/spot/gold")
            if r.status_code == 200:
                data = r.json()
                return float(data.get("price", FALLBACK_GOLD_PRICE))
    except Exception:
        pass
    return FALLBACK_GOLD_PRICE


async def calculate_zakat(assets: ZakatAssetsInput) -> ZakatReport:
    gold_price = await get_gold_price_usd()
    nisab = NISAB_GOLD_OZ * gold_price

    total = (
        assets.cash
        + assets.stocks
        + assets.gold
        + assets.silver
        + assets.business_equity
        + assets.receivables
    )

    above_nisab = total >= nisab
    zakat_due = total * ZAKAT_RATE if above_nisab else 0.0

    return ZakatReport(
        total_zakatable=round(total, 2),
        nisab_threshold=round(nisab, 2),
        gold_price_per_oz=gold_price,
        above_nisab=above_nisab,
        zakat_due=round(zakat_due, 2),
        breakdown=assets,
        calculated_at=datetime.utcnow().isoformat(),
    )
