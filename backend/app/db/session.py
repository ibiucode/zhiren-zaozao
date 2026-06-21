"""資料庫 engine 與 session。對齊 SKILL.md app/db 的職責：database session。"""
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.core.config import settings

# SQLite 在多執行緒（uvicorn）下需要關閉同執行緒檢查。
db_url = settings.sqlalchemy_database_url
connect_args = {}
if db_url.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_engine(db_url, connect_args=connect_args, future=True)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False, future=True)


def get_db():
    """FastAPI 依賴：每個 request 取得一個 session，結束時關閉。"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
