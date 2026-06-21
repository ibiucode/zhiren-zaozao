"""建立資料表。

Phase 2 以 SQLAlchemy 的 create_all() 建表，足以支撐 foundation。
未來（Phase 6 或更早）若需要版本化的 schema 變更，可導入 Alembic migration。
"""
from app.db.base import Base
from app.db.session import engine

# 匯入 models，讓 Base.metadata 認得所有資料表（勿移除）。
from app.models import admin_user, content, inquiry  # noqa: F401


def init_db() -> None:
    Base.metadata.create_all(bind=engine)
