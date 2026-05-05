from datetime import datetime, timezone
from typing import Optional

import redis as redis_lib
from fastapi import Cookie, Depends, Header, HTTPException, Request, status
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.models.user import PlanTier, User

ALGORITHM = "HS256"

_redis: Optional[redis_lib.Redis] = None


def _get_redis() -> redis_lib.Redis:
    global _redis
    if _redis is None:
        _redis = redis_lib.from_url(settings.redis_url, decode_responses=True)
    return _redis


def _decode_token(token: str) -> str:
    """Decode JWT and return user_id (sub claim). Raises 401 on any failure."""
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
        return user_id
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token")


def _get_user_by_id(user_id: str, db: Session) -> User:
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user


def get_current_user(
    access_token: Optional[str] = Cookie(None, alias="access_token"),
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db),
) -> User:
    """Reads JWT from httpOnly cookie first, then Authorization: Bearer header."""
    token = access_token
    if not token and authorization and authorization.startswith("Bearer "):
        token = authorization[7:]
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    user_id = _decode_token(token)
    return _get_user_by_id(user_id, db)


def get_optional_user(
    access_token: Optional[str] = Cookie(None, alias="access_token"),
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db),
) -> Optional[User]:
    """Same as get_current_user but returns None instead of raising 401."""
    token = access_token
    if not token and authorization and authorization.startswith("Bearer "):
        token = authorization[7:]
    if not token:
        return None
    try:
        user_id = _decode_token(token)
        return _get_user_by_id(user_id, db)
    except HTTPException:
        return None


def check_screening_limit(
    request: Request,
    user: Optional[User] = Depends(get_optional_user),
) -> Optional[User]:
    """
    Rate-limit stock screening calls.
    - Unauthenticated: 10/month per IP
    - Free plan: 10/month per user
    - Paid plan: unlimited
    """
    if user and user.plan != PlanTier.free:
        return user

    r = _get_redis()
    now = datetime.now(timezone.utc)
    # Key resets at the start of each calendar month
    window = f"{now.year}-{now.month:02d}"

    if user:
        key = f"screen:user:{user.id}:{window}"
    else:
        client_ip = request.client.host if request.client else "unknown"
        key = f"screen:ip:{client_ip}:{window}"

    count = r.incr(key)
    if count == 1:
        # Set TTL to expire ~35 days after first use (covers full month + buffer)
        r.expire(key, 60 * 60 * 24 * 35)

    if count > 10:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail={
                "code": "SCREENING_LIMIT_REACHED",
                "message": "Free plan allows 10 screens per month. Upgrade to Essential for unlimited screening.",
                "used": count,
                "limit": 10,
            },
        )

    return user


def require_plan(*allowed_plans: PlanTier):
    """
    Returns a FastAPI dependency that enforces plan gating.
    Usage: current_user: User = Depends(require_plan(PlanTier.essential, PlanTier.premium))
    """
    def dependency(current_user: User = Depends(get_current_user)) -> User:
        if current_user.plan not in allowed_plans:
            raise HTTPException(
                status_code=402,
                detail={
                    "code": "PLAN_REQUIRED",
                    "message": f"This feature requires a paid plan.",
                    "required_plans": [p.value for p in allowed_plans],
                    "current_plan": current_user.plan.value,
                },
            )
        return current_user
    return dependency
