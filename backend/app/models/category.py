from sqlalchemy import Column, String, Boolean, ForeignKey, JSON, ARRAY, Index
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.models.base import Base, UUIDMixin, TimestampMixin


class Category(Base, UUIDMixin, TimestampMixin):
    """Category model for expense/income categorization."""
    __tablename__ = "categories"

    organization_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id"), nullable=False, index=True)
    name = Column(String(100), nullable=False, index=True)
    type = Column(String(50), nullable=False)  # expense, income
    parent_id = Column(UUID(as_uuid=True), ForeignKey("categories.id"), nullable=True)
    account_code = Column(String(50))
    tax_treatment = Column(String(50))
    keywords = Column(ARRAY(String), default=[])
    ml_training_data = Column(JSON, default={})
    is_active = Column(Boolean, default=True, nullable=False)

    organization = relationship("Organization", back_populates="categories")
    parent = relationship("Category", remote_side=[id], foreign_keys=[parent_id])

    __table_args__ = (Index("idx_categories_org_type", "organization_id", "type"),)
