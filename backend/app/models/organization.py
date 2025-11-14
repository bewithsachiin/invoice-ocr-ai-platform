from sqlalchemy import Column, String, Boolean, JSON
from sqlalchemy.orm import relationship
from app.models.base import Base, UUIDMixin, TimestampMixin, SoftDeleteMixin


class Organization(Base, UUIDMixin, TimestampMixin, SoftDeleteMixin):
    """
    Organization model - Multi-tenant master table.
    Represents accounting firms using the platform.
    """
    __tablename__ = "organizations"

    name = Column(String(255), nullable=False)
    slug = Column(String(100), unique=True, nullable=False, index=True)

    # Subscription and billing
    subscription_tier = Column(String(50), default="basic")  # basic, professional, enterprise
    max_clients = Column(String(50), default="unlimited")
    max_invoices_per_month = Column(String(50), default="unlimited")

    # Contact information
    email = Column(String(255))
    phone = Column(String(50))
    address = Column(String(500))

    # Settings as JSON
    settings = Column(JSON, default={})
    # Example settings:
    # {
    #   "default_currency": "USD",
    #   "default_language": "en",
    #   "ocr_confidence_threshold": 0.70,
    #   "auto_categorize": true,
    #   "require_review": true,
    #   "email_notifications": true
    # }

    # Encryption key for this organization (for storing sensitive data)
    encryption_key = Column(String(255), nullable=False)

    # Status
    is_active = Column(Boolean, default=True, nullable=False, index=True)

    # Relationships
    users = relationship("User", back_populates="organization", cascade="all, delete-orphan")
    clients = relationship("Client", back_populates="organization", cascade="all, delete-orphan")
    categories = relationship("Category", back_populates="organization", cascade="all, delete-orphan")
    invoices = relationship("Invoice", back_populates="organization", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Organization(id={self.id}, name='{self.name}', slug='{self.slug}')>"
