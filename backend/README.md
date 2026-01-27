# FORMTION Backend

Notion 콘텐츠 블라인드 + 리드 수집 게이트 도구의 백엔드 API 서버입니다.

## 기술 스택

- **Framework**: FastAPI
- **Database**: SQLite (aiosqlite)
- **Authentication**: JWT (python-jose)
- **Package Manager**: uv

## 설치 및 실행

```bash
# 패키지 설치
uv sync

# 개발 서버 실행
uv run uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

# 또는 간단히
uv run python -m uvicorn app.main:app --reload
```

## 환경 설정

```bash
# .env 파일 생성
cp env.template .env

# 필요시 .env 파일 수정
```

## API 문서

서버 실행 후 다음 URL에서 API 문서를 확인할 수 있습니다:

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc


