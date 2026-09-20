from datetime import datetime, timedelta, timezone
from typing import Any, Dict, Optional
from jose import jwt
from app.core.config import settings

def create_access_token(
    subject: str,
    department: str,
    clearance: int,
    expires_delta: Optional[timedelta] = None
) -> str:
    """Generates a signed JWT containing user context for Zero Trust verification."""
    now = datetime.now(timezone.utc)
    if expires_delta:
        expire = now + expires_delta
    else:
        expire = now + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode: Dict[str, Any] = {
        "sub": subject,
        "department": department.lower(),
        "clearance": int(clearance),
        "iat": int(now.timestamp()),
        "exp": int(expire.timestamp())
    }
    
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt