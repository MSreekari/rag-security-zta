from fastapi import HTTPException, Security, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from app.core.config import settings
from app.models.token_models import UserContext

security_scheme = HTTPBearer(auto_error=False)

def verify_token_pep(
    credentials: HTTPAuthorizationCredentials = Security(security_scheme)
) -> UserContext:
    """
    Zero Trust PEP:
    - Never trusts caller assumptions.
    - Validates cryptographic JWT signature, expiration, and payload integrity.
    - Rejects missing, tampered, or expired tokens immediately with 401.
    """
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Zero Trust PEP: Missing Bearer authorization token.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = credentials.credentials

    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )
        
        user_id: str = payload.get("sub")
        department: str = payload.get("department")
        clearance: int = payload.get("clearance")

        if not user_id or department is None or clearance is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Zero Trust PEP: Malformed identity claims in token.",
            )

        return UserContext(
            user_id=user_id,
            department=str(department).lower(),
            clearance=int(clearance)
        )

    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Zero Trust PEP: Cryptographic signature validation failed or token expired.",
            headers={"WWW-Authenticate": "Bearer"},
        )