"""Initial schema: users, holdings, zakat_records

Revision ID: 0001_initial
Revises:
Create Date: 2026-05-05
"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision = "0001_initial"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "users",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("email", sa.String(), nullable=False, unique=True, index=True),
        sa.Column("name", sa.String(), nullable=False),
        sa.Column("hashed_password", sa.String(), nullable=False),
        sa.Column(
            "plan",
            sa.Enum("free", "essential", "premium", "family", name="plantier"),
            nullable=False,
            server_default="free",
        ),
        sa.Column("stripe_customer_id", sa.String(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), onupdate=sa.func.now()),
    )

    op.create_table(
        "holdings",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id"), nullable=False, index=True),
        sa.Column("ticker", sa.String(10), nullable=False),
        sa.Column("shares", sa.Float(), nullable=False),
        sa.Column("avg_cost", sa.Float(), nullable=True),
        sa.Column(
            "status",
            sa.Enum("halal", "borderline", "monitor", "not-halal", "unknown", name="halalstatus"),
            nullable=False,
            server_default="unknown",
        ),
        sa.Column("purification_per_share", sa.Float(), server_default="0"),
        sa.Column("last_screened_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("plaid_item_id", postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), onupdate=sa.func.now()),
    )

    op.create_table(
        "zakat_records",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id"), nullable=False, index=True),
        sa.Column("hijri_year", sa.Integer(), nullable=True),
        sa.Column("cash", sa.Float(), server_default="0"),
        sa.Column("stocks", sa.Float(), server_default="0"),
        sa.Column("gold", sa.Float(), server_default="0"),
        sa.Column("silver", sa.Float(), server_default="0"),
        sa.Column("business_equity", sa.Float(), server_default="0"),
        sa.Column("receivables", sa.Float(), server_default="0"),
        sa.Column("total_zakatable", sa.Float(), nullable=False),
        sa.Column("nisab_threshold", sa.Float(), nullable=False),
        sa.Column("gold_price_per_oz", sa.Float(), nullable=False),
        sa.Column("above_nisab", sa.Boolean(), nullable=False),
        sa.Column("zakat_due", sa.Float(), nullable=False),
        sa.Column("calculated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )

    op.create_table(
        "plaid_items",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id"), nullable=False, index=True),
        sa.Column("access_token", sa.String(), nullable=False),
        sa.Column("item_id", sa.String(), nullable=False, unique=True),
        sa.Column("institution_name", sa.String(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )

    op.create_foreign_key(
        "fk_holdings_plaid_item",
        "holdings", "plaid_items",
        ["plaid_item_id"], ["id"],
        ondelete="SET NULL",
    )


def downgrade() -> None:
    op.drop_constraint("fk_holdings_plaid_item", "holdings", type_="foreignkey")
    op.drop_table("plaid_items")
    op.drop_table("zakat_records")
    op.drop_table("holdings")
    op.drop_table("users")
    op.execute("DROP TYPE IF EXISTS plantier")
    op.execute("DROP TYPE IF EXISTS halalstatus")
