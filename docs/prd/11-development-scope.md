# 11) MVP 개발 범위 (구현 관점)

## 개요

MVP 개발 범위를 프론트엔드, 백엔드, 인프라로 구분하여 구체적으로 정의한다.

---

## 11.1 프론트엔드

### 11.1.1 핵심 기능

#### Notion iframe embed
- **기술**: iframe 태그 사용
- **기능**:
  - Notion 공개 공유 링크를 iframe으로 임베드
  - iframe 로딩 상태 처리 (로딩 스피너)
  - 로딩 완료 이벤트 감지
  - 에러 처리 (CORS, 타임아웃 등)
- **고려사항**:
  - iframe sandbox 속성 사용 여부 검토
  - 모바일에서의 반응형 처리

#### Overlay 기반 blur 처리
- **기술**: CSS `filter: blur()` 및 `backdrop-filter`
- **기능**:
  - 섹션 단위 블러 처리
  - 프리뷰 + 블러 처리
  - 블러 강도 조절 (약/중/강)
  - 그라데이션 오버레이
- **구현**:
  ```css
  .blur-section {
    position: relative;
    overflow: hidden;
  }
  .blur-section::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  }
  ```

#### Inline Gate 컴포넌트
- **기능**:
  - 블러 구간에 인라인 카드 삽입
  - 폼 필드 표시
  - 제출 처리
  - 해제 후 카드 제거/축소
- **컴포넌트 구조**:
  - BlurSection (블러 처리)
  - InlineGateCard (인라인 카드)
  - LeadForm (폼 컴포넌트)

#### Modal / Floating CTA / Top&Bottom form 컴포넌트
- **Entry Modal**:
  - 모달 오버레이
  - 모달 박스 (중앙 정렬)
  - 닫기 버튼 (설정에 따라)
  - 폼 통합
- **Floating CTA**:
  - 고정 위치 버튼 (우측 하단)
  - Drawer/Modal 오픈 트리거
  - 모바일 하단 고정
- **Top/Bottom Form**:
  - 폼 영역 (상단/하단)
  - 카피 (Title/Sub-title)
  - 폼 필드 통합

#### 상태 저장 (localStorage + cookie fallback)
- **기능**:
  - unlocked 상태 저장
  - 만료 시간 관리
  - localStorage 우선, 실패 시 쿠키 사용
- **구현**:
  ```javascript
  function saveUnlockStatus(projectId, duration) {
    try {
      const expiresAt = Date.now() + (duration * 24 * 60 * 60 * 1000);
      localStorage.setItem(`unlocked_${projectId}`, 'true');
      localStorage.setItem(`unlocked_at_${projectId}`, Date.now().toString());
      localStorage.setItem(`unlock_expires_${projectId}`, expiresAt.toString());
    } catch (error) {
      // localStorage 실패 시 쿠키 사용
      setCookie(`unlocked_${projectId}`, 'true', duration);
    }
  }
  ```

#### 모바일 반응형
- **기능**:
  - 반응형 레이아웃 (브레이크포인트: 768px)
  - 터치 친화적 버튼 크기 (최소 44x44px)
  - 모바일 최적화 Drawer
  - 키보드 처리 (키보드 올라올 때 레이아웃 조정)

---

### 11.1.2 Admin 화면

#### 프로젝트 리스트
- 프로젝트 카드 그리드
- 검색/필터/정렬
- 페이지네이션

#### 프로젝트 생성 (3-Step)
- Step 1: Notion URL 입력 및 프리뷰
- Step 2: UX 패턴 선택
- Step 3: 블라인드 설정
- 진행 표시 (Step 1/3)

#### 프로젝트 설정
- 탭 구조 (기본/폼/고급/리드)
- 실시간 저장
- 검증 및 에러 처리

#### 실시간 미리보기
- 좌측 미리보기, 우측 설정 패널
- 새로고침 버튼
- 모바일/PC 전환 토글

#### 리드 목록
- 테이블 뷰
- 검색/필터/정렬
- CSV 내보내기 버튼

---

### 11.1.3 기술 스택 (제안)

#### 프레임워크
- React (또는 Next.js)
- TypeScript

#### 상태 관리
- React Context API 또는 Zustand
- 서버 상태: React Query 또는 SWR

#### 스타일링
- Tailwind CSS (또는 CSS Modules)
- CSS-in-JS (선택)

#### 폼 관리
- React Hook Form
- Zod (유효성 검사)

#### UI 컴포넌트
- Radix UI (접근성 좋음)
- 또는 자체 컴포넌트 라이브러리

---

## 11.2 백엔드

### 11.2.1 API 엔드포인트

#### 프로젝트 API
- `GET /api/projects` - 프로젝트 목록 조회
- `GET /api/projects/:id` - 프로젝트 상세 조회
- `GET /api/public/projects/:slug` - 공개 프로젝트 설정 조회
- `POST /api/projects` - 프로젝트 생성
- `PUT /api/projects/:id` - 프로젝트 수정
- `DELETE /api/projects/:id` - 프로젝트 삭제

#### 리드 API
- `POST /api/leads` - 리드 생성 (폼 제출)
- `GET /api/projects/:id/leads` - 리드 목록 조회
- `GET /api/projects/:id/leads/export` - CSV 내보내기

#### 인증 API
- `POST /api/auth/register` - 사용자 가입
- `POST /api/auth/login` - 사용자 로그인
- `GET /api/auth/me` - 현재 사용자 정보 (선택)

#### Webhook API
- `POST /api/webhooks/test` - Webhook 테스트

---

### 11.2.2 데이터베이스

#### 테이블
- `users` - 사용자
- `projects` - 프로젝트
- `leads` - 리드
- `event_logs` - 이벤트 로그 (선택)

#### ORM/쿼리 빌더
- Prisma (추천)
- 또는 TypeORM, Drizzle

---

### 11.2.3 인증/인가

#### 인증
- JWT (JSON Web Token)
- 비밀번호 해시: bcrypt (salt rounds: 10)

#### 인가
- 프로젝트 소유자만 접근 가능
- 미들웨어로 권한 확인

---

### 11.2.4 Webhook 처리

#### 기능
- 리드 생성 시 Webhook URL로 POST 요청
- 비동기 처리 (큐 사용 또는 단순 리트라이)
- 리트라이 로직 (최대 2회)
- 에러 로깅

#### 구현 (단순 버전, MVP)
```javascript
async function sendWebhook(webhookUrl, data) {
  const maxRetries = 2;
  let retries = 0;
  
  while (retries < maxRetries) {
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (response.ok) return;
    } catch (error) {
      retries++;
      if (retries >= maxRetries) {
        // 에러 로깅
        console.error('Webhook failed:', error);
      }
    }
  }
}
```

---

### 11.2.5 CSV 내보내기

#### 기능
- 리드 데이터를 CSV 형식으로 변환
- 다운로드 링크 제공 또는 직접 다운로드
- UTF-8 BOM 추가 (한글 깨짐 방지)

#### 구현
```javascript
function exportToCSV(leads) {
  const headers = ['일시', '이메일', '이름', '회사명', '직무', ...];
  const rows = leads.map(lead => [
    lead.created_at,
    lead.email,
    lead.name || '',
    lead.company || '',
    lead.role || '',
    ...
  ]);
  
  const csv = [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');
  
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
  // 다운로드 처리
}
```

---

### 11.2.6 기술 스택 (제안)

#### 런타임
- Node.js
- Express 또는 Fastify

#### 데이터베이스
- PostgreSQL (추천)
- 또는 MySQL, SQLite (개발용)

#### 인증
- JWT
- bcrypt

#### 검증
- Zod 또는 Joi

---

## 11.3 키워드 블랙아웃 (실험적)

### 11.3.1 구현 제약사항

#### 브라우저 보안 제약
- **CORS (Cross-Origin Resource Sharing)**: Notion iframe이 다른 도메인이면 접근 불가
- **SOP (Same-Origin Policy)**: iframe 내부 DOM에 직접 접근할 수 없음

#### 해결 방안 (MVP에서는 제외)
1. **Proxy 서버**: Notion 콘텐츠를 same-origin으로 렌더링 (복잡함)
2. **Notion API**: 공개 링크 외에도 지원 (MVP 범위 초과)
3. **폴백 전략**: 실패 시 Section Blur로 자동 전환 (채택)

---

### 11.3.2 구현 정책 (MVP)

#### 정책
> **Keyword Blackout은 "가능하면 적용"하되, 실패하면 Section Blur로 자동 전환.**

#### 구현 방식 (Best-effort)
1. iframe 로드 완료 후 키워드 블랙아웃 시도
2. CORS 에러 발생 시 즉시 폴백
3. 키워드를 찾지 못하면 Section Blur로 전환
4. 운영자 콘솔에 에러 로깅

#### 코드 구조
```javascript
async function applyKeywordBlackout(iframe, keywords) {
  try {
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    // 키워드 블랙아웃 시도
    // ...
  } catch (error) {
    // CORS 에러 등으로 실패
    console.error('Keyword blackout failed:', error);
    // Section Blur로 폴백
    fallbackToSectionBlur();
  }
}
```

---

## 11.4 인프라

### 11.4.1 배포 환경

#### 프론트엔드
- Vercel (Next.js인 경우)
- 또는 Netlify, Cloudflare Pages

#### 백엔드
- Railway, Render, Fly.io
- 또는 AWS, GCP (더 복잡)

#### 데이터베이스
- Supabase, Neon (PostgreSQL)
- 또는 Railway, Render (PostgreSQL)

---

### 11.4.2 도메인 및 HTTPS
- 커스텀 도메인 설정
- HTTPS 자동 인증서 (Let's Encrypt)
- CORS 설정

---

### 11.4.3 모니터링 및 로깅
- 에러 추적: Sentry (선택)
- 로깅: 서버 로그 파일 또는 클라우드 로깅 서비스
- 기본 모니터링: 서버 상태 확인

---

## 11.5 개발 우선순위

### Phase 1: 핵심 기능 (MVP 1.0)
1. 프로젝트 생성 및 설정
2. Notion 임베드 및 블라인드 (Section Blur)
3. 기본 폼 (이메일 필수)
4. 리드 수집 및 저장
5. 공유 링크 생성

### Phase 2: UX 패턴 확장
1. Top/Bottom Form
2. Entry Modal
3. Floating CTA
4. Inline Blur Gate

### Phase 3: 고급 기능
1. Preview-Then-Blur
2. 키워드 블랙아웃 (베타)
3. Webhook 연동
4. CSV 내보내기

### Phase 4: 운영자 기능
1. 리드 목록 및 검색
2. 실시간 미리보기
3. 프로젝트 관리
4. 사용자 인증

---

## 11.6 기술 부채 및 제약사항

### 11.6.1 MVP에서 제외
- 이메일 인증 (추후 추가)
- 고급 분석 대시보드
- CRM 통합
- SSO
- 다국어 지원

### 11.6.2 향후 개선 필요
- 키워드 블랙아웃 안정화 (Proxy 서버 고려)
- Webhook 큐 시스템 (비동기 처리)
- Rate limiting 고도화
- 캐싱 전략
- 성능 최적화






