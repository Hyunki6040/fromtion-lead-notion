#!/bin/bash

# FORMTION 개발 모드 실행 스크립트
# Ctrl+C로 종료할 수 있습니다.

set -e

echo "🛠️  FORMTION 개발 모드 시작 중..."

# 디렉토리 설정
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$SCRIPT_DIR/backend"
FRONTEND_DIR="$SCRIPT_DIR/frontend"

# 환경 변수 파일 복사 (없으면)
if [ ! -f "$BACKEND_DIR/.env" ]; then
    if [ -f "$BACKEND_DIR/env.template" ]; then
        cp "$BACKEND_DIR/env.template" "$BACKEND_DIR/.env"
        echo "📝 .env 파일이 생성되었습니다."
    fi
fi

# uv 설치 확인
if ! command -v uv &> /dev/null; then
    echo "❌ uv가 설치되어 있지 않습니다."
    echo "설치: curl -LsSf https://astral.sh/uv/install.sh | sh"
    exit 1
fi

# Python 패키지 설치 (uv 사용)
echo "📦 Python 패키지 설치 중..."
cd "$BACKEND_DIR"
uv sync

# 데이터베이스 마이그레이션 (스키마 업데이트)
echo "📊 데이터베이스 마이그레이션 확인 중..."
cd "$BACKEND_DIR"
if [ -f "formtion.db" ]; then
    echo "  기존 데이터베이스 발견. 마이그레이션 실행..."
    uv run python migrate_db.py || echo "  마이그레이션 스크립트가 없습니다. (무시 가능)"
else
    echo "  새 데이터베이스가 시작 시 자동으로 생성됩니다."
fi

# 프론트엔드 의존성 설치
if [ ! -d "$FRONTEND_DIR/node_modules" ]; then
    echo "📦 프론트엔드 패키지 설치 중..."
    cd "$FRONTEND_DIR"
    npm install
fi

# 프로세스 종료 함수
cleanup() {
    echo ""
    echo "🛑 서버 종료 중..."
    
    # 백엔드 종료
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null || true
    fi
    
    # 프론트엔드 종료
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null || true
    fi
    
    echo "👋 FORMTION이 종료되었습니다."
    exit 0
}

# Ctrl+C 핸들러
trap cleanup SIGINT SIGTERM

echo ""
echo "✅ FORMTION 개발 서버가 시작됩니다!"
echo ""
echo "📡 백엔드 API: http://localhost:8000"
echo "🌐 프론트엔드: http://localhost:3002"
echo "📚 API 문서: http://localhost:8000/docs"
echo ""
echo "종료하려면 Ctrl+C를 누르세요."
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 백엔드 시작 (uv run 사용)
cd "$BACKEND_DIR"
uv run uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!

# 잠시 대기 (백엔드 시작 대기)
sleep 2

# 프론트엔드 시작
cd "$FRONTEND_DIR"
npm run dev &
FRONTEND_PID=$!

# 프로세스들이 종료될 때까지 대기
wait
