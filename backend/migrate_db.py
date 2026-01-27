"""
데이터베이스 마이그레이션 유틸리티
기존 데이터베이스에 누락된 컬럼을 추가합니다.
"""

import asyncio
import sys
from sqlalchemy import text
from app.core.database import engine
from app.core.config import settings


async def migrate_database():
    """데이터베이스 스키마 마이그레이션"""
    print("🔄 데이터베이스 마이그레이션 시작...")
    
    try:
        async with engine.begin() as conn:
            # projects 테이블에 theme_config 컬럼이 있는지 확인
            result = await conn.execute(
                text("PRAGMA table_info(projects)")
            )
            columns = {row[1]: row for row in result.fetchall()}
            
            if "theme_config" not in columns:
                print("📝 projects 테이블에 theme_config 컬럼 추가 중...")
                await conn.execute(
                    text("""
                        ALTER TABLE projects 
                        ADD COLUMN theme_config TEXT 
                        DEFAULT '{"primary_color": "#FF5A1F"}'
                    """)
                )
                print("✅ theme_config 컬럼이 추가되었습니다.")
            else:
                print("✅ theme_config 컬럼이 이미 존재합니다.")
            
            # 기존 레코드에 기본값 설정
            await conn.execute(
                text("""
                    UPDATE projects 
                    SET theme_config = '{"primary_color": "#FF5A1F"}' 
                    WHERE theme_config IS NULL OR theme_config = ''
                """)
            )
        
        print("✅ 마이그레이션 완료!")
    finally:
        # 엔진 연결 정리
        await engine.dispose()


async def recreate_database():
    """데이터베이스 재생성 (주의: 모든 데이터 삭제)"""
    print("⚠️  데이터베이스를 재생성합니다. 모든 데이터가 삭제됩니다!")
    
    try:
        from app.core.database import Base, init_db
        
        # 모든 모델 import
        from app.models import user, project, lead, event_log  # noqa: F401
        
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.drop_all)
        
        await init_db()
        print("✅ 데이터베이스가 재생성되었습니다.")
    finally:
        # 엔진 연결 정리
        await engine.dispose()


if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "recreate":
        asyncio.run(recreate_database())
    else:
        asyncio.run(migrate_database())
