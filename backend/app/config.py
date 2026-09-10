from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field

class Settings(BaseSettings):
    LLM_BASE_URL: str = Field(default="http://localhost:11434/v1")
    LLM_MODEL: str = Field(default="llama3.1")
    LLM_API_KEY: str = Field(default="ollama")
    LLM_ENABLED: bool = Field(default=False)
    DEFAULT_ENGINE: str = Field(default="docling")
    MAX_FILE_SIZE_MB: int = Field(default=100)
    OUTPUT_DIR: str = Field(default="./outputs")
    UPLOAD_DIR: str = Field(default="./uploads")
    SYSTEM_PROMPT: str = Field(default="")

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

settings = Settings()
