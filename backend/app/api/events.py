"""
이벤트 API
사용자 행동 이벤트 로깅
"""

from fastapi import APIRouter, Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models.event_log import EventLog
from app.schemas.event import EventCreate, EventBatchCreate, EventResponse

router = APIRouter(prefix="/api/events", tags=["이벤트"])


@router.post("", response_model=EventResponse)
async def create_event(
    event_data: EventCreate,
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    """
    이벤트 생성

    - 공개 API (인증 불필요)
    - 사용자 행동 추적용
    """
    event = EventLog(
        event_type=event_data.event_type,
        project_id=event_data.project_id,
        data=event_data.data,
        user_agent=request.headers.get("user-agent"),
        ip_address=request.client.host if request.client else None,
    )

    db.add(event)
    await db.commit()

    return EventResponse(success=True)


@router.post("/batch", response_model=EventResponse)
async def create_events_batch(
    batch_data: EventBatchCreate,
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    """
    이벤트 배치 생성

    - 공개 API (인증 불필요)
    - 여러 이벤트 한 번에 저장
    """
    user_agent = request.headers.get("user-agent")
    ip_address = request.client.host if request.client else None

    events = [
        EventLog(
            event_type=event.event_type,
            project_id=event.project_id,
            data=event.data,
            user_agent=user_agent,
            ip_address=ip_address,
        )
        for event in batch_data.events
    ]

    db.add_all(events)
    await db.commit()

    return EventResponse(success=True)






