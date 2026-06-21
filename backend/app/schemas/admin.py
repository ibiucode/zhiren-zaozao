"""Admin 驗證相關 schema。"""
from typing import Optional

from pydantic import BaseModel

from app.schemas.base import CamelModel


class LoginRequest(BaseModel):
    username: str
    password: str


class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"


class AdminUserOut(CamelModel):
    id: int
    username: str
    email: Optional[str] = None
    role: str
    is_active: bool
