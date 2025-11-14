from sqlalchemy import Column, String, Boolean, ForeignKey, JSON, ARRAY, Float, Integer, Date, Text, Index
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.models.base import Base, UUIDMixin, TimestampMixin, SoftDeleteMixin


class Invoice(Base, UUIDMixin, TimestampMixin, SoftDeleteMixin):
    """
    Invoice model - Core invoice storage with OCR data and categorization.
    """
    __tablename__ = "invoices"

    # Relationships
    client_id = Column(UUID(as_uuid=True), ForeignKey("clients.id"), nullable=False, index=True)
    organization_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id"), nullable=False, index=True)
    category_id = Column(UUID(as_uuid=True), ForeignKey("categories.id"), nullable=True, index=True)

    # Invoice Identification
    invoice_number = Column(String(100), index=True)
    invoice_date = Column(Date, index=True)
    due_date = Column(Date)
    po_number = Column(String(100))  # Purchase Order number

    # Vendor/Supplier Information
    vendor_name = Column(String(255), index=True)
    vendor_tax_id = Column(String(100))
    vendor_address = Column(Text)
    vendor_phone = Column(String(50))
    vendor_email = Column(String(255))
    vendor_website = Column(String(255))

    # Financial Details
    subtotal = Column(Float)
    tax_amount = Column(Float)
    discount_amount = Column(Float, default=0.0)
    shipping_amount = Column(Float, default=0.0)
    total_amount = Column(Float, nullable=False, index=True)
    currency = Column(String(3), default="USD")

    # Categorization
    category = Column(String(100), index=True)  # Main category
    subcategory = Column(String(100))
    is_expense = Column(Boolean, default=True, nullable=False)  # true for expenses, false for income
    account_code = Column(String(50))  # Chart of accounts code

    # Processing Metadata
    source = Column(String(50), nullable=False, index=True)  # email, whatsapp, upload, api, camera
    source_reference = Column(String(255))  # Email ID, WhatsApp message ID, etc.
    source_sender = Column(String(255))  # Email address or phone number of sender

    # OCR Data
    ocr_confidence = Column(Float, index=True)
    ocr_engine_used = Column(String(50))  # paddleocr, easyocr, hybrid
    ocr_raw_text = Column(Text)
    ocr_structured_data = Column(JSON, default={})
    # Stores all extracted fields with confidence scores:
    # {
    #   "invoice_number": {"value": "INV-001", "confidence": 0.95},
    #   "date": {"value": "2024-01-15", "confidence": 0.92},
    #   ...
    # }

    needs_review = Column(Boolean, default=False, nullable=False, index=True)
    review_reason = Column(String(255))  # Low confidence, missing fields, etc.

    # File Storage
    original_file_path = Column(String(500))
    original_file_name = Column(String(255))
    file_type = Column(String(50))  # pdf, image/png, etc.
    file_size = Column(Integer)  # in bytes
    storage_url = Column(String(500))  # S3/cloud storage URL
    thumbnail_url = Column(String(500))  # Thumbnail preview

    # Status and Workflow
    status = Column(String(50), default="pending", nullable=False, index=True)
    # Statuses: pending, processing, reviewed, approved, exported, rejected, archived

    reviewed_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    reviewed_at = Column(String(50))
    approved_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    approved_at = Column(String(50))

    # Accounting Integration
    accounting_system = Column(String(50))  # quickbooks, xero, sage, custom
    accounting_id = Column(String(255))  # ID in external accounting system
    accounting_synced = Column(Boolean, default=False, nullable=False)
    exported_at = Column(String(50))
    export_error = Column(Text)

    # Duplicate Detection
    duplicate_of = Column(UUID(as_uuid=True), ForeignKey("invoices.id"), nullable=True)
    is_duplicate = Column(Boolean, default=False, nullable=False, index=True)
    duplicate_confidence = Column(Float)

    # Additional Data
    notes = Column(Text)
    tags = Column(ARRAY(String), default=[])
    custom_fields = Column(JSON, default={})
    payment_status = Column(String(50), default="unpaid")  # unpaid, partial, paid
    payment_date = Column(Date)

    # Relationships
    organization = relationship("Organization", back_populates="invoices")
    client = relationship("Client", back_populates="invoices")
    category_rel = relationship("Category", foreign_keys=[category_id])
    line_items = relationship("InvoiceLineItem", back_populates="invoice", cascade="all, delete-orphan")
    reviewer = relationship("User", foreign_keys=[reviewed_by])
    approver = relationship("User", foreign_keys=[approved_by])
    duplicate_parent = relationship("Invoice", remote_side=[id], foreign_keys=[duplicate_of])

    # Indexes for common queries
    __table_args__ = (
        Index("idx_invoices_client_date", "client_id", "invoice_date"),
        Index("idx_invoices_org_status", "organization_id", "status"),
        Index("idx_invoices_vendor", "vendor_name"),
        Index("idx_invoices_category", "category"),
        Index("idx_invoices_source", "source"),
        Index("idx_invoices_needs_review", "needs_review"),
        Index("idx_invoice_number", "invoice_number"),
        # Full-text search index (PostgreSQL specific)
        Index(
            "idx_invoices_search",
            "vendor_name",
            "invoice_number",
            "notes",
            postgresql_using="gin",
            postgresql_ops={
                "vendor_name": "gin_trgm_ops",
                "invoice_number": "gin_trgm_ops",
                "notes": "gin_trgm_ops"
            }
        ),
    )

    def __repr__(self):
        return f"<Invoice(id={self.id}, invoice_number='{self.invoice_number}', total={self.total_amount})>"


class InvoiceLineItem(Base, UUIDMixin, TimestampMixin):
    """
    Invoice line items - Individual items/services on an invoice.
    """
    __tablename__ = "invoice_line_items"

    # Invoice relationship
    invoice_id = Column(UUID(as_uuid=True), ForeignKey("invoices.id"), nullable=False, index=True)

    # Line item details
    line_number = Column(Integer, nullable=False)
    description = Column(Text, nullable=False)
    quantity = Column(Float, default=1.0)
    unit = Column(String(50))  # pcs, hours, kg, etc.
    unit_price = Column(Float, nullable=False)
    total_price = Column(Float, nullable=False)
    tax_rate = Column(Float, default=0.0)
    tax_amount = Column(Float, default=0.0)

    # Categorization per line item
    category = Column(String(100))
    account_code = Column(String(50))

    # OCR confidence for this line item
    ocr_confidence = Column(Float)

    # Relationship
    invoice = relationship("Invoice", back_populates="line_items")

    __table_args__ = (
        Index("idx_line_items_invoice", "invoice_id"),
    )

    def __repr__(self):
        return f"<InvoiceLineItem(id={self.id}, description='{self.description}', total={self.total_price})>"
