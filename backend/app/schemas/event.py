"""
Event 스키마
이벤트 로깅 관련 요청/응답 모델
"""

from datetime import datetime
from typing import Optional, List, Any
from pydantic import BaseModel, Field


class EventCreate(BaseModel):
    """이벤트 생성 요청"""

    event_type: str = Field(..., pattern="^(page_view|form_impression|form_submit|unlock_success|unlock_fail|scroll_depth|blackout_applied|blackout_failed)$")
    project_id: str
    data: Optional[dict] = None


class EventBatchCreate(BaseModel):
    """이벤트 배치 생성 요청"""

    events: List[EventCreate]


class EventResponse(BaseModel):
    """이벤트 응답"""

    success: bool = True






