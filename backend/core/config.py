"""
CompareIQ AI — Settings
Author: Raja Abimanyu N | Data Scientist | AI & Applied ML
"""

import secrets
import os
from pydantic_settings import BaseSettings
from pydantic import Field


class Settings(BaseSettings):
    # App
    APP_NAME: str = "CompareIQ AI"
    APP_ENV: str = "development"
    SECRET_KEY: str = Field(default_factory=lambda: secrets.token_hex(32))
    DEBUG: bool = True

    # CORS — stored as a plain comma-separated string, NOT a JSON list
    # Example in .env:  ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
    ALLOWED_ORIGINS: str = "http://localhost:3000"

    # Database — SQLite by default (zero setup)
    DATABASE_URL: str = "sqlite+aiosqlite:///./compareiq.db"

    # Redis — optional
    REDIS_URL: str = "redis://localhost:6379/0"

    # Qdrant — optional
    QDRANT_URL: str = "http://localhost:6333"
    QDRANT_API_KEY: str = ""
    QDRANT_COLLECTION: str = "compareiq_evidence"

    # Groq
    GROQ_API_KEY: str = ""
    GROQ_MODEL_FAST: str = "llama3-8b-8192"
    GROQ_MODEL_SMART: str = "llama3-70b-8192"

    # OpenAI
    OPENAI_API_KEY: str = ""
    OPENAI_MODEL_REASON: str = "gpt-4o"
    OPENAI_MODEL_VISION: str = "gpt-4o"
    OPENAI_WHISPER_MODEL: str = "whisper-1"

    # Auth
    JWT_ALGORITHM: str = "HS256"
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7

    # Celery
    CELERY_BROKER_URL: str = "redis://localhost:6379/1"
    CELERY_RESULT_BACKEND: str = "redis://localhost:6379/2"

    @property
    def cors_origins(self) -> list[str]:
        """Split the comma-separated ALLOWED_ORIGINS into a list."""
        return [o.strip() for o in self.ALLOWED_ORIGINS.split(",") if o.strip()]

    model_config = {
        "env_file": os.path.join(os.path.dirname(__file__), "../.env"),
        "env_file_encoding": "utf-8",
        "case_sensitive": True,
        "extra": "ignore",
    }


settings = Settings()