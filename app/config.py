import os
from dataclasses import dataclass

@dataclass
class Settings:
    PROJECT_NAME: str = "О!дин запрос — Хакатон Островка 2026"
    VERSION: str = "0.1.0"
    API_V1_PREFIX: str = "/api/v1"

    DB_HOST: str = os.getenv("DB_HOST", "localhost")
    DB_PORT: str = os.getenv("DB_PORT", "5432")
    DB_USER: str = os.getenv("DB_USER", "postgres")
    DB_PASSWORD: str = os.getenv("DB_PASSWORD", "postgres")
    DB_NAME: str = os.getenv("DB_NAME", "odin_canary")

    @property
    def DATABASE_URL(self) -> str:
        return os.getenv(
            "DATABASE_URL",
            f"postgresql+psycopg://{self.DB_USER}:{self.DB_PASSWORD}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"
        )

settings = Settings()
