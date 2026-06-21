"""FastAPI 進入點。對齊 SKILL.md app/main.py。"""
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.admin import router as admin_router
from app.api.public import router as public_router
from app.core.config import settings
from app.db.init_db import init_db
from app.db.session import SessionLocal
from app.services.admin_service import ensure_default_admin

logger = logging.getLogger("uvicorn.error")


def _check_security() -> None:
    """啟動時的安全檢查（Phase 6 admin permission hardening）。

    正式環境（ENVIRONMENT=production）若仍使用預設密鑰 / 密碼則直接拒絕啟動；
    開發環境則僅記錄警告。
    """
    defaults = settings.using_default_secrets
    if not defaults:
        return
    names = ", ".join(defaults)
    if settings.is_production:
        raise RuntimeError(
            f"正式環境不可使用預設的 {names}，請以環境變數覆蓋後再啟動。"
        )
    logger.warning("⚠ 正在使用預設的 %s（僅限開發）。正式環境請務必以環境變數覆蓋。", names)


@asynccontextmanager
async def lifespan(app: FastAPI):
    _check_security()
    # 啟動時確保資料表存在（以 create_all 建表）。
    init_db()
    # 確保預設管理員存在，讓 admin 後台可登入（帳密見 settings / .env）。
    db = SessionLocal()
    try:
        ensure_default_admin(db)
    finally:
        db.close()
    yield


app = FastAPI(title=settings.app_name, version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def security_headers(request: Request, call_next):
    """加上基本安全標頭。"""
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    return response


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    """未預期的錯誤統一回傳乾淨的 JSON，避免洩漏堆疊細節。"""
    logger.exception("Unhandled error on %s %s", request.method, request.url.path)
    return JSONResponse(status_code=500, content={"detail": "伺服器發生錯誤，請稍後再試。"})


@app.get("/", tags=["meta"])
def root():
    return {"name": settings.app_name, "status": "ok", "docs": "/docs"}


@app.get("/api/health", tags=["meta"])
def health():
    return {"status": "ok", "environment": settings.environment}


app.include_router(public_router)
app.include_router(admin_router)
