"""
User 모델
운영자/사용자 계정 정보
"""

from datetime import datetime
from sqlalchemy import Column, String, DateTime
from sqlalchemy.orm import relationship
from uuid import uuid4

from app.core.database import Base


class User(Base):
    """사용자/운영자 테이블"""

    __tablename__ = "users"

    # Primary Key
    user_id = Column(String(36), primary_key=True, default=lambda: str(uuid4()))

    # 계정 정보
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    name = Column(String(100), nullable=True)

    # 타임스탬프
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )
    last_login_at = Column(DateTime, nullable=True)

    # 관계
    projects = relationship("Project", back_populates="owner", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<User(user_id={self.user_id}, email={self.email})>"






