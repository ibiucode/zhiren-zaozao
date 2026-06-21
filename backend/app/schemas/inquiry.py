"""詢價 API 的 schema。

InquiryCreate 接受前端送來的 camelCase（serviceType / materialPreference 等），
因 base 設定 populate_by_name=True 且 alias 為 camelCase，故 camelCase 與 snake_case 皆可。
"""
from datetime import datetime
from typing import List, Optional

from pydantic import EmailStr, Field, field_validator

from app.schemas.base import CamelModel
from app.schemas.quote import InquiryFileOut

# 詢價狀態（Phase 4 後台管理）。
INQUIRY_STATUSES = ("new", "in_review", "quoted", "closed")


class InquiryCreate(CamelModel):
    name: str = Field(min_length=1)
    email: EmailStr
    phone: Optional[str] = None
    service_type: Optional[str] = None
    material_preference: Optional[str] = None
    description: str = Field(min_length=1)
    deadline: Optional[str] = None


class InquiryOut(CamelModel):
    """前台送出後的回應（精簡）。"""
    id: int
    status: str
    created_at: datetime


class InquiryAdminOut(CamelModel):
    """後台檢視用（完整欄位）。"""
    id: int
    name: str
    email: str
    phone: Optional[str] = None
    service_type: Optional[str] = None
    material_preference: Optional[str] = None
    description: str
    deadline: Optional[str] = None
    status: str
    admin_note: Optional[str] = None
    quoted_amount: Optional[int] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    files: List[InquiryFileOut] = []


class InquiryUpdate(CamelModel):
    """後台更新狀態 / 備註 / 估價（PATCH，部分更新）。"""
    status: Optional[str] = None
    admin_note: Optional[str] = None
    quoted_amount: Optional[int] = None

    @field_validator("status")
    @classmethod
    def _validate_status(cls, v):
        if v is not None and v not in INQUIRY_STATUSES:
            raise ValueError(f"status 必須是 {INQUIRY_STATUSES} 之一")
        return v
