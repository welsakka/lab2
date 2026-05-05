from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.config import settings
from app.routers import auth, screening, portfolio, zakat, banking, planning, ai_agents


@asynccontextmanager
async def lifespan(app: FastAPI):
    yield


app = FastAPI(
    title="Halal Finance OS API",
    description="Backend API for the Halal Finance OS platform.",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(screening.router, prefix="/api/v1/screening", tags=["screening"])
app.include_router(portfolio.router, prefix="/api/v1/portfolio", tags=["portfolio"])
app.include_router(zakat.router, prefix="/api/v1/zakat", tags=["zakat"])
app.include_router(banking.router, prefix="/api/v1/banking", tags=["banking"])
app.include_router(planning.router, prefix="/api/v1/planning", tags=["planning"])
app.include_router(ai_agents.router, prefix="/api/v1/ai", tags=["ai"])


@app.get("/health")
async def health():
    return {"status": "ok", "version": "0.1.0"}
