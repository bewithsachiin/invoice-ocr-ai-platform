from sqlalchemy import Column, String, Boolean, ForeignKey, JSON, ARRAY, Float, Index
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.models.base import Base, UUIDMixin, TimestampMixin, SoftDeleteMixin


class Client(Base, UUIDMixin, TimestampMixin, SoftDeleteMixin):
    """
    Client model - Represents clients of the accounting firm.
    Each client can have their own configuration for email, WhatsApp, and accounting integrations.
    """
    __tablename__ = "clients"

    # Basic Information
    name = Column(String(255), nullable=False, index=True)
    company_name = Column(String(255))
    email = Column(String(255), index=True)
    phone = Column(String(50))
    tax_id = Column(String(100))
    address = Column(String(500))

    # Organization relationship
    organization_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id"), nullable=False, index=True)

    # Email Monitoring Configuration
    email_enabled = Column(Boolean, default=False, nullable=False)
    email_provider = Column(String(50))  # imap, gmail, outlook, exchange
    email_config = Column(JSON, default={})
    # Encrypted email credentials stored here:
    # {
    #   "encrypted_credentials": "...",
    #   "host": "imap.gmail.com",
    #   "port": 993,
    #   "ssl": true,
    #   "folders": ["INBOX", "Invoices"]
    # }
    monitored_email_addresses = Column(ARRAY(String), default=[])
    email_last_check = Column(String(50))
    email_check_frequency = Column(Float, default=5.0)  # minutes

    # WhatsApp Monitoring Configuration
    whatsapp_enabled = Column(Boolean, default=False, nullable=False)
    whatsapp_session_id = Column(String(100))  # WAHA session ID
    monitored_phone_numbers = Column(ARRAY(String), default=[])
    whatsapp_last_check = Column(String(50))
    whatsapp_check_frequency = Column(Float, default=2.0)  # minutes

    # Client-specific OCR Settings
    auto_categorize = Column(Boolean, default=True, nullable=False)
    auto_create_entries = Column(Boolean, default=False, nullable=False)
    ocr_language = Column(String(10), default="eng")
    ocr_confidence_threshold = Column(Float, default=0.70)
    require_manual_review = Column(Boolean, default=True, nullable=False)

    # Accounting System Configuration
    accounting_system = Column(String(50))  # quickbooks, xero, sage, custom, none
    accounting_config = Column(JSON, default={})
    # For custom integrations, stores encrypted API keys and endpoints:
    # {
    #   "api_url": "https://api.example.com",
    #   "auth_type": "bearer|api_key|oauth2",
    #   "encrypted_credentials": "...",
    #   "sync_frequency": 60,  # minutes
    #   "field_mappings": {...}
    # }
    accounting_last_sync = Column(String(50))

    # Additional Settings
    default_currency = Column(String(3), default="USD")
    timezone = Column(String(50), default="UTC")
    custom_fields = Column(JSON, default={})

    # Status
    is_active = Column(Boolean, default=True, nullable=False, index=True)

    # Relationships
    organization = relationship("Organization", back_populates="clients")
    users = relationship("User", back_populates="client", foreign_keys="User.client_id")
    invoices = relationship("Invoice", back_populates="client", cascade="all, delete-orphan")
    integration_configs = relationship("IntegrationConfig", back_populates="client", cascade="all, delete-orphan")

    # Indexes
    __table_args__ = (
        Index("idx_clients_org_active", "organization_id", "is_active"),
        Index("idx_clients_email", "email"),
    )

    def __repr__(self):
        return f"<Client(id={self.id}, name='{self.name}', organization_id='{self.organization_id}')>"
