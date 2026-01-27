"""
북마크 모델
사용자의 콘텐츠 저장 (북마크) 기능
"""

import uuid
from datetime import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey, Integer, Text
from sqlalchemy.orm import relationship

from app.core.database import Base


class BookmarkFolder(Base):
    """북마크 폴더 모델"""

    __tablename__ = "bookmark_folders"

    folder_id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.user_id"), nullable=False, index=True)
    name = Column(String(100), nullable=False, default="기본 폴더")
    description = Column(Text, nullable=True)
    order_index = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    bookmarks = relationship("Bookmark", back_populates="folder", cascade="all, delete-orphan")


class Bookmark(Base):
    """북마크 모델"""

    __tablename__ = "bookmarks"

    bookmark_id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.user_id"), nullable=False, index=True)
    project_id = Column(String(36), ForeignKey("projects.project_id"), nullable=False, index=True)
    folder_id = Column(String(36), ForeignKey("bookmark_folders.folder_id"), nullable=True)
    name = Column(String(200), nullable=True)  # 사용자 지정 이름 (없으면 프로젝트 이름 사용)
    memo = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    folder = relationship("BookmarkFolder", back_populates="bookmarks")
    project = relationship("Project")
