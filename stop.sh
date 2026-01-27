#!/bin/bash

# FORMTION 서버 종료 스크립트

echo "🛑 FORMTION 종료 중..."

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PID_DIR="$SCRIPT_DIR/.pids"

# 백엔드 종료
if [ -f "$PID_DIR/backend.pid" ]; then
    BACKEND_PID=$(cat "$PID_DIR/backend.pid")
    if kill -0 $BACKEND_PID 2>/dev/null; then
        kill $BACKEND_PID
        echo "✓ 백엔드 서버 종료됨 (PID: $BACKEND_PID)"
    else
        echo "! 백엔드 서버가 이미 종료됨"
    fi
    rm -f "$PID_DIR/backend.pid"
else
    echo "! 백엔드 PID 파일 없음"
fi

# 프론트엔드 종료
if [ -f "$PID_DIR/frontend.pid" ]; then
    FRONTEND_PID=$(cat "$PID_DIR/frontend.pid")
    if kill -0 $FRONTEND_PID 2>/dev/null; then
        kill $FRONTEND_PID
        echo "✓ 프론트엔드 서버 종료됨 (PID: $FRONTEND_PID)"
    else
        echo "! 프론트엔드 서버가 이미 종료됨"
    fi
    rm -f "$PID_DIR/frontend.pid"
else
    echo "! 프론트엔드 PID 파일 없음"
fi

# 포트로 프로세스 찾아서 종료 (백업)
echo ""
echo "포트 8000, 3000에서 실행 중인 프로세스 확인 중..."

# 포트 8000 (백엔드)
PORT_8000_PID=$(lsof -ti :8000 2>/dev/null || true)
if [ ! -z "$PORT_8000_PID" ]; then
    kill $PORT_8000_PID 2>/dev/null || true
    echo "✓ 포트 8000 프로세스 종료됨"
fi

# 포트 3000 (프론트엔드)
PORT_3000_PID=$(lsof -ti :3000 2>/dev/null || true)
if [ ! -z "$PORT_3000_PID" ]; then
    kill $PORT_3000_PID 2>/dev/null || true
    echo "✓ 포트 3000 프로세스 종료됨"
fi

echo ""
echo "👋 FORMTION이 종료되었습니다."


