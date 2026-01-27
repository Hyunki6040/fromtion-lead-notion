"""
FORMTION 메인 애플리케이션
FastAPI 앱 설정 및 라우터 등록
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from app.core.config import settings
from app.core.database import init_db
from app.api.auth import router as auth_router
from app.api.projects import router as projects_router, public_router as public_projects_router
from app.api.leads import router as leads_router
from app.api.events import router as events_router
from app.api.webhooks import router as webhooks_router
from app.api.notion import router as notion_router
from app.api.bookmarks import router as bookmarks_router


# Rate Limiter 설정
limiter = Limiter(key_func=get_remote_address)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """애플리케이션 라이프사이클 관리"""
    # 시작 시
    await init_db()
    print(f"🚀 {settings.APP_NAME} v{settings.APP_VERSION} 시작")
    print(f"📡 API 문서: http://{settings.HOST}:{settings.PORT}/docs")
    yield
    # 종료 시
    print(f"👋 {settings.APP_NAME} 종료")


# FastAPI 앱 생성
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Notion 콘텐츠 블라인드 + 리드 수집 게이트 도구 (MVP)",
    lifespan=lifespan,
)

# Rate Limiter 등록
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# CORS 미들웨어
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# 전역 예외 핸들러
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """전역 예외 핸들러"""
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "서버 내부 오류가 발생했습니다."},
    )


# 라우터 등록
app.include_router(auth_router)
app.include_router(projects_router)
app.include_router(public_projects_router)
app.include_router(leads_router)
app.include_router(events_router)
app.include_router(webhooks_router)
app.include_router(notion_router)
app.include_router(bookmarks_router)


# 헬스 체크
@app.get("/health")
async def health_check():
    """헬스 체크 엔드포인트"""
    return {"status": "healthy", "app": settings.APP_NAME, "version": settings.APP_VERSION}


# 루트
@app.get("/")
async def root():
    """루트 엔드포인트"""
    return {
        "message": f"Welcome to {settings.APP_NAME}",
        "version": settings.APP_VERSION,
        "docs": "/docs",
    }


