"""內容 API 的回應 schema。欄位對齊前端 src/data 的結構（輸出 camelCase）。"""
from datetime import date
from typing import List, Optional

from app.schemas.base import CamelModel


class ServiceOut(CamelModel):
    id: str
    name: str
    icon: Optional[str] = None
    description: Optional[str] = None
    details: List[str] = []
    is_active: bool = True
    sort_order: int = 0
    link_to: Optional[str] = None


class MaterialOut(CamelModel):
    id: str
    name: str
    description: Optional[str] = None
    color_options: List[str] = []
    # properties 內含 camelCase 鍵（如 heatResistance），原樣輸出。
    properties: dict = {}
    image: Optional[str] = None
    is_active: bool = True
    sort_order: int = 0


class PortfolioItemOut(CamelModel):
    id: str
    title: str
    category: Optional[str] = None
    material_id: Optional[str] = None
    service_id: Optional[str] = None
    description: Optional[str] = None
    images: Optional[List[str]] = None
    tags: List[str] = []
    is_featured: bool = False
    sort_order: int = 0


class PortfolioCategoryOut(CamelModel):
    id: str
    label: str


class PortfolioResponse(CamelModel):
    items: List[PortfolioItemOut]
    categories: List[PortfolioCategoryOut]


class NewsOut(CamelModel):
    id: str
    title: str
    slug: Optional[str] = None
    summary: Optional[str] = None
    content: Optional[str] = None
    cover_image: Optional[str] = None
    is_published: bool = True
    published_at: Optional[date] = None
    created_at: Optional[date] = None


class FaqOut(CamelModel):
    id: str
    question: str
    answer: Optional[str] = None
    category: Optional[str] = None
    sort_order: int = 0
    is_published: bool = True


class SocialLink(CamelModel):
    id: str
    label: str
    url: str


class ContactOut(CamelModel):
    email: Optional[str] = None
    phone: Optional[str] = None
    line_id: Optional[str] = None
    address: Optional[str] = None
    business_hours: Optional[str] = None


class SiteSettingsOut(CamelModel):
    site_name: Optional[str] = None
    site_name_en: Optional[str] = None
    tagline: Optional[str] = None
    description: Optional[str] = None
    footer_text: Optional[str] = None
    social: List[SocialLink] = []
    contact: Optional[ContactOut] = None


# =========================================================================
# Admin 輸入 schema（create / update）。
# create 需帶 id（內容用 slug 當主鍵）；update 全部選填（PATCH 部分更新）。
# 因 CamelModel 接受 camelCase，前端送 camelCase 即可。
# =========================================================================
class ServiceCreate(CamelModel):
    id: str
    name: str
    icon: Optional[str] = None
    description: Optional[str] = None
    details: List[str] = []
    is_active: bool = True
    sort_order: int = 0
    link_to: Optional[str] = None


class ServiceUpdate(CamelModel):
    name: Optional[str] = None
    icon: Optional[str] = None
    description: Optional[str] = None
    details: Optional[List[str]] = None
    is_active: Optional[bool] = None
    sort_order: Optional[int] = None
    link_to: Optional[str] = None


class MaterialCreate(CamelModel):
    id: str
    name: str
    description: Optional[str] = None
    color_options: List[str] = []
    properties: dict = {}
    image: Optional[str] = None
    is_active: bool = True
    sort_order: int = 0


class MaterialUpdate(CamelModel):
    name: Optional[str] = None
    description: Optional[str] = None
    color_options: Optional[List[str]] = None
    properties: Optional[dict] = None
    image: Optional[str] = None
    is_active: Optional[bool] = None
    sort_order: Optional[int] = None


class PortfolioItemCreate(CamelModel):
    id: str
    title: str
    category: Optional[str] = None
    material_id: Optional[str] = None
    service_id: Optional[str] = None
    description: Optional[str] = None
    images: Optional[List[str]] = None
    tags: List[str] = []
    is_featured: bool = False
    sort_order: int = 0


class PortfolioItemUpdate(CamelModel):
    title: Optional[str] = None
    category: Optional[str] = None
    material_id: Optional[str] = None
    service_id: Optional[str] = None
    description: Optional[str] = None
    images: Optional[List[str]] = None
    tags: Optional[List[str]] = None
    is_featured: Optional[bool] = None
    sort_order: Optional[int] = None


class NewsCreate(CamelModel):
    id: str
    title: str
    slug: Optional[str] = None
    summary: Optional[str] = None
    content: Optional[str] = None
    cover_image: Optional[str] = None
    is_published: bool = True
    published_at: Optional[date] = None
    created_at: Optional[date] = None


class NewsUpdate(CamelModel):
    title: Optional[str] = None
    slug: Optional[str] = None
    summary: Optional[str] = None
    content: Optional[str] = None
    cover_image: Optional[str] = None
    is_published: Optional[bool] = None
    published_at: Optional[date] = None


class FaqCreate(CamelModel):
    id: str
    question: str
    answer: Optional[str] = None
    category: Optional[str] = None
    sort_order: int = 0
    is_published: bool = True


class FaqUpdate(CamelModel):
    question: Optional[str] = None
    answer: Optional[str] = None
    category: Optional[str] = None
    sort_order: Optional[int] = None
    is_published: Optional[bool] = None


class SiteSettingsUpdate(CamelModel):
    site_name: Optional[str] = None
    site_name_en: Optional[str] = None
    tagline: Optional[str] = None
    description: Optional[str] = None
    footer_text: Optional[str] = None
    social: Optional[List[SocialLink]] = None


class ContactSettingsUpdate(CamelModel):
    email: Optional[str] = None
    phone: Optional[str] = None
    line_id: Optional[str] = None
    address: Optional[str] = None
    business_hours: Optional[str] = None
