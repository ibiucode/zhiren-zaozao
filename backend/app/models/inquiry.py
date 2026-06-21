"""詢價單與附件資料表（對齊 SKILL.md Inquiry / InquiryFile 資料模型）。

Phase 2：POST 建立（前台）。Phase 4：狀態 / 備註。
Phase 5：附件上傳（InquiryFile）+ 人工估價（quoted_amount）。
"""
from datetime import datetime

from sqlalchemy import Column, DateTime, ForeignKey, Integer, JSON, String, Text
from sqlalchemy.orm import relationship

from app.db.base import Base


class Inquiry(Base):
    __tablename__ = "inquiries"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    phone = Column(String, nullable=True)
    service_type = Column(String, nullable=True)
    material_preference = Column(String, nullable=True)
    description = Column(Text, nullable=False)
    deadline = Column(String, nullable=True)
    # 狀態：new / in_review / quoted / closed（Phase 4 由後台管理）
    status = Column(String, default="new", nullable=False)
    admin_note = Column(Text, nullable=True)  # Phase 4 後台備註
    quoted_amount = Column(Integer, nullable=True)  # Phase 5 人工估價金額
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    files = relationship(
        "InquiryFile",
        back_populates="inquiry",
        cascade="all, delete-orphan",
        order_by="InquiryFile.created_at",
    )


class InquiryFile(Base):
    """詢價附件（3D 檔案）。check_result 存放網格分析結果（JSON）。"""
    __tablename__ = "inquiry_files"

    id = Column(Integer, primary_key=True, autoincrement=True)
    inquiry_id = Column(Integer, ForeignKey("inquiries.id"), nullable=True, index=True)
    filename = Column(String, nullable=False)        # 原始檔名
    stored_path = Column(String, nullable=True)      # 伺服器儲存路徑
    file_size = Column(Integer)                      # bytes
    file_format = Column(String)                     # stl / obj / step / stp
    # ok / warning / error / unsupported / pending
    check_status = Column(String, default="pending")
    check_result = Column(JSON, nullable=True)       # {dimensionsMm, triangleCount, watertight, ...}
    created_at = Column(DateTime, default=datetime.utcnow)

    inquiry = relationship("Inquiry", back_populates="files")
