from pydantic_settings import BaseSettings
from pydantic import Field


class Settings(BaseSettings):
    """
    Centralised config for Synaptra Core (Pydantic v2+ compatible).
    Loads environment variables for API keys, database, etc.
    """

    environment: str = Field(default="development")
    openai_api_key: str | None = None

    # Database
    database_url: str = Field(
        default="sqlite+aiosqlite:///./synaptra.db"
    )

    # Vector store
    vector_store_path: str = Field(default="./data/vector_store")

    model_config = {
        "env_file": ".env",
        "env_file_encoding": "utf-8",
    }


settings = Settings()