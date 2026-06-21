"""詢價單的商業邏輯。Phase 2：建立（前台）。Phase 4：後台檢視 / 狀態 / 備註。"""
from typing import List, Optional

from sqlalchemy.orm import Session

from app.models.inquiry import Inquiry
from app.schemas.inquiry import InquiryCreate, InquiryUpdate


def create_inquiry(db: Session, payload: InquiryCreate) -> Inquiry:
    obj = Inquiry(
        name=payload.name,
        email=str(payload.email),
        phone=payload.phone,
        service_type=payload.service_type,
        material_preference=payload.material_preference,
        description=payload.description,
        deadline=payload.deadline,
        status="new",
    )
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj


def list_inquiries(db: Session, status: Optional[str] = None) -> List[Inquiry]:
    query = db.query(Inquiry)
    if status:
        query = query.filter(Inquiry.status == status)
    return query.order_by(Inquiry.created_at.desc()).all()


def get_inquiry(db: Session, inquiry_id: int) -> Optional[Inquiry]:
    return db.get(Inquiry, inquiry_id)


def update_inquiry(db: Session, inquiry_id: int, payload: InquiryUpdate) -> Optional[Inquiry]:
    obj = db.get(Inquiry, inquiry_id)
    if obj is None:
        return None
    for key, value in payload.model_dump(exclude_unset=True, by_alias=False).items():
        setattr(obj, key, value)
    db.commit()
    db.refresh(obj)
    return obj
