"""
Lead 모델
수집된 리드 정보
"""

from datetime import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey, JSON, Boolean
from sqlalchemy.orm import relationship
from uuid import uuid4

from app.core.database import Base


class Lead(Base):
    """리드 테이블"""

    __tablename__ = "leads"

    # Primary Key
    lead_id = Column(String(36), primary_key=True, default=lambda: str(uuid4()))

    # Foreign Key
    project_id = Column(
        String(36), ForeignKey("projects.project_id"), nullable=False, index=True
    )

    # 리드 정보 (필수)
    email = Column(String(255), nullable=False, index=True)

    # 리드 정보 (선택)
    name = Column(String(100), nullable=True)
    company = Column(String(100), nullable=True)
    role = Column(String(50), nullable=True)
    free_text = Column(String(500), nullable=True)

    # 동의 여부
    consent_privacy = Column(Boolean, default=False, nullable=False)
    consent_marketing = Column(Boolean, default=False, nullable=False)

    # UTM 파라미터
    source_utm = Column(
        JSON,
        nullable=True,
        default={
            "utm_source": None,
            "utm_medium": None,
            "utm_campaign": None,
            "utm_term": None,
            "utm_content": None,
        },
    )

    # 분석용 데이터
    user_agent = Column(String(500), nullable=True)
    ip_address = Column(String(45), nullable=True)  # IPv6 지원
    form_location = Column(String(20), nullable=True)  # top, bottom, modal, cta, inline

    # 중복 검증 키
    dedupe_key = Column(String(300), unique=True, nullable=False, index=True)

    # 타임스탬프
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)

    # 관계
    project = relationship("Project", back_populates="leads")

    def __repr__(self):
        return f"<Lead(lead_id={self.lead_id}, email={self.email})>"

    @staticmethod
    def generate_dedupe_key(email: str, project_id: str) -> str:
        """중복 검증 키 생성"""
        return f"{email.lower().strip()}_{project_id}"






