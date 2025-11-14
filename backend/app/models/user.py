from sqlalchemy import Column, String, Boolean, ForeignKey, Index
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.models.base import Base, UUIDMixin, TimestampMixin, SoftDeleteMixin


class User(Base, UUIDMixin, TimestampMixin, SoftDeleteMixin):
    """
    User model - Represents users of the platform.
    Can be admin (accounting firm staff) or client.
    """
    __tablename__ = "users"

    # Basic Information
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    phone = Column(String(50))

    # Role: admin, client, super_admin
    role = Column(String(50), nullable=False, default="client", index=True)

    # Organization relationship
    organization_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id"), nullable=False, index=True)

    # Client relationship (if user is a client)
    client_id = Column(UUID(as_uuid=True), ForeignKey("clients.id"), nullable=True, index=True)

    # Status
    is_active = Column(Boolean, default=True, nullable=False, index=True)
    is_verified = Column(Boolean, default=False, nullable=False)
    email_verified = Column(Boolean, default=False, nullable=False)

    # Last login
    last_login = Column(String(50))

    # Relationships
    organization = relationship("Organization", back_populates="users")
    client = relationship("Client", back_populates="users", foreign_keys=[client_id])
    api_keys = relationship("APIKey", back_populates="user", cascade="all, delete-orphan")
    audit_logs = relationship("AuditLog", back_populates="user")

    # Indexes
    __table_args__ = (
        Index("idx_users_org_role", "organization_id", "role"),
        Index("idx_users_client", "client_id"),
    )

    def __repr__(self):
        return f"<User(id={self.id}, email='{self.email}', role='{self.role}')>"

    @property
    def is_admin(self):
        return self.role in ["admin", "super_admin"]

    @property
    def is_client_user(self):
        return self.role == "client"
