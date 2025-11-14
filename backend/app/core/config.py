from pydantic_settings import BaseSettings
from typing import Optional, List
from functools import lru_cache
import os


class Settings(BaseSettings):
    # Application
    APP_NAME: str = "Invoice OCR Platform"
    APP_VERSION: str = "1.0.0"
    API_V1_PREFIX: str = "/api/v1"
    DEBUG: bool = False

    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8004
    RELOAD: bool = False

    # Database
    DATABASE_URL: str = "postgresql+asyncpg://invoice_user:invoice_secure_pass_2024@localhost:5439/invoice_ocr_db"
    DB_ECHO: bool = False
    DB_POOL_SIZE: int = 20
    DB_MAX_OVERFLOW: int = 40

    # Redis
    REDIS_URL: str = "redis://:invoice_redis_pass_2024@localhost:6382/0"
    REDIS_CACHE_TTL: int = 3600  # 1 hour

    # Celery
    CELERY_BROKER_URL: str = "redis://:invoice_redis_pass_2024@localhost:6382/1"
    CELERY_RESULT_BACKEND: str = "redis://:invoice_redis_pass_2024@localhost:6382/2"

    # Security
    SECRET_KEY: str = "your-secret-key-change-in-production-min-32-chars-long"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    API_KEY_EXPIRE_DAYS: int = 365

    # Password hashing
    BCRYPT_ROUNDS: int = 12

    # CORS
    BACKEND_CORS_ORIGINS: List[str] = [
        "https://invoices.alexandratechlab.com",
        "https://invoices-api.alexandratechlab.com",
        "http://localhost:3000",
        "http://localhost:5173"
    ]

    # File Storage
    STORAGE_TYPE: str = "local"  # local, s3, spaces, minio
    STORAGE_PATH: str = "/root/invoice-ocr-platform/storage/invoices"
    MAX_UPLOAD_SIZE: int = 10 * 1024 * 1024  # 10MB
    ALLOWED_EXTENSIONS: List[str] = [".pdf", ".png", ".jpg", ".jpeg", ".tiff", ".heic"]

    # S3/Spaces Configuration (if using cloud storage)
    S3_BUCKET: Optional[str] = None
    S3_REGION: Optional[str] = None
    S3_ACCESS_KEY: Optional[str] = None
    S3_SECRET_KEY: Optional[str] = None
    S3_ENDPOINT: Optional[str] = None  # For DigitalOcean Spaces or MinIO

    # OCR Configuration
    OCR_ENGINE: str = "paddleocr"  # paddleocr, easyocr, hybrid
    OCR_LANGUAGES: List[str] = ["en"]
    OCR_CONFIDENCE_THRESHOLD: float = 0.70
    OCR_USE_GPU: bool = False
    OCR_MAX_WORKERS: int = 2

    # Image preprocessing
    IMAGE_MAX_SIZE: int = 2048  # Max width/height
    IMAGE_DPI: int = 300
    IMAGE_ENHANCE: bool = True

    # Email Configuration
    EMAIL_POLL_INTERVAL: int = 300  # 5 minutes
    EMAIL_BATCH_SIZE: int = 50
    EMAIL_MAX_RETRIES: int = 3

    # SMTP for sending notifications
    SMTP_HOST: Optional[str] = None
    SMTP_PORT: int = 587
    SMTP_USERNAME: Optional[str] = None
    SMTP_PASSWORD: Optional[str] = None
    SMTP_FROM_EMAIL: Optional[str] = None

    # WhatsApp Configuration
    WHATSAPP_ENABLED: bool = True
    WHATSAPP_API_URL: str = "http://localhost:3001"
    WHATSAPP_POLL_INTERVAL: int = 120  # 2 minutes

    # Accounting Integrations
    QUICKBOOKS_CLIENT_ID: Optional[str] = None
    QUICKBOOKS_CLIENT_SECRET: Optional[str] = None
    QUICKBOOKS_REDIRECT_URI: str = "https://invoices-api.alexandratechlab.com/api/v1/integrations/quickbooks/callback"
    QUICKBOOKS_ENVIRONMENT: str = "production"  # sandbox or production

    XERO_CLIENT_ID: Optional[str] = None
    XERO_CLIENT_SECRET: Optional[str] = None
    XERO_REDIRECT_URI: str = "https://invoices-api.alexandratechlab.com/api/v1/integrations/xero/callback"

    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = 60
    RATE_LIMIT_PER_HOUR: int = 1000
    API_KEY_RATE_LIMIT: int = 100  # per hour for API keys

    # Categories (Default expense categories)
    DEFAULT_CATEGORIES: List[str] = [
        "Office Supplies",
        "Travel & Transportation",
        "Meals & Entertainment",
        "Utilities",
        "Rent & Lease",
        "Professional Services",
        "Marketing & Advertising",
        "Software & Subscriptions",
        "Equipment & Machinery",
        "Insurance",
        "Taxes & Licenses",
        "Bank Fees",
        "Repairs & Maintenance",
        "Payroll",
        "Other Expenses"
    ]

    # Logging
    LOG_LEVEL: str = "INFO"
    LOG_FILE: str = "/root/invoice-ocr-platform/logs/app.log"

    # Monitoring
    SENTRY_DSN: Optional[str] = None
    ENABLE_METRICS: bool = True

    # Feature Flags
    ENABLE_ML_CATEGORIZATION: bool = True
    ENABLE_DUPLICATE_DETECTION: bool = True
    ENABLE_AUTO_APPROVAL: bool = False

    class Config:
        env_file = ".env"
        case_sensitive = True


@lru_cache()
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
