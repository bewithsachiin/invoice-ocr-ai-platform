from sqlalchemy import Column, String, ForeignKey, JSON, Index
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.models.base import Base, UUIDMixin, TimestampMixin


class AuditLog(Base, UUIDMixin, TimestampMixin):
    """Audit log for tracking all changes."""
    __tablename__ = "audit_logs"

    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True, index=True)
    client_id = Column(UUID(as_uuid=True), ForeignKey("clients.id"), nullable=True, index=True)
    action = Column(String(100), nullable=False, index=True)  # invoice.created, invoice.reviewed, etc.
    entity_type = Column(String(50), nullable=False, index=True)
    entity_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    old_data = Column(JSON, default={})
    new_data = Column(JSON, default={})
    ip_address = Column(String(50))
    user_agent = Column(String(500))

    user = relationship("User", back_populates="audit_logs")

    __table_args__ = (
        Index("idx_audit_entity", "entity_type", "entity_id"),
        Index("idx_audit_user_action", "user_id", "action"),
    )
