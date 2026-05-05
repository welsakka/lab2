from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    database_url: str = "postgresql://halal:halal@localhost:5432/halal_finance"
    redis_url: str = "redis://localhost:6379"
    secret_key: str = "change-me-in-production"
    anthropic_api_key: str = ""
    plaid_client_id: str = ""
    plaid_secret: str = ""
    plaid_env: str = "sandbox"
    stripe_secret_key: str = ""
    stripe_webhook_secret: str = ""
    gold_api_key: str = ""
    cors_origins: List[str] = ["http://localhost:3000"]

    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings()
