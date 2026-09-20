from pydantic import BaseModel, Field

class UserContext(BaseModel):
    user_id: str = Field(..., description="Unique subject ID from verified JWT")
    department: str = Field(..., description="Department attribute for ABAC decisions")
    clearance: int = Field(default=1, ge=1, le=5, description="Clearance level (1: Public to 5: Executive)")

class TokenPayload(BaseModel):
    sub: str
    department: str
    clearance: int
    exp: int