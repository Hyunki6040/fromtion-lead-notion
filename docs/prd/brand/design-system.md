# 디자인 시스템

## 컬러 시스템

### 베이스 (화이트 제품)

- **Background**: #FFFFFF
- **Surface**: #F7F7F8
- **Border**: #E9E9EC
- **Text Primary**: #111111
- **Text Secondary**: #666A73

---

### 브랜드 오렌지 (핵심)

- **Formtion Orange**: **#FF5A1F** (포인트/행동/언락)
- **Orange Soft**: #FFF1EA (배경 하이라이트)
- **Orange Deep**: #E64510 (hover/active)

> 원칙: 오렌지는 **행동(CTA), 상태(Unlock), 강조(Checkpoint)**에만 사용. 남발 금지.

---

## 타이포그래피

- **Headline**: Inter / Pretendard Bold
- **Body**: Inter / Pretendard Regular
- **UI 문장**: 짧게, 명령형 금지, **진행형/안내형** 선호

---

## 컴포넌트 스타일

### 버튼 (CTA)

- **Radius**: 14~16px (캡슐 느낌)
- **기본**: 오렌지 배경 + 흰 글자 (#FF5A1F 배경, #FFFFFF 텍스트)
- **보조**: 투명 배경 + 오렌지 테두리 (투명 배경, #FF5A1F 테두리)

#### 라벨 규칙
- "Unlock", "Continue", "Reveal" 같이 **행동 단어**
- 명령형 금지, 진행형 선호

---

### Blur Overlay

- 단순 blur + 아주 얇은 그라데이션 (위쪽 투명 → 아래쪽 진해짐)
- 중앙에 작은 카드 (Checkpoint Card) 배치

#### CSS 예시
```css
.blur-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  mask-image: linear-gradient(to bottom, transparent 0%, black 100%);
}
```

---

### Floating CTA (북마크 스타일)

- 우하단에 "책갈피 탭"처럼 화면에 붙어있게
- 그림자 최소, border 강조
- 아이콘은 자물쇠 ❌
- 추천: **▶︎(진행), ▮(블러 블록), →(forward)**

#### 스타일
- 배경: 오렌지 (#FF5A1F)
- 텍스트: 흰색 (#FFFFFF)
- 둥근 모서리: 상단만 둥글게 (북마크 느낌)
- 그림자: 최소한 (border 강조)
- 크기: PC 60x44px, 모바일 전체 너비 x 56px
- 위치: `position: fixed`, 우측 하단 20px (모바일: 하단 0px)

---

## 서비스 로고 버튼

### 위치
- 우측 하단, Floating CTA 위 (80px 위)
- 항시 표시 (운영자 설정 불가)

### 스타일
- 배경: 화이트 (#FFFFFF)
- 테두리: 얇은 테두리 (#E9E9EC)
- 둥근 모서리: 8px
- 크기: 44x44px
- 위치: `position: fixed`, 우측 하단 80px

---

## 모달/Drawer 스타일

### Entry Modal

- **오버레이**: 반투명 검정 배경 (rgba(0, 0, 0, 0.5))
- **모달 박스**:
  - 배경: 화이트 (#FFFFFF)
  - 둥근 모서리: 16px
  - 그림자: 중간 강도
  - 최대 너비: 500px
  - 패딩: 32px
  - 위치: 화면 중앙 (모바일: 하단 또는 중앙)

### Drawer (모바일)

- 하단에서 슬라이드 업
- 전체 너비 또는 약간의 패딩
- 둥근 모서리: 상단만 16px

---

## 폼 필드 스타일

### 입력 필드

- 배경: 화이트 (#FFFFFF)
- 테두리: #E9E9EC (기본), #FF5A1F (포커스), #E64510 (에러)
- 둥근 모서리: 8px
- 패딩: 12px 16px
- 폰트 크기: 16px (모바일에서 줌 방지)

### 에러 상태

- 테두리: 빨간색 (#E64510)
- 에러 메시지: 빨간색 텍스트, 필드 아래 표시
- 아이콘: 에러 아이콘 (선택)

---

## 접근성

### 색상 대비

- WCAG AA 기준 준수 (최소 4.5:1 대비율)
- 색상만으로 정보를 전달하지 않음 (아이콘/텍스트 병행)

### 키보드 네비게이션

- Tab 키로 모든 인터랙티브 요소 이동 가능
- Enter 키로 버튼 클릭
- Esc 키로 모달 닫기

### 스크린 리더

- 모든 폼 필드에 적절한 라벨
- ARIA 라벨 제공
- 에러 메시지를 스크린 리더가 읽을 수 있도록

---

## 반응형 디자인

### 브레이크포인트

- 모바일: < 768px
- 태블릿: 768px - 1024px
- PC: >= 1024px

### 모바일 최적화

- 터치 친화적인 버튼 크기 (최소 44x44px)
- 전체 너비 사용
- Drawer 형태의 모달 (하단에서 슬라이드 업)
- 스와이프 제스처 지원

### PC 최적화

- 최대 너비 제한 (1200px)
- 중앙 정렬
- 호버 효과
- 키보드 단축키 (추후 추가)






