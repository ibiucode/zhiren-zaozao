"""Admin 驗證的商業邏輯。"""
from typing import Optional

from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import hash_password, verify_password
from app.models.admin_user import AdminUser


def authenticate_admin(db: Session, username: str, password: str) -> Optional[AdminUser]:
    user = db.query(AdminUser).filter(AdminUser.username == username).first()
    if user is None or not user.is_active:
        return None
    if not verify_password(password, user.password_hash):
        return None
    return user


def ensure_default_admin(db: Session) -> AdminUser:
    """確保預設管理員存在（帳密取自 settings；正式環境以 .env 覆蓋）。"""
    user = db.query(AdminUser).filter(AdminUser.username == settings.admin_username).first()
    if user is not None:
        return user
    user = AdminUser(
        username=settings.admin_username,
        password_hash=hash_password(settings.admin_password),
        role="admin",
        is_active=True,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user
