from sqlalchemy import Column, String, Boolean, ForeignKey, JSON, Index
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.models.base import Base, UUIDMixin, TimestampMixin


class IntegrationConfig(Base, UUIDMixin, TimestampMixin):
    """Integration configuration for accounting systems and custom APIs."""
    __tablename__ = "integration_configs"

    client_id = Column(UUID(as_uuid=True), ForeignKey("clients.id"), nullable=False, index=True)
    integration_type = Column(String(50), nullable=False)  # quickbooks, xero, custom, etc.
    name = Column(String(255), nullable=False)
    config_data = Column(JSON, default={})  # Encrypted credentials and settings
    is_active = Column(Boolean, default=True, nullable=False)
    last_sync = Column(String(50))
    sync_status = Column(String(50))
    sync_error = Column(String(500))

    client = relationship("Client", back_populates="integration_configs")

    __table_args__ = (Index("idx_integration_client_type", "client_id", "integration_type"),)
