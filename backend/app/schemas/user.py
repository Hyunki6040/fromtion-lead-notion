"""
User 스키마
사용자 관련 요청/응답 모델
"""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field


class UserCreate(BaseModel):
    """사용자 생성 요청"""

    email: EmailStr
    password: str = Field(..., min_length=8, max_length=100)
    name: Optional[str] = Field(None, max_length=100)


class UserLogin(BaseModel):
    """로그인 요청"""

    email: EmailStr
    password: str


class UserResponse(BaseModel):
    """사용자 응답"""

    user_id: str
    email: str
    name: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    """토큰 응답"""

    user_id: str
    email: str
    name: Optional[str] = None
    token: str
    token_type: str = "bearer"






