from fastapi import FastAPI, Depends, HTTPException, status
from pydantic import BaseModel
from app.core.config import settings
from app.core.security import create_access_token
from app.middleware.pep_middleware import verify_token_pep
from app.models.token_models import UserContext
from app.models.rag_models import QueryRequest, QueryResponse
from app.services.rag_service import rag_service
from fastapi.middleware.cors import CORSMiddleware

# 1. Initialize FastAPI Instance
app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Zero Trust Architecture applied to Retrieval-Augmented Generation (RAG)",
    version="1.0.0"
)

# 2. Authentication Schema for Token Generation
class AuthRequest(BaseModel):
    user_id: str
    department: str
    clearance: int

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: str
    department: str
    clearance: int

@app.get("/health", tags=["System"])
def health_check():
    return {"status": "online", "architecture": "Zero Trust RAG"}

@app.post("/api/v1/auth/token", response_model=TokenResponse, tags=["Authentication & PEP"])
def generate_token(auth_in: AuthRequest):
    """Generates a cryptographic JWT token embedding ABAC attributes."""
    if auth_in.clearance < 1 or auth_in.clearance > 5:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Clearance level must be between 1 and 5."
        )
    
    token = create_access_token(
        subject=auth_in.user_id,
        department=auth_in.department,
        clearance=auth_in.clearance
    )
    return TokenResponse(
        access_token=token,
        user_id=auth_in.user_id,
        department=auth_in.department.lower(),
        clearance=auth_in.clearance
    )

@app.post("/api/v1/rag/query", response_model=QueryResponse, tags=["Zero Trust RAG Pipeline"])
def execute_secure_rag(
    request: QueryRequest,
    context: UserContext = Depends(verify_token_pep)
):
    """Zero-Trust RAG Pipeline Entrypoint"""
    return rag_service.process_query(query=request.query, context=context)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows React frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)