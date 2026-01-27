"""
북마크 스키마
북마크 관련 요청/응답 모델
"""

from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field


# 폴더 스키마
class BookmarkFolderCreate(BaseModel):
    """폴더 생성 요청"""
    name: str = Field(..., max_length=100)
    description: Optional[str] = None


class BookmarkFolderUpdate(BaseModel):
    """폴더 수정 요청"""
    name: Optional[str] = Field(None, max_length=100)
    description: Optional[str] = None
    order_index: Optional[int] = None


class BookmarkFolderResponse(BaseModel):
    """폴더 응답"""
    folder_id: str
    name: str
    description: Optional[str] = None
    order_index: int
    bookmark_count: int = 0
    created_at: datetime

    class Config:
        from_attributes = True


# 북마크 스키마
class BookmarkCreate(BaseModel):
    """북마크 생성 요청"""
    project_id: str
    folder_id: Optional[str] = None
    name: Optional[str] = Field(None, max_length=200)  # 사용자 지정 이름
    memo: Optional[str] = None


class BookmarkUpdate(BaseModel):
    """북마크 수정 요청"""
    folder_id: Optional[str] = None
    name: Optional[str] = Field(None, max_length=200)  # 사용자 지정 이름
    memo: Optional[str] = None


class BookmarkProjectInfo(BaseModel):
    """북마크된 프로젝트 정보"""
    project_id: str
    name: str
    notion_url: str
    public_slug: str


class BookmarkResponse(BaseModel):
    """북마크 응답"""
    bookmark_id: str
    project: BookmarkProjectInfo
    folder_id: Optional[str] = None
    name: Optional[str] = None  # 사용자 지정 이름 (없으면 project.name 사용)
    memo: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class BookmarkListResponse(BaseModel):
    """북마크 목록 응답"""
    bookmarks: List[BookmarkResponse]
    total: int


class BookmarkFolderListResponse(BaseModel):
    """폴더 목록 응답"""
    folders: List[BookmarkFolderResponse]


class BookmarkCheckResponse(BaseModel):
    """북마크 여부 확인 응답"""
    is_bookmarked: bool
    bookmark_id: Optional[str] = None
    folder_id: Optional[str] = None
