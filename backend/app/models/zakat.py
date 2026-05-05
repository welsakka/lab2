from sqlalchemy import Column, Float, DateTime, ForeignKey, Boolean, Integer
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
import uuid

from app.database import Base


class ZakatRecord(Base):
    __tablename__ = "zakat_records"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    hijri_year = Column(Integer, nullable=True)
    cash = Column(Float, default=0.0)
    stocks = Column(Float, default=0.0)
    gold = Column(Float, default=0.0)
    silver = Column(Float, default=0.0)
    business_equity = Column(Float, default=0.0)
    receivables = Column(Float, default=0.0)
    total_zakatable = Column(Float, nullable=False)
    nisab_threshold = Column(Float, nullable=False)
    gold_price_per_oz = Column(Float, nullable=False)
    above_nisab = Column(Boolean, nullable=False)
    zakat_due = Column(Float, nullable=False)
    calculated_at = Column(DateTime(timezone=True), server_default=func.now())
