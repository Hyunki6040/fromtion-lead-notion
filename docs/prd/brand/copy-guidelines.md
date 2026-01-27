# 카피 가이드라인 (실제 카피 전체 세트)

## 개요

Viewer 화면, Admin 화면, 상태 메시지, 에러, 로그인 유도, 동의 등 모든 화면에서 사용되는 실제 카피를 정리한다.

---

## A) Viewer (공유 링크 접속)

### 1) 페이지 상단 (상단 폼 ON일 때)

#### Title 옵션
- "이 템플릿, 바로 써도 됩니다."
- "계속 보기 전에, 딱 한 가지."
- "읽고 끝내지 말고, 연결까지."

#### Sub-title 옵션
- "짧게 입력하면 블러가 즉시 풀립니다."
- "한 번만 입력하면 다음부터는 자동으로 열려요."
- "스팸 없음. 컨텍스트만 남겨주세요."

#### Submit 버튼
- "Unlock & Continue"
- "Unlock now"
- "Continue"

#### 하단 작은 문구 (신뢰)
- "No spam. One-time unlock."
- "You'll stay unlocked on this device."

---

### 2) Entry Modal (접속 즉시 모달)

#### Modal Title
- "이 콘텐츠는 체크인 후 열립니다."
- "계속 보기 전에, 10초만."

#### Modal Body
- "입력 후 바로 전체 내용이 열립니다. 다음 방문은 자동으로 열려요."

#### Buttons
- Primary: "Unlock"
- Secondary (닫기 허용 시): "Not now"
- Tertiary (미리보기 허용 시): "Preview first"

#### 닫기 허용 안내 (운영자 설정에 따라)
- 허용: "지금은 닫아도, 블러 구간에서 다시 열 수 있어요."
- 미허용: "이 구간부터는 Unlock 후 계속할 수 있어요."

---

### 3) Inline Blur Gate (본문 중간)

#### Inline Card Title
- "여기부터 핵심입니다."
- "다음 섹션은 Unlock 후 열립니다."
- "이 부분은 체크인 후 공개돼요."

#### Inline Card Subtitle
- "이메일만 입력하면 바로 이어집니다."
- "한 번만 입력하면, 다음부터는 자동이에요."

#### Inline Button
- "Unlock this section"
- "Continue reading"

#### 입력 폼 주변 마이크로카피
- "이메일"
- "이름 (선택)"
- "회사 (선택)"
- "직무 (선택)"
- "한 줄 질문 (선택): '지금 어떤 상황인가요?'"

---

### 4) Floating CTA (우하단)

#### Collapsed label
- "Unlock"
- "Open"
- "Continue"

#### Expanded drawer title
- "Unlock to continue"
- "Keep the motion going"

---

### 5) 제출 성공/실패 토스트

#### Success
- "Unlocked. 계속 읽어보세요."
- "Unlocked. 흐름 이어갑니다."
- "Done. You're in."

#### Fail
- "잠시 오류가 있었어요. 다시 시도해 주세요."
- "네트워크가 불안정해요. 한 번만 더."

---

### 6) 재방문 (이미 unlocked)

#### 상단 아주 작은 배지
- "Unlocked on this device"
- "You're already unlocked"

(기본은 폼 숨김이지만, 남길 경우의 텍스트)

---

## B) Consent (동의) 카피

### 개인정보 처리 동의 (권장: 필수)

- "개인정보 처리에 동의합니다. (필수)"
- 하단 링크: "정책 보기"

### 마케팅 수신 동의 (기본 OFF)

- "업데이트/새 템플릿 소식을 받아볼래요. (선택)"

### 신뢰 문구

- "언제든 구독 해지할 수 있어요."

---

## C) Admin (운영자 콘솔)

### 1) 프로젝트 생성 Step 1 (Notion URL 입력)

- **Title**: "콘텐츠를 불러오세요"
- **Placeholder**: "Notion 공유 링크를 붙여넣기"
- **Button**: "Load preview"

#### 에러
- "이 링크는 공개 공유가 아니에요. Notion에서 '공개'로 바꿔주세요."
- "불러오기에 실패했어요. 링크를 다시 확인해 주세요."

---

### 2) Step 2 (게이트 UX 선택)

- **Title**: "어떤 방식으로 흐름을 만들까요?"
- **Sub**: "가볍게 유도할 수도, 중요한 구간에서만 멈추게 할 수도 있어요."

#### 옵션 설명 (짧게)
- Top/Bottom Form: "문서처럼 자연스럽게"
- Entry Modal: "시작부터 확실하게"
- Floating CTA: "방해 없이 최소한으로"
- Inline Blur Gate: "핵심 구간에서 강하게"

---

### 3) Step 3 (블러 설정)

- **Title**: "어디를 공개할까요?"
- **Simple preset**:
  - "초반만 공개"
  - "중간부터 잠금"
  - "하단 핵심만 잠금"
- **Toggle**: "Preview-then-blur (추천)"
- **Advanced (베타)**: "Keyword blackout (beta)"

---

### 4) Share

- **Title**: "공유 링크"
- **Button**: "Copy link"
- **Slug edit**: "경로 수정"
- **Duplicate warning**: "이미 사용 중인 경로예요. 다른 이름을 입력해 주세요."

---

### 5) Leads

#### Empty state
- "아직 신호가 없어요."
- "링크를 배포하면 여기에 리드가 쌓입니다."

#### CSV
- "Export CSV"

#### Webhook
- "Send test payload"

---

## D) 로그인/가입 (비회원 우선 사용 UX)

### 상단 배너 (비회원)

- "지금 만든 설정, 저장하려면 로그인하세요."
- 버튼: "Login to save"

### 저장/공유 시 모달

- **Title**: "저장하려면 로그인"
- **Body**: "이 프로젝트를 저장하고 계속 편집할 수 있어요."
- **Buttons**:
  - Primary: "Login"
  - Secondary: "Continue without saving"

---

## E) 에러 메시지

### 네트워크 오류

- "네트워크가 불안정해요. 한 번만 더."
- "연결에 문제가 있어요. 잠시 후 다시 시도해 주세요."

### 서버 오류

- "잠시 오류가 있었어요. 다시 시도해 주세요."
- "서버에 문제가 발생했어요. 잠시 후 다시 시도해 주세요."

### 유효성 검사 오류

- "올바른 이메일 형식을 입력해 주세요."
- "이 필드는 필수입니다."
- "입력한 정보를 확인해 주세요."

---

## F) 브랜딩 언어 규칙

### 금지어

- "리드 수집"
- "잠금/락"
- "게이트"
- "필수 입력"

### 권장어

- "Unlock"
- "Continue"
- "Checkpoint"
- "Signal"
- "One-time"
- "Stay unlocked"

### 톤앤매너

- 명령형 금지, 진행형/안내형 선호
- 짧고 명확하게
- 친절하지만 목적이 분명함
- 강요하지 않고 선택 가능한 느낌

---

## G) 예시 시나리오별 카피

### 시나리오 1: 가벼운 유도 (Floating CTA만)

- CTA 버튼: "Unlock"
- Drawer Title: "Unlock to continue"
- Body: "이메일만 입력하면 바로 이어집니다."

### 시나리오 2: 강한 유도 (Entry Modal)

- Modal Title: "이 콘텐츠는 체크인 후 열립니다."
- Body: "입력 후 바로 전체 내용이 열립니다."
- Button: "Unlock"

### 시나리오 3: 단계적 유도 (Top + Bottom Form)

- Top Form Title: "이 템플릿, 바로 써도 됩니다."
- Top Form Subtitle: "짧게 입력하면 블러가 즉시 풀립니다."
- Bottom Form Title: "더 많은 자료가 필요하신가요?"
- Bottom Form Subtitle: "이메일만 입력하면 추가 자료를 보내드려요."






