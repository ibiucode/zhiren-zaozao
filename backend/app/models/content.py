"""內容相關資料表（對齊 SKILL.md 資料模型）。

欄位以 snake_case 命名；API 回應由 schema 層轉成 camelCase 以對齊前端 src/data。
list / dict 欄位使用 SQLAlchemy 的 JSON 型別（SQLite 與 PostgreSQL 皆支援）。
"""
from sqlalchemy import Boolean, Column, Date, Integer, JSON, String, Text

from app.db.base import Base


class Service(Base):
    """ServiceItem：服務項目。"""
    __tablename__ = "services"

    id = Column(String, primary_key=True)  # slug，例如 'fdm-printing'
    name = Column(String, nullable=False)
    icon = Column(String)
    description = Column(Text)
    details = Column(JSON, default=list)
    is_active = Column(Boolean, default=True)
    sort_order = Column(Integer, default=0)
    link_to = Column(String, nullable=True)


class Material(Base):
    """Material：材料。"""
    __tablename__ = "materials"

    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    description = Column(Text)
    color_options = Column(JSON, default=list)
    properties = Column(JSON, default=dict)  # {strength, heatResistance, detail}
    image = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    sort_order = Column(Integer, default=0)


class PortfolioCategory(Base):
    """作品分類（供前台篩選）。"""
    __tablename__ = "portfolio_categories"

    id = Column(String, primary_key=True)
    label = Column(String, nullable=False)
    sort_order = Column(Integer, default=0)


class PortfolioItem(Base):
    """PortfolioItem：作品集。"""
    __tablename__ = "portfolio_items"

    id = Column(String, primary_key=True)
    title = Column(String, nullable=False)
    category = Column(String)
    material_id = Column(String)
    service_id = Column(String)
    description = Column(Text)
    images = Column(JSON, nullable=True)
    tags = Column(JSON, default=list)
    is_featured = Column(Boolean, default=False)
    sort_order = Column(Integer, default=0)


class NewsPost(Base):
    """NewsPost：最新消息。"""
    __tablename__ = "news_posts"

    id = Column(String, primary_key=True)
    title = Column(String, nullable=False)
    slug = Column(String, unique=True)
    summary = Column(Text)
    content = Column(Text)
    cover_image = Column(String, nullable=True)
    is_published = Column(Boolean, default=True)
    published_at = Column(Date)
    created_at = Column(Date)


class FaqItem(Base):
    """FAQItem：常見問題。"""
    __tablename__ = "faq_items"

    id = Column(String, primary_key=True)
    question = Column(Text, nullable=False)
    answer = Column(Text)
    category = Column(String)
    sort_order = Column(Integer, default=0)
    is_published = Column(Boolean, default=True)


class SiteSettings(Base):
    """SiteSettings：網站設定（單列，id=1）。"""
    __tablename__ = "site_settings"

    id = Column(Integer, primary_key=True, default=1)
    site_name = Column(String)
    site_name_en = Column(String)
    tagline = Column(String)
    description = Column(Text)
    footer_text = Column(String)
    social = Column(JSON, default=list)  # [{id, label, url}]


class ContactSettings(Base):
    """ContactSettings：聯絡設定（單列，id=1）。"""
    __tablename__ = "contact_settings"

    id = Column(Integer, primary_key=True, default=1)
    email = Column(String)
    phone = Column(String)
    line_id = Column(String)
    address = Column(String)
    business_hours = Column(String)
