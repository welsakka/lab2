from fastapi import APIRouter
from app.schemas.zakat import ZakatAssetsInput, ZakatReport
from app.services.zakat_service import calculate_zakat, get_gold_price_usd

router = APIRouter()


@router.post("/calculate", response_model=ZakatReport)
async def calculate(assets: ZakatAssetsInput):
    return await calculate_zakat(assets)


@router.get("/gold-price")
async def gold_price():
    price = await get_gold_price_usd()
    return {"price_usd_per_oz": price, "nisab_usd": price * 3.0}
