# PRD: Notion 콘텐츠 블라인드(가림) + 리드 수집 게이트 도구 (MVP)

**버전**: v0.1 (MVP)  
**작성일**: 2025-12-31  
**대상 사용자**: 세일즈 / 마케팅 / 콘텐츠 크리에이터  
**플랫폼**: Web (모바일 대응 필수)  
**제약**: Notion 임베드만 지원 (MVP에서 다른 CMS/문서 불가)

---

## 📋 PRD 문서 구조 가이드

이 PRD는 구현이 쉽도록 세부적으로 분리되어 있습니다. 각 문서는 특정 주제에 집중하며, 구현 시 해당 문서를 참고하시면 됩니다.

---

## 🗂️ 문서 목록 및 사용 가이드

### 📌 기본 개념 및 목표

#### [00-problem-and-opportunity.md](./00-problem-and-opportunity.md)
**언제 참고**: 프로젝트의 배경과 문제 정의를 이해하고 싶을 때
- 문제 정의와 기회
- 사용자 관찰 및 핵심 문제
- 해결 컨셉
- 시장 기회 및 기대 효과

**구현 시 활용**: 프로젝트 초기 기획, 사용자 인터뷰, 문제 정의 재확인

---

#### [01-goals-and-non-goals.md](./01-goals-and-non-goals.md)
**언제 참고**: MVP 범위를 결정하고 기능 우선순위를 정할 때
- MVP 목표 (핵심 기능, 운영자 기능, 미리보기, 공유, 브랜딩, 인증)
- Non-goals (MVP에서 하지 않음)
- MVP 범위 결정 원칙

**구현 시 활용**: 기능 개발 우선순위 결정, 범위 크리프 방지, 팀 내 합의

---

### 👥 사용자 관련

#### [02-user-scenarios.md](./02-user-scenarios.md)
**언제 참고**: 페르소나와 사용자 시나리오를 이해하고 UX를 설계할 때
- 페르소나 정의 (세일즈, 마케팅, 크리에이터)
- 구체적 사용 시나리오
- 중요 지표 및 제품 기대사항
- 사용자 여정 맵

**구현 시 활용**: UX 디자인, 기능 우선순위, 마케팅 전략 수립

---

#### [05-user-flows.md](./05-user-flows.md)
**언제 참고**: 사용자(뷰어) 화면과 플로우를 구현할 때
- 링크 클릭 → 블라인드 → 제출 → 해제 → 재방문 플로우
- 제출 없이 읽기 플로우
- 모바일 환경 플로우
- 에러 처리 플로우
- 재방문 플로우

**구현 시 활용**: 프론트엔드 Viewer 화면 개발, 사용자 경험 최적화

---

### 🎨 UX/UI 관련

#### [03-ux-patterns.md](./03-ux-patterns.md)
**언제 참고**: UX 패턴을 구현할 때
- 4가지 핵심 UX 패턴 (Top/Bottom Form, Entry Modal, Floating CTA, Inline Blur Gate)
- 각 패턴의 상세 명세 및 디자인
- 패턴 조합 규칙
- 패턴별 사용 가이드라인

**구현 시 활용**: 컴포넌트 설계, UX 패턴 개발, 패턴 조합 로직

---

#### [04-blinding-methods.md](./04-blinding-methods.md)
**언제 참고**: 블라인드 기능을 구현할 때
- 3가지 블라인드 방식 (Section Blur, Preview-Then-Blur, Keyword Blackout)
- 각 방식의 기술적 구현
- 폴백 전략
- 운영자 설정 가이드

**구현 시 활용**: 블라인드 컴포넌트 개발, CSS 구현, 키워드 블랙아웃 로직

---

#### [10-screen-layouts.md](./10-screen-layouts.md)
**언제 참고**: 화면 레이아웃과 구조를 설계할 때
- Viewer 화면 레이아웃
- Admin 화면 레이아웃
- 반응형 디자인
- 접근성 고려사항

**구현 시 활용**: 페이지 구조 설계, 레이아웃 컴포넌트 개발, 반응형 구현

---

### ⚙️ 운영자/관리자 관련

#### [06-creator-flows.md](./06-creator-flows.md)
**언제 참고**: 운영자(관리자) 화면과 플로우를 구현할 때
- 프로젝트 생성 (3-Step)
- 폼 구성
- 실시간 미리보기
- 배포
- 프로젝트 관리
- 리드 관리
- 로그인/가입 플로우

**구현 시 활용**: Admin 화면 개발, 프로젝트 생성 플로우, 설정 화면

---

#### [07-settings.md](./07-settings.md)
**언제 참고**: 설정 화면과 옵션을 구현할 때
- 단순 설정 vs 고급 설정 구분
- 각 설정 항목의 상세 명세
- 설정 화면 구조
- 설정 검증 및 에러 처리

**구현 시 활용**: 설정 화면 개발, 설정 저장/불러오기 로직, 검증 로직

---

### 🔧 기능 및 규칙

#### [08-behavior-rules.md](./08-behavior-rules.md)
**언제 참고**: 동작 규칙과 충돌 규칙을 구현할 때
- UX 패턴 조합 규칙
- "이미 해제된 사용자" 규칙
- 개인정보/동의 규칙
- 블라인드 해제 규칙
- 폼 제출 규칙

**구현 시 활용**: 비즈니스 로직 구현, 충돌 처리, 상태 관리

---

#### [14-edge-cases.md](./14-edge-cases.md)
**언제 참고**: 엣지 케이스와 폴백을 처리할 때
- Notion 관련 엣지 케이스
- 브라우저/환경 관련 엣지 케이스
- 폼 제출 관련 엣지 케이스
- 키워드 블랙아웃 관련 엣지 케이스
- 폴백 전략

**구현 시 활용**: 에러 처리, 폴백 로직, 테스트 시나리오 작성

---

### 💾 데이터 및 기술

#### [09-data-spec.md](./09-data-spec.md)
**언제 참고**: 데이터 모델과 API를 설계하고 구현할 때
- 엔티티 스키마 (Project, Lead, User)
- 이벤트/로그 스펙
- API 스펙
- 데이터베이스 설계

**구현 시 활용**: 데이터베이스 스키마 설계, API 엔드포인트 구현, 데이터 모델 정의

---

#### [11-development-scope.md](./11-development-scope.md)
**언제 참고**: 개발 범위와 기술 스택을 결정할 때
- 프론트엔드 개발 범위
- 백엔드 개발 범위
- 키워드 블랙아웃 구현 정책
- 인프라 구성
- 개발 우선순위

**구현 시 활용**: 기술 스택 선택, 개발 계획 수립, 인프라 구성

---

### 🛡️ 품질 및 보안

#### [12-quality-security.md](./12-quality-security.md)
**언제 참고**: 보안, 프라이버시, 품질을 구현할 때
- 보안 요구사항 (HTTPS, 입력 검증, 인증/인가, Rate Limiting)
- 프라이버시 (개인정보 수집 최소화, 동의, GDPR 준수)
- 스팸 방지
- 데이터 무결성
- 접근성

**구현 시 활용**: 보안 구현, 프라이버시 준수, 접근성 검증

---

#### [13-success-metrics.md](./13-success-metrics.md)
**언제 참고**: 성공 지표를 정의하고 측정할 때
- 핵심 지표 (전환율, Unlock 성공률, 리드 품질, 재방문 해제 유지율)
- 부가 지표
- 측정 및 분석 방법

**구현 시 활용**: 이벤트 추적 구현, 대시보드 개발, 분석 로직

---

### 📐 프로젝트 관리

#### [15-mvp-flexibility.md](./15-mvp-flexibility.md)
**언제 참고**: MVP 범위의 자유도와 제약사항을 이해할 때
- 사용자가 선택할 수 있는 옵션
- 단순화 원칙
- 제약사항 및 한계
- 확장 가능성

**구현 시 활용**: 기능 범위 결정, 사용자 옵션 설계, 확장성 고려

---

#### [16-open-issues.md](./16-open-issues.md)
**언제 참고**: 오픈 이슈를 검토하고 결정할 때
- 커스텀 도메인 MVP 포함 범위
- 키워드 블랙아웃 구현 범위
- 이메일 인증 MVP 포함 여부
- 기타 오픈 이슈

**구현 시 활용**: 향후 결정 필요 시점 확인, 우선순위 재조정

---

### 📝 요약 및 브랜드

#### [17-summary.md](./17-summary.md)
**언제 참고**: 전체 프로젝트를 한눈에 파악하고 싶을 때
- 제품 한 줄 정의
- 핵심 가치 제안
- 핵심 기능 요약
- 사용자 여정 요약
- MVP 범위 요약
- 기술 스택
- 개발 우선순위

**구현 시 활용**: 프로젝트 전체 이해, 팀 온보딩, 발표 자료 준비

---

### 🎨 브랜드 관련

#### [brand/brand-overview.md](./brand/brand-overview.md)
**언제 참고**: 브랜드 정체성과 철학을 이해할 때
- 브랜드 문장
- 핵심 철학
- 세계관
- 메타포

**구현 시 활용**: 브랜드 일관성 유지, 마케팅 메시지 개발

---

#### [brand/brand-story.md](./brand/brand-story.md)
**언제 참고**: 브랜드 스토리와 캐릭터를 활용할 때
- 브랜드 스토리
- 캐릭터 (MOMO)
- 이미지/비주얼 컨셉

**구현 시 활용**: 마케팅 콘텐츠, 사용자 안내 메시지

---

#### [brand/design-system.md](./brand/design-system.md)
**언제 참고**: 디자인 시스템을 구현할 때
- 컬러 시스템
- 타이포그래피
- 컴포넌트 스타일
- 반응형 디자인
- 접근성

**구현 시 활용**: UI 컴포넌트 개발, 스타일 가이드, 디자인 토큰

---

#### [brand/copy-guidelines.md](./brand/copy-guidelines.md)
**언제 참고**: 모든 화면의 카피(텍스트)를 작성할 때
- Viewer 화면 카피
- Admin 화면 카피
- 에러 메시지
- 브랜딩 언어 규칙

**구현 시 활용**: 모든 텍스트 작성, 일관성 있는 메시지 전달

---

## 🗺️ 구현 시나리오별 문서 참조 가이드

### 시나리오 1: 프로젝트 초기 기획
1. [00-problem-and-opportunity.md](./00-problem-and-opportunity.md) - 문제 정의 이해
2. [01-goals-and-non-goals.md](./01-goals-and-non-goals.md) - 범위 결정
3. [02-user-scenarios.md](./02-user-scenarios.md) - 페르소나 이해
4. [17-summary.md](./17-summary.md) - 전체 요약

---

### 시나리오 2: 프론트엔드 Viewer 화면 개발
1. [05-user-flows.md](./05-user-flows.md) - 사용자 플로우 이해
2. [03-ux-patterns.md](./03-ux-patterns.md) - UX 패턴 구현
3. [04-blinding-methods.md](./04-blinding-methods.md) - 블라인드 기능 구현
4. [10-screen-layouts.md](./10-screen-layouts.md) - 레이아웃 설계
5. [08-behavior-rules.md](./08-behavior-rules.md) - 동작 규칙 구현
6. [brand/design-system.md](./brand/design-system.md) - 디자인 시스템
7. [brand/copy-guidelines.md](./brand/copy-guidelines.md) - 카피 작성

---

### 시나리오 3: 프론트엔드 Admin 화면 개발
1. [06-creator-flows.md](./06-creator-flows.md) - 운영자 플로우 이해
2. [07-settings.md](./07-settings.md) - 설정 화면 구현
3. [10-screen-layouts.md](./10-screen-layouts.md) - 레이아웃 설계
4. [08-behavior-rules.md](./08-behavior-rules.md) - 동작 규칙 구현
5. [brand/design-system.md](./brand/design-system.md) - 디자인 시스템
6. [brand/copy-guidelines.md](./brand/copy-guidelines.md) - 카피 작성

---

### 시나리오 4: 백엔드 API 개발
1. [09-data-spec.md](./09-data-spec.md) - 데이터 모델 및 API 스펙
2. [08-behavior-rules.md](./08-behavior-rules.md) - 비즈니스 로직 규칙
3. [12-quality-security.md](./12-quality-security.md) - 보안 및 품질 요구사항
4. [14-edge-cases.md](./14-edge-cases.md) - 엣지 케이스 처리

---

### 시나리오 5: 데이터베이스 설계
1. [09-data-spec.md](./09-data-spec.md) - 엔티티 스키마
2. [11-development-scope.md](./11-development-scope.md) - 기술 스택 결정

---

### 시나리오 6: 테스트 시나리오 작성
1. [05-user-flows.md](./05-user-flows.md) - 사용자 플로우
2. [06-creator-flows.md](./06-creator-flows.md) - 운영자 플로우
3. [14-edge-cases.md](./14-edge-cases.md) - 엣지 케이스
4. [08-behavior-rules.md](./08-behavior-rules.md) - 동작 규칙

---

### 시나리오 7: 디자인 시스템 구축
1. [brand/design-system.md](./brand/design-system.md) - 디자인 시스템 명세
2. [brand/brand-overview.md](./brand/brand-overview.md) - 브랜드 철학
3. [10-screen-layouts.md](./10-screen-layouts.md) - 레이아웃 참고

---

### 시나리오 8: 마케팅 및 콘텐츠 작성
1. [brand/brand-story.md](./brand/brand-story.md) - 브랜드 스토리
2. [brand/copy-guidelines.md](./brand/copy-guidelines.md) - 카피 가이드라인
3. [02-user-scenarios.md](./02-user-scenarios.md) - 페르소나 이해
4. [00-problem-and-opportunity.md](./00-problem-and-opportunity.md) - 문제 정의

---

### 시나리오 9: 성공 지표 측정 및 분석
1. [13-success-metrics.md](./13-success-metrics.md) - 성공 지표 정의
2. [09-data-spec.md](./09-data-spec.md) - 이벤트/로그 스펙
3. [11-development-scope.md](./11-development-scope.md) - 개발 범위 확인

---

### 시나리오 10: MVP 이후 기능 확장 계획
1. [16-open-issues.md](./16-open-issues.md) - 오픈 이슈 검토
2. [15-mvp-flexibility.md](./15-mvp-flexibility.md) - 확장 가능성
3. [01-goals-and-non-goals.md](./01-goals-and-non-goals.md) - Non-goals 확인

---

## 📚 빠른 참조 체크리스트

### 개발 시작 전
- [ ] [00-problem-and-opportunity.md](./00-problem-and-opportunity.md) - 문제 정의 이해
- [ ] [01-goals-and-non-goals.md](./01-goals-and-non-goals.md) - MVP 범위 확인
- [ ] [17-summary.md](./17-summary.md) - 전체 요약 파악

### 프론트엔드 개발
- [ ] [05-user-flows.md](./05-user-flows.md) - 사용자 플로우
- [ ] [06-creator-flows.md](./06-creator-flows.md) - 운영자 플로우
- [ ] [03-ux-patterns.md](./03-ux-patterns.md) - UX 패턴
- [ ] [04-blinding-methods.md](./04-blinding-methods.md) - 블라인드 기능
- [ ] [10-screen-layouts.md](./10-screen-layouts.md) - 레이아웃
- [ ] [brand/design-system.md](./brand/design-system.md) - 디자인 시스템

### 백엔드 개발
- [ ] [09-data-spec.md](./09-data-spec.md) - 데이터 모델 및 API
- [ ] [08-behavior-rules.md](./08-behavior-rules.md) - 비즈니스 로직
- [ ] [12-quality-security.md](./12-quality-security.md) - 보안 및 품질

### 테스트
- [ ] [14-edge-cases.md](./14-edge-cases.md) - 엣지 케이스
- [ ] [08-behavior-rules.md](./08-behavior-rules.md) - 동작 규칙

### 카피 및 콘텐츠
- [ ] [brand/copy-guidelines.md](./brand/copy-guidelines.md) - 카피 가이드라인
- [ ] [brand/brand-overview.md](./brand/brand-overview.md) - 브랜드 철학

---

## 🔄 문서 업데이트 가이드

### 문서 수정 시
1. 해당 문서를 직접 수정
2. 관련 문서도 함께 확인하여 일관성 유지
3. 변경사항이 다른 문서에 영향을 주는지 확인

### 새 기능 추가 시
1. [01-goals-and-non-goals.md](./01-goals-and-non-goals.md) - Goals에 추가 또는 Non-goals에서 제거
2. 관련 섹션 문서 업데이트
3. [17-summary.md](./17-summary.md) - 요약 업데이트

---

## 💡 참고 사항

- 모든 문서는 구현이 쉽도록 최대한 상세하게 작성되었습니다.
- 생략 없이 모든 내용을 포함했습니다.
- 각 문서는 독립적으로 읽을 수 있지만, 전체 맥락을 이해하기 위해서는 이 가이드를 참고하세요.
- 구현 시나리오별로 필요한 문서를 빠르게 찾을 수 있도록 구성했습니다.

---

## 📞 문의 및 피드백

PRD 문서에 대한 질문이나 피드백이 있으시면 팀 내에서 논의하고 문서를 업데이트해 주세요.






