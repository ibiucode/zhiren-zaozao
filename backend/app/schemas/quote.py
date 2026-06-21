"""檔案檢查 / 附件 schema（Phase 5）。輸出 camelCase。"""
from datetime import datetime
from typing import List, Optional

from app.schemas.base import CamelModel


class Dimensions(CamelModel):
    x: float
    y: float
    z: float


class FileCheckResult(CamelModel):
    dimensions_mm: Optional[Dimensions] = None
    triangle_count: Optional[int] = None
    watertight: Optional[bool] = None
    boundary_edges: Optional[int] = None
    warnings: List[str] = []
    errors: List[str] = []


class FileCheckResponse(CamelModel):
    """POST /api/quote/check-file 的回應（不落庫的即時檢查）。"""
    file_name: str
    file_size: int
    file_format: str
    check_status: str  # ok | warning | error | unsupported
    check_result: FileCheckResult


class InquiryFileOut(CamelModel):
    """詢價附件（已落庫）。"""
    id: int
    inquiry_id: Optional[int] = None
    filename: str
    file_size: Optional[int] = None
    file_format: Optional[str] = None
    check_status: str
    check_result: Optional[FileCheckResult] = None
    created_at: Optional[datetime] = None
