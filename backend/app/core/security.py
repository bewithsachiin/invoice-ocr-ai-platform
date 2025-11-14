from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import HTTPException, Security, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
import secrets
import bcrypt

from app.core.config import settings

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Security scheme
security = HTTPBearer()


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against a hash."""
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """Generate password hash."""
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create JWT access token."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode.update({"exp": expire, "type": "access"})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt


def create_refresh_token(data: dict) -> str:
    """Create JWT refresh token."""
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire, "type": "refresh"})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt


def decode_token(token: str) -> Dict[str, Any]:
    """Decode and verify JWT token."""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except JWTError as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")


def generate_api_key() -> tuple[str, str]:
    """
    Generate a new API key.
    Returns tuple of (plain_key, hashed_key)
    """
    plain_key = f"inv_{''.join(secrets.token_urlsafe(32))}"
    hashed_key = bcrypt.hashpw(plain_key.encode(), bcrypt.gensalt()).decode()
    return plain_key, hashed_key


def verify_api_key(plain_key: str, hashed_key: str) -> bool:
    """Verify an API key against its hash."""
    try:
        return bcrypt.checkpw(plain_key.encode(), hashed_key.encode())
    except Exception:
        return False


def generate_encryption_key() -> str:
    """Generate encryption key for sensitive data (credentials, etc)."""
    from cryptography.fernet import Fernet
    return Fernet.generate_key().decode()


def encrypt_data(data: str, encryption_key: str) -> str:
    """Encrypt sensitive data."""
    from cryptography.fernet import Fernet
    import base64

    fernet = Fernet(encryption_key.encode())
    encrypted = fernet.encrypt(data.encode())
    return base64.b64encode(encrypted).decode()


def decrypt_data(encrypted_data: str, encryption_key: str) -> str:
    """Decrypt sensitive data."""
    from cryptography.fernet import Fernet
    import base64

    try:
        fernet = Fernet(encryption_key.encode())
        encrypted_bytes = base64.b64decode(encrypted_data)
        decrypted = fernet.decrypt(encrypted_bytes)
        return decrypted.decode()
    except Exception as e:
        raise ValueError(f"Decryption failed: {str(e)}")


class AuthChecker:
    """Dependency for checking authentication and permissions."""

    def __init__(self, required_role: Optional[str] = None, required_permission: Optional[str] = None):
        self.required_role = required_role
        self.required_permission = required_permission

    async def __call__(
        self,
        credentials: HTTPAuthorizationCredentials = Security(security)
    ) -> Dict[str, Any]:
        """Verify token and check permissions."""
        token = credentials.credentials

        try:
            payload = decode_token(token)

            # Check token type
            if payload.get("type") != "access":
                raise HTTPException(status_code=401, detail="Invalid token type")

            # Check expiration
            exp = payload.get("exp")
            if exp and datetime.fromtimestamp(exp) < datetime.utcnow():
                raise HTTPException(status_code=401, detail="Token expired")

            # Check role if required
            if self.required_role:
                user_role = payload.get("role")
                if user_role != self.required_role and user_role != "super_admin":
                    raise HTTPException(status_code=403, detail="Insufficient permissions")

            # Check permission if required
            if self.required_permission:
                permissions = payload.get("permissions", [])
                if self.required_permission not in permissions and payload.get("role") != "super_admin":
                    raise HTTPException(status_code=403, detail=f"Missing permission: {self.required_permission}")

            return payload

        except JWTError as e:
            raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")


# Convenience dependencies
get_current_user = AuthChecker()
require_admin = AuthChecker(required_role="admin")
require_client = AuthChecker(required_role="client")
