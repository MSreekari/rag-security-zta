import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "Applied RAG Security using ZTA"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "super-secret-zero-trust-hmac-sha256-key"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    GROQ_API_KEY: str = "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"
    CHROMA_PERSIST_DIR: str = "./data/chroma_db"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()