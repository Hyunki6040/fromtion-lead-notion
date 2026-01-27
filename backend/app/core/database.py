"""
데이터베이스 연결 및 세션 관리
SQLAlchemy 비동기 엔진 설정
"""

from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.orm import declarative_base
from .config import settings

# 비동기 엔진 생성
engine = create_async_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG,
    future=True,
)

# 비동기 세션 팩토리
async_session_maker = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)

# 모델 베이스 클래스
Base = declarative_base()


async def get_db() -> AsyncSession:
    """
    데이터베이스 세션 의존성

    Yields:
        AsyncSession: 데이터베이스 세션
    """
    async with async_session_maker() as session:
        try:
            yield session
        finally:
            await session.close()


async def init_db(force_recreate: bool = False):
    """
    데이터베이스 테이블 초기화
    
    Args:
        force_recreate: True면 기존 테이블을 삭제하고 재생성 (주의: 데이터 손실)
    """
    # 모든 모델을 import하여 메타데이터에 등록
    from app.models import user, project, lead, event_log, bookmark  # noqa: F401
    
    async with engine.begin() as conn:
        if force_recreate:
            # 기존 테이블 삭제 (개발 환경에서만 사용)
            print("⚠️  기존 테이블을 삭제하고 재생성합니다...")
            await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)






