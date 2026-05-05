from fastapi import APIRouter, HTTPException
from app.schemas.screening import ScreenResult, BatchScreenRequest
from app.services.screening_service import screen_ticker

router = APIRouter()


@router.get("/{ticker}", response_model=ScreenResult)
def screen_single(ticker: str):
    result = screen_ticker(ticker)
    if not result:
        raise HTTPException(status_code=404, detail=f"No data found for ticker '{ticker}'")
    return result


@router.post("/batch", response_model=list[ScreenResult])
def screen_batch(req: BatchScreenRequest):
    if len(req.tickers) > 25:
        raise HTTPException(status_code=400, detail="Maximum 25 tickers per batch request")
    results = []
    for ticker in req.tickers:
        result = screen_ticker(ticker)
        if result:
            results.append(result)
    return results
