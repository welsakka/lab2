from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import List

from app.dependencies import require_plan
from app.models.user import PlanTier, User
from app.services.ai_service import stream_coach_response

router = APIRouter()


class ChatMessage(BaseModel):
    role: str
    content: str


class CoachRequest(BaseModel):
    messages: List[ChatMessage]


@router.post("/coach/stream")
async def coach_stream(
    req: CoachRequest,
    current_user: User = Depends(require_plan(PlanTier.essential, PlanTier.premium, PlanTier.family)),
):
    messages = [{"role": m.role, "content": m.content} for m in req.messages]
    return StreamingResponse(
        stream_coach_response(messages),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        },
    )
