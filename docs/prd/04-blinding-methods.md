# 4) 블라인드(가림) 방식 옵션 (MVP)

## 개요

블라인드는 콘텐츠의 일부를 가림 처리하여 사용자에게 "보고 싶은" 욕구를 자극하고 폼 제출을 유도하는 핵심 기능이다. MVP는 3가지 블라인드 방식을 제공하며, 각 방식은 서로 다른 구현 난이도와 안정성을 가진다.

---

## 요구사항 (원문 인용, 오탈자 일부 수정)

> "blind 방식도 초반만 보여주고 블러 처리 되는 방식도 있을 수 있고."  
> "iframe에 접근해서 일부 단어, 키워드들을 까만색 블랙 처리 할 수도 있어."

---

## 블라인드 방식 개요

MVP에서 제공하는 블라인드 방식은 3단계로 나눈다:

1. **Section Blur (섹션 단위 블러)**: 가장 안정적이고 구현이 쉬운 방식
2. **Preview-Then-Blur (프리뷰 + 블러)**: 사용자 경험이 좋은 방식
3. **Keyword Blackout (키워드 블랙아웃)**: 가장 정교하지만 실험적인 방식

---

## 4.1 섹션 단위 블러 (Section Blur)

### 개념
운영자가 "블러 구간"을 지정하면, 지정된 영역은 blur overlay 처리하고 "Unlock CTA"를 노출하는 방식이다.

### 특징
- **구현 난이도**: 쉬움
- **안정성**: 높음 (Notion DOM 구조 변경에 상대적으로 덜 취약)
- **사용자 경험**: 명확하고 직관적
- **권장 사용**: 대부분의 경우에 적합

### 상세 명세

#### 4.1.1 블러 구간 지정 방식

##### 간단 모드 (프리셋)
운영자가 다음 중 하나를 선택:
- **"초반만 공개"**: 상단 N% (예: 20%)만 보이고 나머지 블러
- **"중간부터 잠금"**: 상단 50%는 보이고 나머지 블러
- **"하단 핵심만 잠금"**: 상단 80%는 보이고 하단 20% 블러

##### 고급 모드 (직접 지정)
- iframe의 높이를 기준으로 픽셀 또는 퍼센트로 지정
- 예: "상단에서 500px 이후부터 블러", "상단 60% 이후 블러"
- MVP에서는 퍼센트 기반만 지원 (픽셀은 추후 추가)

#### 4.1.2 블러 처리 방식
- **CSS Filter**: `filter: blur(10px) ~ blur(20px)`
- **Overlay**: 반투명 검정 오버레이 (`rgba(0, 0, 0, 0.3)`)
- **그라데이션**: 위쪽은 약간 투명, 아래쪽은 진하게
- **블러 강도**: 운영자가 약/중/강 선택 (고급설정)

#### 4.1.3 Unlock CTA 표시
- 블러 구간 중앙 또는 상단에 카드 형태로 표시
- 카드 내용:
  - 간단한 메시지: "이 부분을 보려면 Unlock"
  - 폼 필드 (인라인 블러 게이트인 경우)
  - 또는 "Unlock" 버튼만 (다른 패턴과 조합 시)

#### 4.1.4 기술적 구현
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
  pointer-events: none; /* 클릭은 아래 콘텐츠로 전달 */
}

.unlock-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
  pointer-events: all; /* 이 요소는 클릭 가능 */
}
```

#### 4.1.5 장점
- 구현이 간단하고 안정적
- Notion 레이아웃 변경에 상대적으로 덜 취약
- 모든 브라우저에서 동작 (CSS filter 지원)
- 성능이 좋음 (CSS만 사용)

#### 4.1.6 단점
- Notion 레이아웃 변경 시 위치 보정 필요할 수 있음
- 블러 구간의 정확한 위치 지정이 어려울 수 있음 (퍼센트 기반)
- 콘텐츠의 특정 부분만 정교하게 가리는 것은 어려움

---

## 4.2 프리뷰 + 블러 (Preview-Then-Blur)

### 개념
블러 구간의 상단 일부 N줄 또는 일부 높이만 보여주고, 그 아래는 블러 처리하는 방식이다. 사용자는 "내용이 있다는 것"을 확인하고 제출 유인이 강해진다.

### 특징
- **구현 난이도**: 중간
- **안정성**: 높음 (Section Blur와 유사)
- **사용자 경험**: 매우 좋음 (호기심 유발)
- **권장 사용**: 대부분의 경우에 추천

### 상세 명세

#### 4.2.1 프리뷰 영역 설정
- **높이 지정 방식**:
  - N줄만 보이기 (예: "상단 3줄만 보이기")
  - 픽셀 기반 (예: "상단 200px만 보이기")
  - 퍼센트 기반 (예: "상단 30%만 보이기")
- MVP에서는 N줄 또는 퍼센트 기반만 지원

#### 4.2.2 블러 전환 효과
- 프리뷰 영역과 블러 영역 사이에 그라데이션 효과
- 자연스러운 전환을 위해 `mask-image` 또는 `linear-gradient` 사용
- 전환이 너무 급격하지 않도록 부드러운 그라데이션

#### 4.2.3 기술적 구현
```css
.preview-blur-section {
  position: relative;
  overflow: hidden;
}

.preview-area {
  /* 프리뷰 영역: 정상 표시 */
}

.blur-area {
  position: relative;
  /* 블러 처리 */
  filter: blur(10px);
  -webkit-filter: blur(10px);
  opacity: 0.7;
  
  /* 그라데이션 마스크 */
  -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 100%);
  mask-image: linear-gradient(to bottom, transparent 0%, black 100%);
}
```

#### 4.2.4 사용자 경험
- 사용자가 스크롤하다가 프리뷰 영역을 먼저 봄
- "아, 내용이 더 있구나"를 인지
- 블러 영역으로 진입하면 "이걸 보려면 Unlock" 메시지 표시
- 호기심이 유발되어 폼 제출 유도

#### 4.2.5 장점
- 사용자 경험이 매우 좋음 (호기심 유발)
- Section Blur보다 전환율이 높을 것으로 예상
- 구현이 비교적 간단

#### 4.2.6 단점
- 프리뷰 높이를 적절히 설정해야 함 (너무 많으면 효과 없음, 너무 적으면 불편함)
- Notion 콘텐츠의 줄 높이가 다를 수 있어서 N줄 계산이 어려울 수 있음

---

## 4.3 키워드 블랙아웃 (Keyword Blackout) — 고급설정(실험적)

### 개념
iframe 내부 DOM에서 특정 단어/문구를 찾아 검정 박스(blackout) 처리하는 방식이다. 키워드 리스트를 운영자가 입력하면, 해당 키워드들이 모두 블랙아웃 처리된다.

### 특징
- **구현 난이도**: 매우 어려움
- **안정성**: 낮음 (Notion DOM 구조 변경에 취약)
- **사용자 경험**: 매우 정교하고 효과적
- **권장 사용**: 베타 기능으로 제공, 실패 시 자동 폴백

### 상세 명세

#### 4.3.1 키워드 입력 방식
- 운영자가 고급설정에서 키워드 리스트 입력
- 줄바꿈으로 여러 키워드 입력 (예: "가격\n할인율\n프로모션 코드")
- 대소문자 구분 옵션 (기본: 구분 안 함)

#### 4.3.2 블랙아웃 처리 방식
- 키워드를 찾아서 `<span class="blackout">단어</span>` 형태로 감싸기
- 또는 `::before` / `::after` pseudo-element로 검정 박스 오버레이
- 검정 박스 스타일:
  - 배경: 검정 (#000000)
  - 패딩: 약간의 여백 (단어가 완전히 가려지도록)
  - 둥근 모서리: 약간 (2-4px)

#### 4.3.3 기술적 구현 (참고)
```javascript
// 주의: iframe 내부 접근은 CORS/SOP 제약이 있을 수 있음
function blackoutKeywords(iframe, keywords) {
  try {
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    const walker = document.createTreeWalker(
      iframeDoc.body,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );
    
    const textNodes = [];
    let node;
    while (node = walker.nextNode()) {
      textNodes.push(node);
    }
    
    keywords.forEach(keyword => {
      textNodes.forEach(textNode => {
        const parent = textNode.parentNode;
        const text = textNode.textContent;
        const regex = new RegExp(keyword, 'gi');
        
        if (regex.test(text)) {
          const highlightedText = text.replace(regex, (match) => {
            return `<span class="blackout-keyword">${match}</span>`;
          });
          const wrapper = document.createElement('span');
          wrapper.innerHTML = highlightedText;
          parent.replaceChild(wrapper, textNode);
        }
      });
    });
  } catch (error) {
    // CORS 에러 등으로 실패 시 폴백
    console.error('Keyword blackout failed:', error);
    fallbackToSectionBlur();
  }
}
```

#### 4.3.4 구현 제약사항 및 폴백

##### 브라우저 보안 제약
- **CORS (Cross-Origin Resource Sharing)**: Notion iframe이 다른 도메인이면 접근 불가
- **SOP (Same-Origin Policy)**: iframe 내부 DOM에 직접 접근할 수 없음
- **해결 방안**:
  1. Proxy 서버를 통해 same-origin으로 렌더링 (MVP에서는 제외, 복잡함)
  2. Notion API 사용 (MVP에서는 제외, 공개 링크만 지원)
  3. **폴백 전략**: 실패 시 Section Blur로 자동 전환

##### Notion DOM 구조 변경
- Notion은 주기적으로 DOM 구조를 변경할 수 있음
- 특정 셀렉터로 찾은 요소가 변경되면 키워드를 찾을 수 없음
- **폴백 전략**: 키워드를 찾지 못하면 Section Blur로 자동 전환

#### 4.3.5 폴백 규칙
1. **초기 로드 시 검증**:
   - iframe 로드 후 키워드 블랙아웃 시도
   - 실패하면 즉시 Section Blur로 전환
   
2. **부분 실패 처리**:
   - 일부 키워드만 찾지 못한 경우: 찾은 키워드만 블랙아웃
   - 모든 키워드를 찾지 못한 경우: Section Blur로 전환
   
3. **사용자 알림**:
   - 운영자 콘솔에 "blackout_failed" 로그 노출
   - 사용자에게는 별도 알림 없음 (자동 폴백)

#### 4.3.6 베타 기능 안내
- 운영자 설정 화면에 "베타 기능" 표시
- "Notion DOM 구조 변경 시 자동으로 Section Blur로 전환될 수 있습니다" 안내
- 실패 시 폴백이 자동으로 작동함을 명시

#### 4.3.7 장점
- 매우 정교한 블라인드 (특정 단어만 가림)
- 사용자 경험이 좋음 (콘텐츠 전체가 아니라 핵심만 가려짐)
- "이 부분이 중요하다"는 것을 암시

#### 4.3.8 단점
- 구현이 매우 어려움
- 브라우저 보안 제약으로 인해 실패할 가능성이 높음
- Notion DOM 구조 변경에 취약
- 유지보수 비용이 높음

---

## 구현 정책 (MVP)

### 정책 요약
> **Keyword Blackout은 "가능하면 적용"하되, 실패하면 Section Blur로 자동 전환.**

### 구체적 정책

#### 4.4.1 기본값 설정
- 기본 블라인드 방식: **Preview-Then-Blur** (가장 균형잡힌 선택)
- Section Blur: 간단하고 안정적
- Keyword Blackout: 베타 기능, 고급설정에만 표시

#### 4.4.2 우선순위
1. **Preview-Then-Blur** (권장): 사용자 경험이 좋고 안정적
2. **Section Blur**: 안정성이 최우선일 때
3. **Keyword Blackout**: 정교함이 필요할 때 (베타)

#### 4.4.3 폴백 체인
```
Keyword Blackout 시도
  ↓ 실패
Section Blur로 전환
  ↓ (항상 성공, 안정적)
정상 작동
```

---

## 블라인드 방식 비교표

| 항목 | Section Blur | Preview-Then-Blur | Keyword Blackout |
|------|-------------|-------------------|------------------|
| **구현 난이도** | 쉬움 | 중간 | 매우 어려움 |
| **안정성** | 높음 | 높음 | 낮음 |
| **사용자 경험** | 좋음 | 매우 좋음 | 매우 좋음 |
| **정교함** | 낮음 (구간 단위) | 중간 (구간 단위) | 높음 (단어 단위) |
| **성능** | 좋음 | 좋음 | 중간 (DOM 조작) |
| **브라우저 호환성** | 매우 좋음 | 좋음 | 제한적 (CORS) |
| **유지보수** | 쉬움 | 쉬움 | 어려움 |
| **MVP 권장도** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐ (베타) |

---

## 운영자 설정 가이드

### 5.1 간단 설정 (기본 화면)
- 블라인드 방식 선택:
  - [ ] 섹션 블러 (간단하고 안정적)
  - [ ] 프리뷰 + 블러 (추천, 호기심 유발)
- 블러 구간 위치:
  - [ ] 초반만 공개
  - [ ] 중간부터 잠금
  - [ ] 하단 핵심만 잠금

### 5.2 고급 설정
- 블러 강도: 약 / 중 / 강
- 프리뷰 높이: N줄 또는 N%
- 키워드 블랙아웃 (베타):
  - 키워드 리스트 입력 (줄바꿈)
  - 대소문자 구분 옵션
  - 실패 시 폴백 (Section Blur) 자동 활성화

---

## 기술적 고려사항

### 6.1 성능 최적화
- CSS filter는 GPU 가속을 활용
- 블러 처리 영역을 최소화
- 필요 시 `will-change` 속성 사용

### 6.2 브라우저 호환성
- `backdrop-filter`는 일부 브라우저에서 지원 안 됨 → `filter` 사용
- 구형 브라우저에서는 블러 대신 어둡게만 처리 (fallback)
- iOS Safari의 `-webkit-` prefix 필요

### 6.3 접근성
- 블러 처리된 영역에 스크린 리더가 접근할 수 있도록 고려
- 또는 블러 처리된 영역은 스크린 리더에서 숨김 처리
- 키보드 네비게이션 지원

---

## 향후 개선 방향

### 7.1 MVP 이후 추가 가능한 기능
- 드래그로 블러 구간 직접 지정 (시각적 편집)
- 여러 블러 구간 지원 (현재는 1개)
- 블러 애니메이션 효과
- 사용자 행동 기반 블러 구간 자동 조정 (AI 추천)

### 7.2 Keyword Blackout 개선
- Proxy 서버를 통한 same-origin 렌더링 (고급 구현)
- Notion API 통합 (공개 링크 외에도 지원)
- 키워드 자동 감지 (중요 키워드 추천)






