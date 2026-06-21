"""Public API routes（對齊 SKILL.md 第 5 節 Public API）。

範圍：GET 內容端點、POST /inquiries（建立）、檔案檢查與附件上傳（Phase 5）。
未提供 admin / auth（屬 admin router）；自動估價（/quote/estimate）為未來工作。
"""
from typing import List

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.models.inquiry import Inquiry
from app.schemas.content import (
    ContactOut,
    FaqOut,
    MaterialOut,
    NewsOut,
    PortfolioResponse,
    ServiceOut,
    SiteSettingsOut,
)
from app.schemas.inquiry import InquiryCreate, InquiryOut
from app.schemas.quote import FileCheckResponse, InquiryFileOut
from app.services import content_service, file_service, inquiry_service

router = APIRouter(prefix="/api", tags=["public"])


@router.get("/site-settings", response_model=SiteSettingsOut)
def read_site_settings(db: Session = Depends(get_db)):
    site, contact = content_service.get_site_settings(db)
    if site is None:
        raise HTTPException(status_code=404, detail="Site settings not configured")
    out = SiteSettingsOut.model_validate(site)
    out.contact = ContactOut.model_validate(contact) if contact is not None else None
    return out


@router.get("/services", response_model=List[ServiceOut])
def read_services(db: Session = Depends(get_db)):
    return content_service.list_services(db)


@router.get("/materials", response_model=List[MaterialOut])
def read_materials(db: Session = Depends(get_db)):
    return content_service.list_materials(db)


@router.get("/portfolio", response_model=PortfolioResponse)
def read_portfolio(db: Session = Depends(get_db)):
    return content_service.get_portfolio(db)


@router.get("/news", response_model=List[NewsOut])
def read_news(db: Session = Depends(get_db)):
    return content_service.list_news(db)


@router.get("/news/{news_id}", response_model=NewsOut)
def read_news_item(news_id: str, db: Session = Depends(get_db)):
    post = content_service.get_news(db, news_id)
    if post is None or not post.is_published:
        raise HTTPException(status_code=404, detail="News post not found")
    return post


@router.get("/faq", response_model=List[FaqOut])
def read_faq(db: Session = Depends(get_db)):
    return content_service.list_faq(db)


@router.post("/inquiries", response_model=InquiryOut, status_code=status.HTTP_201_CREATED)
def create_inquiry(payload: InquiryCreate, db: Session = Depends(get_db)):
    return inquiry_service.create_inquiry(db, payload)


# --------------------------- 檔案檢查 / 上傳（Phase 5）---------------------------
@router.post("/quote/check-file", response_model=FileCheckResponse, tags=["quote"])
async def check_file(file: UploadFile = File(...)):
    """即時檢查 3D 檔案（格式 / 大小 / 尺寸 / 破面），不落庫。"""
    content = await file.read()
    return file_service.analyze_upload(file.filename, content)


@router.post(
    "/inquiries/{inquiry_id}/files",
    response_model=InquiryFileOut,
    status_code=status.HTTP_201_CREATED,
    tags=["quote"],
)
async def upload_inquiry_file(
    inquiry_id: int, file: UploadFile = File(...), db: Session = Depends(get_db)
):
    """上傳檔案並附加到指定詢價單（會落庫並儲存檔案）。"""
    if db.get(Inquiry, inquiry_id) is None:
        raise HTTPException(status_code=404, detail="找不到詢價單")
    content = await file.read()
    analysis = file_service.analyze_upload(file.filename, content)
    if analysis["check_status"] == "error":
        detail = "；".join(analysis["check_result"]["errors"]) or "檔案檢查未通過"
        raise HTTPException(status_code=400, detail=detail)
    return file_service.save_inquiry_file(db, inquiry_id, file.filename, content, analysis)
