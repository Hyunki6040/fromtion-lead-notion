#!/usr/bin/env python3
"""
기본 사용자 생성 스크립트
로그인 테스트를 위한 기본 사용자를 생성합니다.
"""

import asyncio
from app.core.database import async_session_maker, init_db
from app.core.security import get_password_hash
from app.models.user import User
from sqlalchemy import select


async def create_default_user():
    """기본 사용자 생성"""

    # 데이터베이스 초기화
    await init_db()

    async with async_session_maker() as session:
        # 기존 사용자 확인
        result = await session.execute(select(User).where(User.email == "admin@formtion.com"))
        existing_user = result.scalar_one_or_none()

        if existing_user:
            print("✅ 기본 사용자가 이미 존재합니다.")
            print(f"   이메일: {existing_user.email}")
            print(f"   이름: {existing_user.name}")
            return

        # 새 사용자 생성
        admin_user = User(
            email="admin@formtion.com",
            password_hash=get_password_hash("admin123"),
            name="관리자",
        )

        session.add(admin_user)
        await session.commit()
        await session.refresh(admin_user)

        print("✅ 기본 사용자가 생성되었습니다!")
        print(f"   이메일: {admin_user.email}")
        print(f"   비밀번호: admin123")
        print(f"   이름: {admin_user.name}")
        print(f"   사용자 ID: {admin_user.user_id}")

        # 추가 테스트 사용자 생성
        test_user = User(
            email="test@formtion.com",
            password_hash=get_password_hash("test123"),
            name="테스트 사용자",
        )

        session.add(test_user)
        await session.commit()
        await session.refresh(test_user)

        print("✅ 테스트 사용자가 생성되었습니다!")
        print(f"   이메일: {test_user.email}")
        print(f"   비밀번호: test123")
        print(f"   이름: {test_user.name}")
        print(f"   사용자 ID: {test_user.user_id}")


if __name__ == "__main__":
    asyncio.run(create_default_user())