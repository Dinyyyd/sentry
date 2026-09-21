from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta, timezone
from typing import Optional
from argon2 import PasswordHasher
from jwt import encode, decode, PyJWTError
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Password hashing
ph = PasswordHasher()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Secret key for tokens (use a real secret in production!)
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))

def hash_password(password: str) -> str:
    """Hash a password. Store this, never the original."""
    return ph.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Check if password matches the hash."""
    try:
        ph.verify(hashed_password, plain_password)
        return True
    except:
        return False

  # ========== JWT Token Functions ============

def create_access_token(email: str) -> str:
    """Create a JWT token for a user."""
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    return encode({"sub": email, "exp": expire}, SECRET_KEY, algorithm=ALGORITHM)

def decode_access_token(token: str) -> Optional[str]:
    """Decode a JWT token and return the email."""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        return email
    except JWTError:
        return None