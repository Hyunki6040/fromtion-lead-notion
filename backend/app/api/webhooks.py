"""
Webhook API
Webhook 테스트 및 설정
"""

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, HttpUrl
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import get_db
from app.models.user import User
from app.models.project import Project
from app.schemas.lead import LeadResponse
from app.api.deps import get_current_user
from app.services.webhook import send_webhook, send_discord_webhook

router = APIRouter(prefix="/api/webhooks", tags=["Webhook"])


class WebhookTestRequest(BaseModel):
    """Webhook 테스트 요청"""

    project_id: str
    webhook_url: str
    webhook_type: str = "general"  # general, slack, discord


class WebhookTestResponse(BaseModel):
    """Webhook 테스트 응답"""

    success: bool
    status_code: int = 0
    message: str = ""


@router.post("/test", response_model=WebhookTestResponse)
async def test_webhook(
    request_data: WebhookTestRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Webhook 테스트 전송

    - 프로젝트 소유자만 가능
    - 테스트 데이터 전송 후 결과 반환
    """
    # 프로젝트 소유 확인
    result = await db.execute(
        select(Project)
        .where(Project.project_id == request_data.project_id)
        .where(Project.owner_id == current_user.user_id)
        .where(Project.deleted_at.is_(None))
    )
    project = result.scalar_one_or_none()

    if project is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="프로젝트를 찾을 수 없습니다.",
        )

    # 테스트 데이터
    test_lead_data = {
        "lead_id": "test-lead-id",
        "email": "test@example.com",
        "name": "테스트 사용자",
        "company": "테스트 회사",
        "role": "테스트 직무",
        "consent_privacy": True,
        "consent_marketing": False,
        "created_at": "2024-01-01T00:00:00Z",
    }

    # Webhook 타입에 따라 전송
    if request_data.webhook_type == "discord":
        success, status_code, message = await send_discord_webhook(
            request_data.webhook_url,
            test_lead_data,
            project_name=project.name,
            return_details=True,
        )
    elif request_data.webhook_type == "slack":
        slack_data = {
            "text": f"🎉 [테스트] 새로운 리드가 수집되었습니다!\n\n*이메일*: {test_lead_data['email']}\n*이름*: {test_lead_data['name']}\n*회사*: {test_lead_data['company']}\n*직무*: {test_lead_data['role']}",
        }
        success, status_code, message = await send_webhook(
            request_data.webhook_url,
            slack_data,
            return_details=True,
        )
    else:
        # General webhook
        general_data = {
            "event": "test",
            "lead": test_lead_data,
            "project_id": project.project_id,
        }
        success, status_code, message = await send_webhook(
            request_data.webhook_url,
            general_data,
            return_details=True,
        )

    return WebhookTestResponse(
        success=success,
        status_code=status_code,
        message=message,
    )






