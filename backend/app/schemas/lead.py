"""
Lead 스키마
리드 관련 요청/응답 모델
"""

from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field


class UTMParams(BaseModel):
    """UTM 파라미터"""

    utm_source: Optional[str] = None
    utm_medium: Optional[str] = None
    utm_campaign: Optional[str] = None
    utm_term: Optional[str] = None
    utm_content: Optional[str] = None


class LeadCreate(BaseModel):
    """리드 생성 요청"""

    project_id: str
    email: EmailStr
    name: Optional[str] = Field(None, max_length=100)
    company: Optional[str] = Field(None, max_length=100)
    role: Optional[str] = Field(None, max_length=50)
    consent_privacy: bool = True
    consent_marketing: bool = False
    utm_params: Optional[UTMParams] = None
    form_location: Optional[str] = Field(None, pattern="^(top|bottom|modal|cta|inline)$")


class LeadResponse(BaseModel):
    """리드 응답"""

    lead_id: str
    email: str
    name: Optional[str] = None
    company: Optional[str] = None
    role: Optional[str] = None
    consent_privacy: bool
    consent_marketing: bool
    source_utm: Optional[dict] = None
    form_location: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class LeadListResponse(BaseModel):
    """리드 목록 응답"""

    leads: List[LeadResponse]
    total: int
    page: int
    limit: int


class LeadCreateResponse(BaseModel):
    """리드 생성 응답"""

    lead_id: str
    success: bool = True
    unlocked: bool = True
    already_unlocked: bool = False






