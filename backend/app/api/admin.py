"""Admin API routes（對齊 SKILL.md 第 5 節 Admin API）。

Phase 3 範圍：
- POST /api/admin/login（JWT）、GET /api/admin/me
- CRUD：/api/admin/{services,materials,portfolio,news,faq}
- PATCH：/api/admin/site-settings、/api/admin/contact-settings（+ GET 供表單預填）

不在本 phase：詢價管理（Phase 4）、SEO / price settings。
所有端點（除 login）皆需 Bearer JWT。
"""
import os
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.api.deps import get_current_admin, get_db
from app.core.security import create_access_token
from app.models.admin_user import AdminUser
from app.models.content import (
    ContactSettings,
    FaqItem,
    Material,
    NewsPost,
    PortfolioItem,
    Service,
    SiteSettings,
)
from app.models.inquiry import InquiryFile
from app.schemas.admin import AdminUserOut, LoginRequest, TokenOut
from app.schemas.inquiry import InquiryAdminOut, InquiryUpdate
from app.schemas.content import (
    ContactOut,
    ContactSettingsUpdate,
    FaqCreate,
    FaqOut,
    FaqUpdate,
    MaterialCreate,
    MaterialOut,
    MaterialUpdate,
    NewsCreate,
    NewsOut,
    NewsUpdate,
    PortfolioItemCreate,
    PortfolioItemOut,
    PortfolioItemUpdate,
    ServiceCreate,
    ServiceOut,
    ServiceUpdate,
    SiteSettingsOut,
    SiteSettingsUpdate,
)
from app.services import admin_service, content_service, inquiry_service

router = APIRouter(prefix="/api/admin", tags=["admin"])


# --------------------------- 驗證 ---------------------------
@router.post("/login", response_model=TokenOut)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = admin_service.authenticate_admin(db, payload.username, payload.password)
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="帳號或密碼錯誤")
    return TokenOut(access_token=create_access_token(user.username))


@router.get("/me", response_model=AdminUserOut)
def me(current: AdminUser = Depends(get_current_admin)):
    return current


# --------------------- 通用 CRUD router 工廠 ---------------------
def _make_crud_router(*, prefix, tags, model, out_schema, create_schema, update_schema):
    """為單一內容資源產生 list/create/get/patch/delete 路由（皆需 admin 驗證）。"""
    crud = APIRouter(prefix=prefix, tags=tags, dependencies=[Depends(get_current_admin)])

    @crud.get("", response_model=List[out_schema])
    def list_items(db: Session = Depends(get_db)):
        query = db.query(model)
        if hasattr(model, "sort_order"):
            query = query.order_by(model.sort_order)
        return query.all()

    @crud.post("", response_model=out_schema, status_code=status.HTTP_201_CREATED)
    def create_item(payload: create_schema, db: Session = Depends(get_db)):
        data = payload.model_dump(by_alias=False)
        pk = data.get("id")
        if pk is not None and db.get(model, pk) is not None:
            raise HTTPException(status_code=409, detail=f"id '{pk}' 已存在")
        obj = model(**data)
        db.add(obj)
        db.commit()
        db.refresh(obj)
        return obj

    @crud.get("/{item_id}", response_model=out_schema)
    def get_item(item_id: str, db: Session = Depends(get_db)):
        obj = db.get(model, item_id)
        if obj is None:
            raise HTTPException(status_code=404, detail="找不到資料")
        return obj

    @crud.patch("/{item_id}", response_model=out_schema)
    def update_item(item_id: str, payload: update_schema, db: Session = Depends(get_db)):
        obj = db.get(model, item_id)
        if obj is None:
            raise HTTPException(status_code=404, detail="找不到資料")
        for key, value in payload.model_dump(exclude_unset=True, by_alias=False).items():
            setattr(obj, key, value)
        db.commit()
        db.refresh(obj)
        return obj

    @crud.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
    def delete_item(item_id: str, db: Session = Depends(get_db)):
        obj = db.get(model, item_id)
        if obj is None:
            raise HTTPException(status_code=404, detail="找不到資料")
        db.delete(obj)
        db.commit()
        return None

    return crud


router.include_router(_make_crud_router(
    prefix="/services", tags=["admin:services"], model=Service,
    out_schema=ServiceOut, create_schema=ServiceCreate, update_schema=ServiceUpdate))
router.include_router(_make_crud_router(
    prefix="/materials", tags=["admin:materials"], model=Material,
    out_schema=MaterialOut, create_schema=MaterialCreate, update_schema=MaterialUpdate))
router.include_router(_make_crud_router(
    prefix="/portfolio", tags=["admin:portfolio"], model=PortfolioItem,
    out_schema=PortfolioItemOut, create_schema=PortfolioItemCreate, update_schema=PortfolioItemUpdate))
router.include_router(_make_crud_router(
    prefix="/news", tags=["admin:news"], model=NewsPost,
    out_schema=NewsOut, create_schema=NewsCreate, update_schema=NewsUpdate))
router.include_router(_make_crud_router(
    prefix="/faq", tags=["admin:faq"], model=FaqItem,
    out_schema=FaqOut, create_schema=FaqCreate, update_schema=FaqUpdate))


# --------------------------- 網站設定 ---------------------------
@router.get("/site-settings", response_model=SiteSettingsOut,
            dependencies=[Depends(get_current_admin)])
def read_site_settings(db: Session = Depends(get_db)):
    site, contact = content_service.get_site_settings(db)
    if site is None:
        raise HTTPException(status_code=404, detail="尚未設定網站資訊")
    out = SiteSettingsOut.model_validate(site)
    out.contact = ContactOut.model_validate(contact) if contact is not None else None
    return out


@router.patch("/site-settings", response_model=SiteSettingsOut,
              dependencies=[Depends(get_current_admin)])
def update_site_settings(payload: SiteSettingsUpdate, db: Session = Depends(get_db)):
    site = db.get(SiteSettings, 1)
    if site is None:
        site = SiteSettings(id=1)
        db.add(site)
    for key, value in payload.model_dump(exclude_unset=True, by_alias=False).items():
        setattr(site, key, value)
    db.commit()
    db.refresh(site)
    contact = db.get(ContactSettings, 1)
    out = SiteSettingsOut.model_validate(site)
    out.contact = ContactOut.model_validate(contact) if contact is not None else None
    return out


@router.patch("/contact-settings", response_model=ContactOut,
              dependencies=[Depends(get_current_admin)])
def update_contact_settings(payload: ContactSettingsUpdate, db: Session = Depends(get_db)):
    contact = db.get(ContactSettings, 1)
    if contact is None:
        contact = ContactSettings(id=1)
        db.add(contact)
    for key, value in payload.model_dump(exclude_unset=True, by_alias=False).items():
        setattr(contact, key, value)
    db.commit()
    db.refresh(contact)
    return contact


# --------------------------- 詢價單（Phase 4）---------------------------
@router.get("/inquiries", response_model=List[InquiryAdminOut],
            dependencies=[Depends(get_current_admin)])
def list_inquiries(status: Optional[str] = None, db: Session = Depends(get_db)):
    return inquiry_service.list_inquiries(db, status)


@router.get("/inquiries/{inquiry_id}", response_model=InquiryAdminOut,
            dependencies=[Depends(get_current_admin)])
def get_inquiry(inquiry_id: int, db: Session = Depends(get_db)):
    obj = inquiry_service.get_inquiry(db, inquiry_id)
    if obj is None:
        raise HTTPException(status_code=404, detail="找不到詢價單")
    return obj


@router.patch("/inquiries/{inquiry_id}", response_model=InquiryAdminOut,
              dependencies=[Depends(get_current_admin)])
def update_inquiry(inquiry_id: int, payload: InquiryUpdate, db: Session = Depends(get_db)):
    obj = inquiry_service.update_inquiry(db, inquiry_id, payload)
    if obj is None:
        raise HTTPException(status_code=404, detail="找不到詢價單")
    return obj


@router.get("/inquiries/{inquiry_id}/files/{file_id}/download",
            dependencies=[Depends(get_current_admin)])
def download_inquiry_file(inquiry_id: int, file_id: int, db: Session = Depends(get_db)):
    """下載詢價附件（供人工估價）。"""
    f = db.get(InquiryFile, file_id)
    if f is None or f.inquiry_id != inquiry_id:
        raise HTTPException(status_code=404, detail="找不到附件")
    if not f.stored_path or not os.path.exists(f.stored_path):
        raise HTTPException(status_code=410, detail="附件檔案已不存在")
    return FileResponse(f.stored_path, filename=f.filename, media_type="application/octet-stream")
