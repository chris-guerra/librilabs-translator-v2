"""
Configuration management.

Loads and validates environment variables using pydantic-settings.
"""
import logging
from typing import Optional
from pydantic_settings import BaseSettings, SettingsConfigDict

logger = logging.getLogger(__name__)


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # OpenAI API configuration
    openai_api_key: Optional[str] = None
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )


settings = Settings()

# Log warning if OpenAI API key is not set (but don't fail)
if not settings.openai_api_key:
    logger.warning(
        "OPENAI_API_KEY is not set. "
        "OpenAI API features will not be available. "
        "Set OPENAI_API_KEY in .env file to enable OpenAI integration."
    )

