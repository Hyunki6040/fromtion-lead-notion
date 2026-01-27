# 12) 품질/보안/프라이버시

## 개요

MVP의 품질, 보안, 프라이버시 요구사항과 구현 방안을 정의한다.

---

## 12.1 보안

### 12.1.1 HTTPS 기본

#### 요구사항
- 모든 통신은 HTTPS로 암호화
- HTTP는 HTTPS로 자동 리다이렉트
- HSTS (HTTP Strict Transport Security) 헤더 설정

#### 구현
- 배포 환경에서 자동 HTTPS 인증서 (Let's Encrypt)
- 개발 환경에서는 localhost 사용 (HTTP 허용)

---

### 12.1.2 입력 데이터 검증 및 Sanitization

#### 요구사항
- 모든 사용자 입력 데이터 검증
- XSS (Cross-Site Scripting) 방지
- SQL Injection 방지 (ORM 사용 시 자동 방지)

#### 구현
- **클라이언트 측**: React의 자동 이스케이프 활용
- **서버 측**: 
  - 입력 데이터 검증 (Zod 또는 Joi)
  - 출력 시 이스케이프 (템플릿 엔진 사용 시)
  - ORM 사용으로 SQL Injection 방지

#### 검증 예시
```typescript
import { z } from 'zod';

const leadSchema = z.object({
  email: z.string().email(),
  name: z.string().max(100).optional(),
  company: z.string().max(100).optional(),
  // ...
});

const validatedData = leadSchema.parse(req.body);
```

---

### 12.1.3 인증 및 인가

#### 인증
- JWT (JSON Web Token) 사용
- 비밀번호 해시: bcrypt (salt rounds: 10)
- 세션 관리: JWT 토큰 기반 (서버 측 세션 저장 불필요)

#### 인가
- 프로젝트 소유자만 접근 가능
- 미들웨어로 권한 확인
- 공개 API (리드 제출)는 인증 불필요

#### 구현 예시
```javascript
// 미들웨어
function requireAuth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// 프로젝트 소유자 확인
function requireProjectOwner(req, res, next) {
  const project = await getProject(req.params.projectId);
  if (project.owner_id !== req.user.user_id) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  next();
}
```

---

### 12.1.4 Rate Limiting

#### 요구사항
- 공개 API (리드 제출)에 Rate Limiting 적용
- IP 기반 제한 (예: IP당 분당 10회)
- 인증된 API는 더 높은 제한 (예: 분당 100회)

#### 구현
- `express-rate-limit` 미들웨어 사용
- Redis 사용 (선택, MVP에서는 메모리 저장소도 가능)

#### 구현 예시
```javascript
const rateLimit = require('express-rate-limit');

const leadSubmissionLimit = rateLimit({
  windowMs: 1 * 60 * 1000, // 1분
  max: 10, // IP당 최대 10회
  message: 'Too many requests, please try again later.'
});

app.post('/api/leads', leadSubmissionLimit, submitLead);
```

---

### 12.1.5 CORS 설정

#### 요구사항
- 적절한 CORS 정책 설정
- 공개 API는 필요한 도메인만 허용
- 인증 API는 프론트엔드 도메인만 허용

#### 구현
```javascript
const cors = require('cors');

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
```

---

### 12.1.6 환경 변수 및 시크릿 관리

#### 요구사항
- 민감한 정보는 환경 변수로 관리
- `.env` 파일은 Git에 커밋하지 않음
- `.env.example` 파일 제공

#### 환경 변수 목록
```
DATABASE_URL=
JWT_SECRET=
FRONTEND_URL=
NODE_ENV=production
```

---

## 12.2 프라이버시

### 12.2.1 개인정보 수집 최소화

#### 원칙
- 필요한 정보만 수집
- 선택 필드는 사용자가 선택할 수 있도록
- 불필요한 정보는 수집하지 않음

#### 수집 항목
- 필수: 이메일
- 선택: 이름, 회사명, 직무, 한 줄 질문
- 시스템: IP 주소 (선택, 분석용), User-Agent (선택)

---

### 12.2.2 개인정보 동의

#### 요구사항
- 개인정보 처리 동의 체크박스 제공 (기본: 필수)
- 마케팅 수신 동의 체크박스 제공 (기본: 선택)
- 동의 여부를 데이터베이스에 저장

#### 구현
- 폼에 동의 체크박스 포함
- 리드 데이터에 `consent_privacy`, `consent_marketing` 필드 저장
- 동의 시각 기록 (`consented_at`)

---

### 12.2.3 개인정보 보관 및 삭제

#### 보관 기간
- 운영자가 프로젝트를 삭제할 때까지 보관
- 또는 사용자 요청 시 삭제 (GDPR 준수, 추후 추가)

#### 삭제 정책
- 프로젝트 삭제 시 관련 리드도 함께 삭제
- 사용자 요청 시 데이터 삭제 (추후 추가)

---

### 12.2.4 GDPR 준수 (향후)

#### 요구사항
- 데이터 삭제 요청 처리
- 데이터 이전 요청 처리
- 프라이버시 정책 페이지 제공

#### MVP에서는
- 기본적인 동의 체크박스 제공
- 데이터 삭제 기능은 추후 추가

---

## 12.3 스팸 방지

### 12.3.1 Rate Limiting

#### 요구사항
- IP 기반 Rate Limiting (이미 보안 섹션에서 다룸)
- 중복 제출 방지

---

### 12.3.2 Honeypot 필드

#### 요구사항
- 숨김 필드를 추가하여 봇 방지
- 봇이 채우면 제출 무시

#### 구현
```html
<!-- 사용자에게는 보이지 않음 (CSS: display: none) -->
<input type="text" name="website" style="display: none;" tabindex="-1" autocomplete="off">
```

```javascript
if (req.body.website) {
  // 봇으로 판단, 제출 무시
  return res.status(200).json({ success: true }); // 성공 응답 (봇을 속임)
}
```

---

### 12.3.3 중복 제출 처리

#### 요구사항
- 동일 이메일 + 프로젝트 ID 조합은 중복 제출 방지
- 정책: 업데이트 또는 무시 (운영자 설정)

#### 구현
```javascript
const dedupeKey = `${email}_${projectId}`;
const existingLead = await getLeadByDedupeKey(dedupeKey);

if (existingLead) {
  if (updatePolicy === 'update') {
    // 기존 리드 업데이트
    await updateLead(existingLead.lead_id, newData);
  } else {
    // 무시
    return res.status(200).json({ success: true });
  }
} else {
  // 새 리드 생성
  await createLead(newData);
}
```

---

## 12.4 데이터 무결성

### 12.4.1 데이터베이스 제약 조건

#### 요구사항
- Primary Key, Foreign Key 제약 조건
- Unique 제약 조건 (email, public_slug 등)
- NOT NULL 제약 조건 (필수 필드)

#### 구현
- 데이터베이스 스키마에서 제약 조건 정의
- ORM 모델에서도 검증

---

### 12.4.2 트랜잭션 처리

#### 요구사항
- 리드 생성 시 원자성 보장
- 여러 테이블에 걸친 작업은 트랜잭션 사용

#### 구현
- ORM의 트랜잭션 기능 활용

---

## 12.5 에러 처리

### 12.5.1 클라이언트 에러 처리

#### 요구사항
- 사용자 친화적인 에러 메시지
- 네트워크 오류, 서버 오류 구분
- 재시도 가능한 경우 재시도 버튼 제공

#### 구현
- 에러 타입별 메시지 정의
- Toast/Alert 컴포넌트로 표시

---

### 12.5.2 서버 에러 처리

#### 요구사항
- 민감한 정보는 에러 메시지에 포함하지 않음
- 에러 로깅 (프로덕션 환경)
- 500 에러는 일반적인 메시지만 반환

#### 구현
```javascript
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  if (process.env.NODE_ENV === 'production') {
    res.status(500).json({ error: 'Internal server error' });
  } else {
    res.status(500).json({ error: err.message });
  }
});
```

---

## 12.6 접근성

### 12.6.1 키보드 네비게이션

#### 요구사항
- Tab 키로 모든 인터랙티브 요소 이동 가능
- Enter 키로 버튼 클릭
- Esc 키로 모달 닫기

#### 구현
- 적절한 `tabindex` 설정
- 키보드 이벤트 핸들러

---

### 12.6.2 스크린 리더 지원

#### 요구사항
- 모든 폼 필드에 적절한 라벨
- ARIA 라벨 제공
- 에러 메시지를 스크린 리더가 읽을 수 있도록

#### 구현
```html
<label htmlFor="email">이메일</label>
<input 
  id="email" 
  type="email" 
  aria-required="true"
  aria-invalid={hasError}
  aria-describedby={hasError ? "email-error" : undefined}
/>
{hasError && (
  <div id="email-error" role="alert">
    올바른 이메일 형식을 입력해 주세요.
  </div>
)}
```

---

### 12.6.3 색상 대비

#### 요구사항
- WCAG AA 기준 준수 (최소 4.5:1 대비율)
- 색상만으로 정보를 전달하지 않음 (아이콘/텍스트 병행)

#### 구현
- 디자인 시스템에서 색상 대비 확인
- 접근성 도구로 검증 (Lighthouse, axe DevTools)

---

## 12.7 성능

### 12.7.1 프론트엔드 성능

#### 요구사항
- 초기 로딩 시간 최소화
- 이미지 최적화
- 코드 스플리팅 (필요 시)

#### 구현
- 번들 크기 최적화
- 이미지 lazy loading
- React.lazy 사용 (필요 시)

---

### 12.7.2 백엔드 성능

#### 요구사항
- API 응답 시간 최적화
- 데이터베이스 쿼리 최적화
- 인덱스 적절히 사용

#### 구현
- 데이터베이스 인덱스 설정
- N+1 쿼리 문제 방지 (ORM의 include 사용)
- 필요 시 캐싱 (추후 추가)

---

## 12.8 모니터링 및 로깅

### 12.8.1 에러 추적

#### 요구사항
- 프로덕션 환경에서 에러 추적
- 에러 알림 (선택)

#### 구현
- Sentry 통합 (선택)
- 또는 기본 로깅

---

### 12.8.2 로깅

#### 요구사항
- 중요한 이벤트 로깅
- 개인정보는 로그에 포함하지 않음

#### 구현
- 서버 로그 파일 또는 클라우드 로깅 서비스
- 로그 레벨 구분 (error, warn, info, debug)

---

## 12.9 백업 및 복구

### 12.9.1 데이터베이스 백업

#### 요구사항
- 정기적인 데이터베이스 백업
- 백업 복구 절차 문서화

#### 구현
- 클라우드 데이터베이스 서비스의 자동 백업 활용
- 또는 수동 백업 스크립트

---

## 12.10 보안 체크리스트

### 개발 단계
- [ ] 모든 환경 변수 설정
- [ ] HTTPS 설정
- [ ] 입력 데이터 검증 구현
- [ ] Rate Limiting 구현
- [ ] CORS 설정
- [ ] 에러 처리 구현

### 배포 전
- [ ] 보안 취약점 스캔
- [ ] 접근성 검증
- [ ] 성능 테스트
- [ ] 백업 설정 확인
- [ ] 모니터링 설정 확인






