from fastapi import APIRouter, Depends

from app.dependencies import require_plan
from app.models.user import PlanTier, User
from app.schemas.planning import RetirementRequest, RetirementPlan
from app.services.planning_service import compute_retirement_plan

router = APIRouter()


@router.post("/retirement", response_model=RetirementPlan)
def retirement(
    req: RetirementRequest,
    current_user: User = Depends(
        require_plan(PlanTier.essential, PlanTier.premium, PlanTier.family)
    ),
):
    return compute_retirement_plan(req)
