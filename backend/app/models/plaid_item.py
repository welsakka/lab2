from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
import uuid

from app.database import Base


class PlaidItem(Base):
    __tablename__ = "plaid_items"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    access_token = Column(String, nullable=False)
    item_id = Column(String, nullable=False, unique=True)
    institution_name = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
