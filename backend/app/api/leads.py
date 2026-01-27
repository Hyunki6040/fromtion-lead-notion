"""
리드 API
리드 수집, 목록 조회, CSV 내보내기
"""

import csv
import io
from datetime import datetime
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query, Request
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlalchemy.exc import IntegrityError

from app.core.database import get_db
from app.models.user import User
from app.models.project import Project
from app.models.lead import Lead
from app.schemas.lead import LeadCreate, LeadResponse, LeadListResponse, LeadCreateResponse
from app.api.deps import get_current_user
from app.services.webhook import send_webhook, send_discord_webhook

router = APIRouter(prefix="/api", tags=["리드"])


@router.post("/leads", response_model=LeadCreateResponse, status_code=status.HTTP_201_CREATED)
async def create_lead(
    lead_data: LeadCreate,
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    """
    리드 생성 (폼 제출)

    - 공개 API (인증 불필요)
    - 프로젝트 유효성 확인
    - 중복 이메일 처리 (중복 시 기존 리드 반환)
    - Webhook 전송
    """
    # 프로젝트 조회
    result = await db.execute(
        select(Project)
        .where(Project.project_id == lead_data.project_id)
        .where(Project.deleted_at.is_(None))
    )
    project = result.scalar_one_or_none()

    if project is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="프로젝트를 찾을 수 없습니다.",
        )

    # 중복 검증 키 생성
    dedupe_key = Lead.generate_dedupe_key(lead_data.email, lead_data.project_id)

    # 이미 존재하는 리드인지 확인
    existing_result = await db.execute(
        select(Lead).where(Lead.dedupe_key == dedupe_key)
    )
    existing_lead = existing_result.scalar_one_or_none()

    if existing_lead:
        # 이미 존재하는 리드 - 해제된 상태로 반환
        return LeadCreateResponse(
            lead_id=existing_lead.lead_id,
            success=True,
            unlocked=True,
            already_unlocked=True,
        )

    # 리드 생성
    lead = Lead(
        project_id=lead_data.project_id,
        email=lead_data.email,
        name=lead_data.name,
        company=lead_data.company,
        role=lead_data.role,
        consent_privacy=lead_data.consent_privacy,
        consent_marketing=lead_data.consent_marketing,
        source_utm=lead_data.utm_params.model_dump() if lead_data.utm_params else None,
        form_location=lead_data.form_location,
        user_agent=request.headers.get("user-agent"),
        ip_address=request.client.host if request.client else None,
        dedupe_key=dedupe_key,
    )

    try:
        db.add(lead)
        await db.commit()
        await db.refresh(lead)
    except IntegrityError:
        # 동시 요청으로 인한 중복 시
        await db.rollback()
        existing_result = await db.execute(
            select(Lead).where(Lead.dedupe_key == dedupe_key)
        )
        existing_lead = existing_result.scalar_one_or_none()
        if existing_lead:
            return LeadCreateResponse(
                lead_id=existing_lead.lead_id,
                success=True,
                unlocked=True,
                already_unlocked=True,
            )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="리드 생성 중 오류가 발생했습니다.",
        )

    # Webhook 전송 (비동기, 실패해도 에러 반환 안함)
    if project.webhook_url:
        await send_webhook(
            project.webhook_url,
            {
                "event": "lead_created",
                "lead": {
                    "lead_id": lead.lead_id,
                    "email": lead.email,
                    "name": lead.name,
                    "company": lead.company,
                    "role": lead.role,
                    "consent_privacy": lead.consent_privacy,
                    "consent_marketing": lead.consent_marketing,
                    "source_utm": lead.source_utm,
                    "created_at": lead.created_at.isoformat(),
                },
                "project_id": project.project_id,
            },
        )

    # Slack Webhook 전송
    if project.slack_webhook_url:
        await send_webhook(
            project.slack_webhook_url,
            {
                "text": f"🎉 새로운 리드가 수집되었습니다!\n\n*이메일*: {lead.email}\n*이름*: {lead.name or '-'}\n*회사*: {lead.company or '-'}\n*직무*: {lead.role or '-'}",
            },
        )

    # Discord Webhook 전송
    if project.discord_webhook_url:
        await send_discord_webhook(
            project.discord_webhook_url,
            {
                "email": lead.email,
                "name": lead.name,
                "company": lead.company,
                "role": lead.role,
                "created_at": lead.created_at.isoformat(),
            },
            project_name=project.name,
        )

    return LeadCreateResponse(
        lead_id=lead.lead_id,
        success=True,
        unlocked=True,
        already_unlocked=False,
    )


@router.get("/projects/{project_id}/leads", response_model=LeadListResponse)
async def list_leads(
    project_id: str,
    page: int = Query(1, ge=1),
    limit: int = Query(50, ge=1, le=100),
    search: Optional[str] = None,
    date_from: Optional[datetime] = None,
    date_to: Optional[datetime] = None,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    프로젝트의 리드 목록 조회

    - 소유자만 조회 가능
    - 검색/필터/페이지네이션 지원
    """
    # 프로젝트 소유 확인
    project_result = await db.execute(
        select(Project)
        .where(Project.project_id == project_id)
        .where(Project.owner_id == current_user.user_id)
        .where(Project.deleted_at.is_(None))
    )
    project = project_result.scalar_one_or_none()

    if project is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="프로젝트를 찾을 수 없습니다.",
        )

    # 쿼리 구성
    query = select(Lead).where(Lead.project_id == project_id)

    # 검색
    if search:
        search_pattern = f"%{search}%"
        query = query.where(
            (Lead.email.ilike(search_pattern))
            | (Lead.name.ilike(search_pattern))
            | (Lead.company.ilike(search_pattern))
        )

    # 날짜 필터
    if date_from:
        query = query.where(Lead.created_at >= date_from)
    if date_to:
        query = query.where(Lead.created_at <= date_to)

    # 전체 개수
    count_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(count_query)
    total = total_result.scalar() or 0

    # 페이지네이션
    offset = (page - 1) * limit
    query = query.order_by(Lead.created_at.desc()).offset(offset).limit(limit)

    result = await db.execute(query)
    leads = result.scalars().all()

    return LeadListResponse(
        leads=[LeadResponse.model_validate(lead) for lead in leads],
        total=total,
        page=page,
        limit=limit,
    )


@router.get("/projects/{project_id}/leads/export")
async def export_leads(
    project_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    리드 CSV 내보내기

    - 소유자만 다운로드 가능
    - UTF-8 BOM 포함 (한글 깨짐 방지)
    """
    # 프로젝트 소유 확인
    project_result = await db.execute(
        select(Project)
        .where(Project.project_id == project_id)
        .where(Project.owner_id == current_user.user_id)
        .where(Project.deleted_at.is_(None))
    )
    project = project_result.scalar_one_or_none()

    if project is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="프로젝트를 찾을 수 없습니다.",
        )

    # 리드 조회
    result = await db.execute(
        select(Lead)
        .where(Lead.project_id == project_id)
        .order_by(Lead.created_at.desc())
    )
    leads = result.scalars().all()

    # CSV 생성
    output = io.StringIO()
    writer = csv.writer(output)

    # 헤더
    writer.writerow([
        "일시",
        "이메일",
        "이름",
        "회사명",
        "직무",
        "자유 텍스트",
        "개인정보 동의",
        "마케팅 동의",
        "UTM Source",
        "UTM Medium",
        "UTM Campaign",
        "폼 위치",
    ])

    # 데이터
    for lead in leads:
        utm = lead.source_utm or {}
        writer.writerow([
            lead.created_at.strftime("%Y-%m-%d %H:%M:%S"),
            lead.email,
            lead.name or "",
            lead.company or "",
            lead.role or "",
            "",
            "O" if lead.consent_privacy else "X",
            "O" if lead.consent_marketing else "X",
            utm.get("utm_source", ""),
            utm.get("utm_medium", ""),
            utm.get("utm_campaign", ""),
            lead.form_location or "",
        ])

    # UTF-8 BOM 추가
    csv_content = "\ufeff" + output.getvalue()

    # 파일명
    filename = f"leads_{project.public_slug}_{datetime.now().strftime('%Y%m%d')}.csv"

    return StreamingResponse(
        iter([csv_content]),
        media_type="text/csv",
        headers={
            "Content-Disposition": f"attachment; filename={filename}",
        },
    )


