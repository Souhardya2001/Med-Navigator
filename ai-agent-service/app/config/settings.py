from functools import lru_cache

from pydantic import AnyHttpUrl, Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Runtime configuration loaded exclusively from environment variables."""

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    app_env: str = "development"
    llm_provider: str = "openai"
    llm_model: str = "gpt-4o-mini"
    llm_api_key: str = Field(repr=False)
    llm_timeout: float = Field(default=30.0, gt=0)

    rag_service_url: AnyHttpUrl
    hospital_service_url: AnyHttpUrl
    rag_search_path: str = "/search"
    hospital_nearby_path: str = "/hospitals/nearby"
    rag_service_timeout: float = Field(default=10.0, gt=0)
    hospital_service_timeout: float = Field(default=10.0, gt=0)


@lru_cache
def get_settings() -> Settings:
    return Settings()
