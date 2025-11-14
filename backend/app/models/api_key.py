from sqlalchemy import Column, String, Boolean, ForeignKey, ARRAY, Integer, Index
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.models.base import Base, UUIDMixin, TimestampMixin


class APIKey(Base, UUIDMixin, TimestampMixin):
    """API Key model for third-party integrations."""
    __tablename__ = "api_keys"

    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    organization_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id"), nullable=False, index=True)
    client_id = Column(UUID(as_uuid=True), ForeignKey("clients.id"), nullable=True, index=True)

    key_hash = Column(String(255), nullable=False, unique=True, index=True)
    key_prefix = Column(String(20), nullable=False, index=True)
    name = Column(String(255), nullable=False)
    scopes = Column(ARRAY(String), default=[])
    rate_limit = Column(Integer, default=100)
    is_active = Column(Boolean, default=True, nullable=False, index=True)
    expires_at = Column(String(50))
    last_used_at = Column(String(50))

    user = relationship("User", back_populates="api_keys")

    __table_args__ = (Index("idx_api_keys_prefix_active", "key_prefix", "is_active"),)
