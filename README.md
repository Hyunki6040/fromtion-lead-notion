# FORMTION

> Notion 콘텐츠 블라인드 + 리드 수집 게이트 도구 (MVP)

## 개요

FORMTION은 Notion 페이지를 임베드하여 콘텐츠 일부를 블라인드 처리하고, 사용자 정보를 수집하면 블라인드를 해제하는 리드 수집 도구입니다.

## 주요 기능

- 🔒 **콘텐츠 블라인드**: Notion 페이지의 특정 영역을 블러 처리
- 📧 **리드 수집**: 이메일, 이름, 회사명, 직무 등 정보 수집
- 🎨 **다양한 UX 패턴**: Top/Bottom 폼, 모달, 플로팅 CTA
- 📊 **대시보드**: 프로젝트 관리 및 리드 목록 확인
- 📤 **내보내기**: CSV 형식으로 리드 데이터 내보내기
- 🔗 **Webhook**: Slack 등 외부 서비스 연동

## 기술 스택

### 백엔드
- Python 3.11+
- FastAPI
- SQLAlchemy (SQLite)
- JWT 인증

### 프론트엔드
- React 18
- TypeScript
- Tailwind CSS
- React Router

## 시작하기

### 요구사항

- Python 3.11 이상
- Node.js 18 이상
- npm 또는 yarn

### 설치 및 실행

#### 개발 모드 (Ctrl+C로 종료)

```bash
# 실행 권한 부여
chmod +x start-dev.sh

# 개발 서버 시작
./start-dev.sh
```

#### 프로덕션 모드 (백그라운드 실행)

```bash
# 실행 권한 부여
chmod +x start.sh stop.sh

# 서버 시작
./start.sh

# 서버 종료
./stop.sh
```

### 접속 URL

- 프론트엔드: http://localhost:3000
- 백엔드 API: http://localhost:8000
- API 문서: http://localhost:8000/docs

## 프로젝트 구조

```
notion-sales-lead-mvp/
├── backend/                  # FastAPI 백엔드
│   ├── app/
│   │   ├── api/             # API 라우터
│   │   ├── core/            # 설정, 보안, DB
│   │   ├── models/          # SQLAlchemy 모델
│   │   ├── schemas/         # Pydantic 스키마
│   │   ├── services/        # 비즈니스 로직
│   │   └── main.py          # 앱 엔트리포인트
│   ├── requirements.txt
│   └── env.template
├── frontend/                 # React 프론트엔드
│   ├── src/
│   │   ├── components/      # UI 컴포넌트
│   │   ├── contexts/        # React Context
│   │   ├── layouts/         # 레이아웃
│   │   ├── lib/             # 유틸리티
│   │   └── pages/           # 페이지 컴포넌트
│   ├── package.json
│   └── vite.config.ts
├── docs/prd/                 # 제품 요구사항 문서
├── start.sh                  # 프로덕션 실행 스크립트
├── start-dev.sh              # 개발 실행 스크립트
├── stop.sh                   # 서버 종료 스크립트
└── README.md
```

## 사용 방법

### 1. 회원가입/로그인

1. http://localhost:3000 접속
2. 회원가입 또는 로그인

### 2. 프로젝트 생성

1. 대시보드에서 "새 프로젝트" 클릭
2. Notion 공개 링크 입력 (웹에 게시 상태여야 함)
3. UX 패턴 선택 (Top Form, Floating CTA 등)
4. 블라인드 설정 (블러 강도, 위치)
5. 수집 필드 설정 (이메일, 이름 등)

### 3. 공유 링크 배포

1. 프로젝트 설정 페이지에서 공유 링크 복사
2. SNS, 이메일 등으로 배포

### 4. 리드 관리

1. 프로젝트의 "리드" 탭에서 수집된 정보 확인
2. CSV로 내보내기 가능

## 환경 변수

`backend/.env` 파일에서 설정:

```env
# JWT 시크릿 (운영 환경에서는 반드시 변경)
JWT_SECRET_KEY=your-secret-key-change-in-production

# 데이터베이스
DATABASE_URL=sqlite+aiosqlite:///./formtion.db

# CORS 허용 도메인
CORS_ORIGINS=["http://localhost:3000"]
```

## 데이터베이스 마이그레이션

데이터베이스 스키마 변경 시 마이그레이션이 필요합니다.

### 자동 마이그레이션

`start-dev.sh` 또는 `start.sh` 실행 시 자동으로 마이그레이션이 실행됩니다.

### 수동 마이그레이션

```bash
cd backend
uv run python migrate_db.py
```

### 데이터베이스 재생성 (주의: 모든 데이터 삭제)

```bash
cd backend
rm formtion.db
# 그 다음 start-dev.sh 또는 start.sh 실행하면 새로 생성됩니다
```

**마이그레이션 개발 가이드**는 [`docs/database-migration.md`](./docs/database-migration.md)를 참고하세요.

**관련 파일**:
- `backend/migrate_db.py` - 마이그레이션 스크립트
- `backend/app/core/database.py` - 데이터베이스 초기화 로직
- `backend/app/models/` - SQLAlchemy 모델 정의

## API 문서

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## 라이선스

MIT License

## 문의

PRD 문서는 `docs/prd/` 디렉토리에서 확인할 수 있습니다.


