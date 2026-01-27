"""
EventLog 모델
사용자 행동 이벤트 로그
"""

from datetime import datetime
from sqlalchemy import Column, String, DateTime, JSON, Integer
from uuid import uuid4

from app.core.database import Base


class EventLog(Base):
    """이벤트 로그 테이블"""

    __tablename__ = "event_logs"

    # Primary Key
    id = Column(Integer, primary_key=True, autoincrement=True)

    # 이벤트 정보
    event_id = Column(String(36), default=lambda: str(uuid4()), nullable=False)
    event_type = Column(
        String(50), nullable=False, index=True
    )  # page_view, form_submit, etc.
    project_id = Column(String(36), nullable=False, index=True)

    # 이벤트 데이터
    data = Column(JSON, nullable=True)

    # 메타데이터
    user_agent = Column(String(500), nullable=True)
    ip_address = Column(String(45), nullable=True)

    # 타임스탬프
    timestamp = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)

    def __repr__(self):
        return f"<EventLog(event_type={self.event_type}, project_id={self.project_id})>"






