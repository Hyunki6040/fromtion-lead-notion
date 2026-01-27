# 9) 데이터 스펙 (MVP)

## 개요

MVP에서 사용하는 데이터 모델과 스키마를 정의한다. 데이터베이스 구조, API 요청/응답 형식, 클라이언트 측 저장 형식을 포함한다.

---

## 9.1 엔티티

### 9.1.1 Project (프로젝트)

#### 설명
운영자가 생성한 각각의 리드 수집 프로젝트를 나타낸다.

#### 스키마
```typescript
interface Project {
  project_id: string;           // UUID, Primary Key
  owner_id: string;             // User ID, Foreign Key
  name: string;                 // 프로젝트 이름 (사용자가 입력, 기본값: Notion 페이지 제목)
  notion_url: string;           // Notion 공개 공유 링크
  public_slug: string;          // 공유 링크 슬러그 (예: "abc123")
  ux_config: UXConfig;          // JSON, UX 패턴 설정
  blind_config: BlindConfig;    // JSON, 블라인드 설정
  form_config: FormConfig;      // JSON, 폼 설정
  created_at: Date;             // 생성일시
  updated_at: Date;             // 수정일시
  deleted_at?: Date;            // Soft delete (선택)
}
```

#### 필드 상세

**project_id**
- 타입: UUID (string)
- 설명: 프로젝트 고유 식별자
- 생성: 서버에서 자동 생성

**owner_id**
- 타입: string (User ID)
- 설명: 프로젝트 소유자
- Foreign Key: User 테이블

**name**
- 타입: string
- 설명: 프로젝트 이름
- 기본값: Notion 페이지 제목 (자동 추출) 또는 "Untitled Project"
- 최대 길이: 100자

**notion_url**
- 타입: string (URL)
- 설명: Notion 공개 공유 링크
- 유효성 검사: URL 형식, Notion 도메인 확인

**public_slug**
- 타입: string
- 설명: 공유 링크의 슬러그 (예: "abc123")
- 형식: 영문, 숫자, 하이픈만 허용
- 길이: 6-50자
- 고유성: 전역적으로 고유해야 함

**ux_config**
- 타입: JSON (UXConfig)
- 설명: UX 패턴 설정
- 예시:
```json
{
  "top_form": {
    "enabled": true,
    "title": "이 템플릿, 바로 써도 됩니다.",
    "subtitle": "짧게 입력하면 블러가 즉시 풀립니다."
  },
  "bottom_form": {
    "enabled": false
  },
  "entry_modal": {
    "enabled": false
  },
  "floating_cta": {
    "enabled": true,
    "label": "Unlock",
    "mobile_bottom_fixed": true
  },
  "inline_blur_gate": {
    "enabled": false
  }
}
```

**blind_config**
- 타입: JSON (BlindConfig)
- 설명: 블라인드 설정
- 예시:
```json
{
  "method": "preview-then-blur",
  "preset": "middle",
  "position": 50,
  "intensity": "medium",
  "preview_height": 3,
  "keyword_blackout": {
    "enabled": false,
    "keywords": [],
    "case_sensitive": false
  }
}
```

**form_config**
- 타입: JSON (FormConfig)
- 설명: 폼 필드 및 동의 옵션 설정
- 예시:
```json
{
  "fields": {
    "email": {
      "enabled": true,
      "required": true
    },
    "name": {
      "enabled": true,
      "required": false
    },
    "company": {
      "enabled": true,
      "required": false
    },
    "role": {
      "enabled": true,
      "required": false,
      "options": ["CEO/Founder", "마케팅 담당자", "세일즈 담당자", "기타"]
    },
    "free_text": {
      "enabled": false,
      "required": false,
      "label": "지금 어떤 상황인가요?"
    }
  },
  "consent": {
    "privacy": {
      "enabled": true,
      "required": true
    },
    "marketing": {
      "enabled": false,
      "required": false
    }
  },
  "unlock_duration": 30
}
```

**created_at, updated_at**
- 타입: Date (ISO 8601)
- 설명: 생성/수정 일시
- 자동 관리: 서버에서 자동 설정/업데이트

---

### 9.1.2 Lead (리드)

#### 설명
수집된 리드 정보를 저장한다.

#### 스키마
```typescript
interface Lead {
  lead_id: string;              // UUID, Primary Key
  project_id: string;           // Project ID, Foreign Key
  email: string;                // 이메일 (필수)
  name?: string;                // 이름 (선택)
  company?: string;             // 회사명 (선택)
  role?: string;                // 직무 (선택)
  free_text?: string;           // 한 줄 질문 답변 (선택)
  consent_privacy: boolean;     // 개인정보 처리 동의
  consent_marketing: boolean;   // 마케팅 수신 동의
  source_utm: UTMParams;        // JSON, UTM 파라미터
  user_agent?: string;          // User-Agent (선택)
  ip_address?: string;          // IP 주소 (선택, 개인정보 보호 고려)
  created_at: Date;             // 생성일시
  dedupe_key: string;           // 중복 검증 키 (email + project_id)
}
```

#### 필드 상세

**lead_id**
- 타입: UUID (string)
- 설명: 리드 고유 식별자
- 생성: 서버에서 자동 생성

**project_id**
- 타입: string (Project ID)
- 설명: 속한 프로젝트
- Foreign Key: Project 테이블

**email**
- 타입: string
- 설명: 이메일 주소 (필수)
- 유효성 검사: 이메일 형식
- 최대 길이: 255자
- 인덱스: 검색 최적화

**name, company, role, free_text**
- 타입: string (optional)
- 설명: 선택 필드
- 최대 길이:
  - name: 100자
  - company: 100자
  - role: 50자
  - free_text: 500자

**consent_privacy, consent_marketing**
- 타입: boolean
- 설명: 동의 여부
- 기본값: false

**source_utm**
- 타입: JSON (UTMParams)
- 설명: UTM 파라미터
- 예시:
```json
{
  "utm_source": "linkedin",
  "utm_medium": "social",
  "utm_campaign": "template_2024",
  "utm_term": "optional",
  "utm_content": "optional"
}
```

**user_agent, ip_address**
- 타입: string (optional)
- 설명: 분석용 데이터 (개인정보 보호 고려)
- 저장 여부: 운영자 설정 또는 기본값 OFF

**dedupe_key**
- 타입: string
- 설명: 중복 검증 키 (email + project_id 조합)
- 형식: `{email}_{project_id}` (해시 또는 평문)
- 인덱스: Unique 제약 조건

**created_at**
- 타입: Date (ISO 8601)
- 설명: 리드 수집 일시
- 자동 관리: 서버에서 자동 설정

---

### 9.1.3 User (사용자/운영자)

#### 설명
FORMTION 서비스를 사용하는 운영자 계정 정보를 저장한다.

#### 스키마
```typescript
interface User {
  user_id: string;              // UUID, Primary Key
  email: string;                // 이메일 (로그인 ID)
  password_hash: string;        // 비밀번호 해시
  name?: string;                // 이름 (선택)
  created_at: Date;             // 생성일시
  updated_at: Date;             // 수정일시
  last_login_at?: Date;         // 마지막 로그인 일시
}
```

#### 필드 상세

**user_id**
- 타입: UUID (string)
- 설명: 사용자 고유 식별자
- 생성: 서버에서 자동 생성

**email**
- 타입: string
- 설명: 이메일 (로그인 ID)
- 유효성 검사: 이메일 형식
- 고유성: 전역적으로 고유해야 함
- 인덱스: Unique

**password_hash**
- 타입: string
- 설명: 비밀번호 해시 (bcrypt 등)
- 저장: 평문 비밀번호는 절대 저장하지 않음

**name**
- 타입: string (optional)
- 설명: 사용자 이름
- 최대 길이: 100자

**created_at, updated_at, last_login_at**
- 타입: Date (ISO 8601)
- 설명: 생성/수정/마지막 로그인 일시
- 자동 관리: 서버에서 자동 설정/업데이트

---

### 9.1.4 UnlockSession (클라이언트 중심, 서버는 최소)

#### 설명
클라이언트 측에서 unlocked 상태를 저장하는 방식이다. 서버에서는 최소한의 정보만 저장하거나 저장하지 않을 수 있다.

#### 클라이언트 측 저장 (localStorage/Cookie)

**localStorage 형식**
```javascript
{
  'unlocked_{project_id}': 'true',
  'unlocked_at_{project_id}': '1234567890',      // timestamp
  'unlock_expires_{project_id}': '1234567890'    // timestamp
}
```

**Cookie 형식**
```
unlocked_{project_id}=true; expires=Wed, 31 Jan 2024 23:59:59 GMT; path=/
```

#### 서버 측 저장 (선택, MVP에서는 제외 가능)
- MVP에서는 서버 측 저장 제외 (악용 방지는 후순위)
- 추후 필요 시 추가 가능:
  - IP 주소 기반 제한
  - Device fingerprinting
  - Rate limiting

---

## 9.2 이벤트/로그 (분석)

### 9.2.1 이벤트 타입

#### 설명
사용자 행동을 추적하기 위한 이벤트 로그이다. MVP에서는 기본적인 이벤트만 수집한다.

#### 이벤트 목록

**page_view**
- 설명: 페이지 조회
- 트리거: 공유 링크 페이지 로드 완료
- 데이터:
```json
{
  "event": "page_view",
  "project_id": "abc123",
  "timestamp": "2024-01-01T00:00:00Z",
  "user_agent": "...",
  "ip_address": "...",
  "utm_params": {...}
}
```

**form_impression**
- 설명: 폼 노출 (위치별)
- 트리거: 폼이 화면에 표시됨
- 데이터:
```json
{
  "event": "form_impression",
  "project_id": "abc123",
  "form_location": "top|bottom|modal|cta|inline",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

**form_submit**
- 설명: 폼 제출 시도
- 트리거: 폼 제출 버튼 클릭
- 데이터:
```json
{
  "event": "form_submit",
  "project_id": "abc123",
  "form_location": "top|bottom|modal|cta|inline",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

**unlock_success**
- 설명: 블라인드 해제 성공
- 트리거: 폼 제출 성공 후 블라인드 해제
- 데이터:
```json
{
  "event": "unlock_success",
  "project_id": "abc123",
  "lead_id": "def456",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

**unlock_fail**
- 설명: 블라인드 해제 실패
- 트리거: 폼 제출 실패
- 데이터:
```json
{
  "event": "unlock_fail",
  "project_id": "abc123",
  "error": "validation_error|network_error|server_error",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

**scroll_depth**
- 설명: 스크롤 깊이 (25%, 50%, 75%, 90%)
- 트리거: 스크롤 깊이 도달
- 데이터:
```json
{
  "event": "scroll_depth",
  "project_id": "abc123",
  "depth": 25|50|75|90,
  "timestamp": "2024-01-01T00:00:00Z"
}
```

**blackout_applied**
- 설명: 키워드 블랙아웃 적용 성공
- 트리거: 키워드 블랙아웃 성공
- 데이터:
```json
{
  "event": "blackout_applied",
  "project_id": "abc123",
  "keywords_count": 5,
  "timestamp": "2024-01-01T00:00:00Z"
}
```

**blackout_failed**
- 설명: 키워드 블랙아웃 실패 (폴백 발생)
- 트리거: 키워드 블랙아웃 실패, Section Blur로 폴백
- 데이터:
```json
{
  "event": "blackout_failed",
  "project_id": "abc123",
  "error": "cors_error|dom_structure_changed|keyword_not_found",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

---

### 9.2.2 이벤트 저장

#### 클라이언트 측
- 클라이언트에서 이벤트 수집
- 배치 전송 (예: 10개씩 또는 5초마다)
- 또는 실시간 전송 (중요한 이벤트)

#### 서버 측
- 이벤트 로그 테이블 또는 로그 파일에 저장
- 분석 도구 연동 (선택, MVP에서는 기본 분석만)

---

## 9.3 API 스펙

### 9.3.1 프로젝트 API

#### GET /api/projects
- 설명: 프로젝트 목록 조회
- 인증: Required (JWT)
- 응답:
```json
{
  "projects": [
    {
      "project_id": "abc123",
      "name": "My Project",
      "notion_url": "https://...",
      "public_slug": "abc123",
      "created_at": "2024-01-01T00:00:00Z",
      "lead_count": 10
    }
  ]
}
```

#### GET /api/projects/:project_id
- 설명: 프로젝트 상세 조회
- 인증: Required (JWT)
- 응답:
```json
{
  "project_id": "abc123",
  "name": "My Project",
  "notion_url": "https://...",
  "public_slug": "abc123",
  "ux_config": {...},
  "blind_config": {...},
  "form_config": {...},
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

#### GET /api/public/projects/:slug
- 설명: 공개 프로젝트 설정 조회 (공유 링크)
- 인증: Not required
- 응답:
```json
{
  "project_id": "abc123",
  "notion_url": "https://...",
  "ux_config": {...},
  "blind_config": {...},
  "form_config": {...}
}
```

#### POST /api/projects
- 설명: 프로젝트 생성
- 인증: Required (JWT)
- 요청:
```json
{
  "name": "My Project",
  "notion_url": "https://...",
  "public_slug": "abc123",
  "ux_config": {...},
  "blind_config": {...},
  "form_config": {...}
}
```
- 응답:
```json
{
  "project_id": "abc123",
  "public_slug": "abc123",
  "created_at": "2024-01-01T00:00:00Z"
}
```

#### PUT /api/projects/:project_id
- 설명: 프로젝트 수정
- 인증: Required (JWT)
- 요청: Project 객체 (부분 업데이트 가능)
- 응답: 업데이트된 Project 객체

#### DELETE /api/projects/:project_id
- 설명: 프로젝트 삭제 (Soft delete)
- 인증: Required (JWT)
- 응답:
```json
{
  "success": true
}
```

---

### 9.3.2 리드 API

#### POST /api/leads
- 설명: 리드 생성 (폼 제출)
- 인증: Not required (공개 API)
- 요청:
```json
{
  "project_id": "abc123",
  "email": "user@example.com",
  "name": "홍길동",
  "company": "회사명",
  "role": "마케팅 담당자",
  "free_text": "질문 답변",
  "consent_privacy": true,
  "consent_marketing": false,
  "utm_params": {
    "utm_source": "linkedin",
    "utm_medium": "social"
  }
}
```
- 응답:
```json
{
  "lead_id": "def456",
  "success": true,
  "unlocked": true
}
```

#### GET /api/projects/:project_id/leads
- 설명: 프로젝트의 리드 목록 조회
- 인증: Required (JWT, 프로젝트 소유자만)
- 쿼리 파라미터:
  - `page`: 페이지 번호 (기본: 1)
  - `limit`: 페이지당 개수 (기본: 50)
  - `search`: 검색어 (이메일, 이름, 회사명)
  - `date_from`: 시작일 (ISO 8601)
  - `date_to`: 종료일 (ISO 8601)
- 응답:
```json
{
  "leads": [
    {
      "lead_id": "def456",
      "email": "user@example.com",
      "name": "홍길동",
      "company": "회사명",
      "role": "마케팅 담당자",
      "consent_privacy": true,
      "consent_marketing": false,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 100,
  "page": 1,
  "limit": 50
}
```

#### GET /api/projects/:project_id/leads/export
- 설명: 리드 CSV 내보내기
- 인증: Required (JWT, 프로젝트 소유자만)
- 응답: CSV 파일 (Content-Type: text/csv)

---

### 9.3.3 인증 API

#### POST /api/auth/register
- 설명: 사용자 가입
- 인증: Not required
- 요청:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "홍길동"
}
```
- 응답:
```json
{
  "user_id": "ghi789",
  "email": "user@example.com",
  "token": "jwt_token_here"
}
```

#### POST /api/auth/login
- 설명: 사용자 로그인
- 인증: Not required
- 요청:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```
- 응답:
```json
{
  "user_id": "ghi789",
  "email": "user@example.com",
  "token": "jwt_token_here"
}
```

---

### 9.3.4 Webhook API

#### POST /api/webhooks/test
- 설명: Webhook 테스트 전송
- 인증: Required (JWT)
- 요청:
```json
{
  "project_id": "abc123",
  "webhook_url": "https://..."
}
```
- 응답:
```json
{
  "success": true,
  "status_code": 200,
  "response": "..."
}
```

---

## 9.4 데이터베이스 설계

### 9.4.1 테이블 관계도

```
User
  └─< Project (owner_id)
        └─< Lead (project_id)

EventLog (선택, 별도 테이블 또는 로그 파일)
  └─< Project (project_id)
```

### 9.4.2 인덱스

#### Project 테이블
- `project_id`: Primary Key
- `owner_id`: Index (Foreign Key)
- `public_slug`: Unique Index
- `created_at`: Index (정렬)

#### Lead 테이블
- `lead_id`: Primary Key
- `project_id`: Index (Foreign Key)
- `email`: Index (검색)
- `dedupe_key`: Unique Index
- `created_at`: Index (정렬, 날짜 범위 조회)

#### User 테이블
- `user_id`: Primary Key
- `email`: Unique Index

---

## 9.5 데이터 보안 및 개인정보 보호

### 9.5.1 암호화
- 비밀번호: bcrypt 해시 (salt rounds: 10)
- 민감 정보: 필요 시 암호화 저장 (선택)

### 9.5.2 개인정보 보호
- IP 주소: 저장하지 않거나 익명화 (선택)
- 이메일: 암호화 또는 마스킹 (선택)
- GDPR 준수: 데이터 삭제 요청 처리 (추후 추가)

### 9.5.3 접근 제어
- 프로젝트: 소유자만 접근 가능
- 리드: 프로젝트 소유자만 조회 가능
- 공개 API: Rate limiting 적용


