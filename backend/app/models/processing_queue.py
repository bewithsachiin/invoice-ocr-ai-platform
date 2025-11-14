from sqlalchemy import Column, String, Integer, ForeignKey, JSON, Text, Index
from sqlalchemy.dialects.postgresql import UUID
from app.models.base import Base, UUIDMixin, TimestampMixin


class ProcessingQueue(Base, UUIDMixin, TimestampMixin):
    """Background processing queue for OCR and other async tasks."""
    __tablename__ = "processing_queue"

    client_id = Column(UUID(as_uuid=True), ForeignKey("clients.id"), nullable=False, index=True)
    task_type = Column(String(50), nullable=False, index=True)  # ocr, categorize, export, email_check
    file_path = Column(String(500))
    source = Column(String(50))
    source_reference = Column(String(255))
    status = Column(String(50), default="pending", nullable=False, index=True)  # pending, processing, completed, failed
    priority = Column(Integer, default=5, nullable=False)
    attempts = Column(Integer, default=0, nullable=False)
    error_message = Column(Text)
    result = Column(JSON, default={})
    started_at = Column(String(50))
    completed_at = Column(String(50))

    __table_args__ = (
        Index("idx_queue_status_priority", "status", "priority", "created_at"),
        Index("idx_queue_client_status", "client_id", "status"),
    )
