from pathlib import Path
from dotenv import load_dotenv
from pydantic import Field, field_validator, ConfigDict
from pydantic_settings import BaseSettings

load_dotenv(dotenv_path=Path(__file__).resolve().parents[2] / '.env')

class Settings(BaseSettings):
    PROJECT_NAME: str = 'CRM Portal'
    API_V1_STR: str = '/api/v1'
    SECRET_KEY: str = Field(..., env='SECRET_KEY')
    ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(60, env='ACCESS_TOKEN_EXPIRE_MINUTES')
    DATABASE_URL: str = Field(..., env='DATABASE_URL')
    # read raw comma-separated or JSON list from env, avoid pydantic treating it as
    # a complex value that triggers json.loads before we can parse it
    BACKEND_CORS_ORIGINS_RAW: str | None = Field(None, env='BACKEND_CORS_ORIGINS')

    @property
    def BACKEND_CORS_ORIGINS(self) -> list[str]:
        raw = self.BACKEND_CORS_ORIGINS_RAW
        default = ['http://localhost:5173', 'http://127.0.0.1:5173']
        if raw is None:
            return default
        raw = raw.strip()
        if not raw:
            return []
        if raw.startswith('[') and raw.endswith(']'):
            import json

            try:
                return json.loads(raw)
            except Exception:
                return default
        return [item.strip() for item in raw.split(',') if item.strip()]

    model_config = ConfigDict(
        env_file=Path(__file__).resolve().parents[2] / '.env',
        env_file_encoding='utf-8',
        extra='allow',
    )

settings = Settings()
