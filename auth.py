from datetime import datetime, timedelta, timezone
from typing import Optional
import os

from argon2 import PasswordHasher
from jwt import decode, encode
from jwt.exceptions import PyJWTError

password_hasher = PasswordHasher()
SECRET_KEY = os.getenv("SECRET_KEY", "change-this-secret-key")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))


def hash_password(password: str) -> str:
    """Hash a password for storage."""
    return password_hasher.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Check a plain password against its stored hash."""
    try:
        password_hasher.verify(hashed_password, plain_password)
        return True
    except Exception:
        return False


def create_access_token(email: str) -> str:
    """Create a JWT token for a user email."""
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    return encode({"sub": email, "exp": expires_at}, SECRET_KEY, algorithm=ALGORITHM)


def decode_access_token(token: str) -> Optional[str]:
    """Decode a JWT token and return its email subject."""
    try:
        payload = decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload.get("sub")
    except PyJWTError:
        return None
