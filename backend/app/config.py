import os
try:
    from pydantic_settings import BaseSettings
    class Settings(BaseSettings):
        DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./ganeshmap.db")
        SECRET_KEY: str = os.getenv("SECRET_KEY", "ganesh_map_super_secret_jwt_key_2026_festive")
        ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
        ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "4320"))
        UPLOAD_DIR: str = os.getenv("UPLOAD_DIR", "./uploads")
        AI_CONFIDENCE_THRESHOLD: float = float(os.getenv("AI_CONFIDENCE_THRESHOLD", "0.60"))
except ImportError:
    class Settings:
        DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./ganeshmap.db")
        SECRET_KEY: str = os.getenv("SECRET_KEY", "ganesh_map_super_secret_jwt_key_2026_festive")
        ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
        ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "4320"))
        UPLOAD_DIR: str = os.getenv("UPLOAD_DIR", "./uploads")
        AI_CONFIDENCE_THRESHOLD: float = float(os.getenv("AI_CONFIDENCE_THRESHOLD", "0.60"))

settings = Settings()
