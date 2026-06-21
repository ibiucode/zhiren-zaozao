"""內容讀取的商業邏輯。對齊 SKILL.md app/services 的職責。

route 只負責 HTTP，查詢與組裝邏輯放這裡，未來要加快取或規則時不必動 route。
"""
from typing import Optional

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.content import (
    ContactSettings,
    FaqItem,
    Material,
    NewsPost,
    PortfolioCategory,
    PortfolioItem,
    Service,
    SiteSettings,
)


def list_services(db: Session):
    stmt = select(Service).where(Service.is_active.is_(True)).order_by(Service.sort_order)
    return db.execute(stmt).scalars().all()


def list_materials(db: Session):
    stmt = select(Material).where(Material.is_active.is_(True)).order_by(Material.sort_order)
    return db.execute(stmt).scalars().all()


def get_portfolio(db: Session):
    items = db.execute(
        select(PortfolioItem).order_by(PortfolioItem.sort_order)
    ).scalars().all()
    categories = db.execute(
        select(PortfolioCategory).order_by(PortfolioCategory.sort_order)
    ).scalars().all()
    return {"items": items, "categories": categories}


def list_news(db: Session):
    stmt = (
        select(NewsPost)
        .where(NewsPost.is_published.is_(True))
        .order_by(NewsPost.published_at.desc())
    )
    return db.execute(stmt).scalars().all()


def get_news(db: Session, news_id: str) -> Optional[NewsPost]:
    return db.get(NewsPost, news_id)


def list_faq(db: Session):
    stmt = (
        select(FaqItem)
        .where(FaqItem.is_published.is_(True))
        .order_by(FaqItem.sort_order)
    )
    return db.execute(stmt).scalars().all()


def get_site_settings(db: Session):
    """回傳 (site, contact)；route 負責組裝成回應。任一為空則回傳 (None, None)。"""
    site = db.get(SiteSettings, 1)
    contact = db.get(ContactSettings, 1)
    return site, contact
