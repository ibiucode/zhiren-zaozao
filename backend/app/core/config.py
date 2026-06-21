"""應用設定（集中讀取環境變數）。對齊 SKILL.md app/core 的職責：config。"""
from functools import lru_cache
from typing import List

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env", env_file_encoding="utf-8", extra="ignore"
    )

    app_name: str = "ZhiRen ZaoZao API"
    api_prefix: str = "/api"

    # 環境：development | production。production 會強制要求覆蓋預設密鑰 / 密碼。
    environment: str = "development"

    # 預設使用 SQLite，讓本機未裝 PostgreSQL 也能立即啟動。
    # 正式環境 / Render 以 .env 的 DATABASE_URL 指定 PostgreSQL。
    database_url: str = "sqlite:///./dev.db"

    # 逗號分隔的允許來源（CORS）。5173/4173 = 前台；5174/4174 = admin 後台。
    cors_origins: str = (
        "http://localhost:5173,http://localhost:4173,"
        "http://localhost:5174,http://localhost:4174"
    )

    # --- Admin / Auth（Phase 3）---
    # JWT 簽章密鑰：正式環境務必以 .env 覆蓋成隨機長字串。
    jwt_secret: str = "dev-secret-change-me"
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 720  # 12 小時

    # 預設管理員（由 seed 建立）；正式環境請以 .env 覆蓋。
    admin_username: str = "admin"
    admin_password: str = "admin12345"

    # --- 檔案上傳 / 估價（Phase 5）---
    upload_dir: str = "./uploads"
    max_upload_mb: int = 50
    allowed_file_formats: str = "stl,obj,step,stp"
    # 任一軸超過此尺寸（mm）會提出警告（常見桌上型列印範圍）。
    max_print_dimension_mm: float = 300.0

    @property
    def is_production(self) -> bool:
        return self.environment.lower() == "production"

    @property
    def sqlalchemy_database_url(self) -> str:
        """正規化 DB URL：Render/Heroku 給的 postgres:// 需轉成 SQLAlchemy 的 driver 形式。"""
        url = self.database_url
        if url.startswith("postgres://"):
            return "postgresql+psycopg2://" + url[len("postgres://"):]
        if url.startswith("postgresql://"):
            return "postgresql+psycopg2://" + url[len("postgresql://"):]
        return url

    @property
    def using_default_secrets(self) -> List[str]:
        """回傳仍是預設值的敏感設定名稱（用於啟動時的安全檢查）。"""
        issues = []
        if self.jwt_secret == "dev-secret-change-me":
            issues.append("JWT_SECRET")
        if self.admin_password == "admin12345":
            issues.append("ADMIN_PASSWORD")
        return issues

    @property
    def cors_origins_list(self) -> List[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]

    @property
    def allowed_file_formats_list(self) -> List[str]:
        return [f.strip().lower() for f in self.allowed_file_formats.split(",") if f.strip()]

    @property
    def max_upload_bytes(self) -> int:
        return self.max_upload_mb * 1024 * 1024


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
