from fastapi import APIRouter
from app.schemas.planning import RetirementRequest, RetirementPlan
from app.services.planning_service import compute_retirement_plan

router = APIRouter()


@router.post("/retirement", response_model=RetirementPlan)
def retirement(req: RetirementRequest):
    return compute_retirement_plan(req)
