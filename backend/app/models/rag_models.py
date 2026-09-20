from typing import List, Optional
from pydantic import BaseModel, Field

class QueryRequest(BaseModel):
    query: str = Field(..., min_length=3, example="What are the backend mTLS ports?")

class RetrievedChunk(BaseModel):
    chunk_id: str
    content: str
    department: str
    clearance: int
    score: Optional[float] = None

class QueryResponse(BaseModel):
    user_id: str
    department: str
    clearance: int
    authorized_chunks_used: int
    answer: str
    sanitized: bool = False
    audit_event_id: str