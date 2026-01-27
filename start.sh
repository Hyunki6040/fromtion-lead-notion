#!/bin/bash

# FORMTION 프로덕션 모드 실행 스크립트
# 백그라운드에서 실행됩니다.

set -e

echo "🚀 FORMTION 시작 중..."

# 디렉토리 설정
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$SCRIPT_DIR/backend"
FRONTEND_DIR="$SCRIPT_DIR/frontend"
PID_DIR="$SCRIPT_DIR/.pids"

# PID 디렉토리 생성
mkdir -p "$PID_DIR"

# 로그 디렉토리 생성
mkdir -p "$SCRIPT_DIR/logs"

# 환경 변수 파일 복사 (없으면)
if [ ! -f "$BACKEND_DIR/.env" ]; then
    if [ -f "$BACKEND_DIR/env.template" ]; then
        cp "$BACKEND_DIR/env.template" "$BACKEND_DIR/.env"
        echo "📝 .env 파일이 생성되었습니다. 필요시 수정해주세요."
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
if [ -f "$BACKEND_DIR/formtion.db" ]; then
    echo "📊 데이터베이스 마이그레이션 확인 중..."
    cd "$BACKEND_DIR"
    uv run python migrate_db.py || echo "  마이그레이션 스크립트가 없습니다. (무시 가능)"
fi

# 프론트엔드 의존성 설치
if [ ! -d "$FRONTEND_DIR/node_modules" ]; then
    echo "📦 프론트엔드 패키지 설치 중..."
    cd "$FRONTEND_DIR"
    npm install --silent
fi

# 프론트엔드 빌드
echo "🔨 프론트엔드 빌드 중..."
cd "$FRONTEND_DIR"
npm run build --silent

# 백엔드 시작 (백그라운드, uv run 사용)
echo "🖥️  백엔드 서버 시작 중..."
cd "$BACKEND_DIR"
nohup uv run uvicorn app.main:app --host 0.0.0.0 --port 8000 > "$SCRIPT_DIR/logs/backend.log" 2>&1 &
echo $! > "$PID_DIR/backend.pid"

# 프론트엔드 정적 파일 서빙 (Vite 프리뷰 사용)
echo "🌐 프론트엔드 서버 시작 중..."
cd "$FRONTEND_DIR"
nohup npm run preview -- --port 3000 --host > "$SCRIPT_DIR/logs/frontend.log" 2>&1 &
echo $! > "$PID_DIR/frontend.pid"

echo ""
echo "✅ FORMTION이 시작되었습니다!"
echo ""
echo "📡 백엔드 API: http://localhost:8000"
echo "🌐 프론트엔드: http://localhost:3000"
echo "📚 API 문서: http://localhost:8000/docs"
echo ""
echo "로그 확인:"
echo "  tail -f logs/backend.log"
echo "  tail -f logs/frontend.log"
echo ""
echo "종료하려면: ./stop.sh"
