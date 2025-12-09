# 성능 측정 및 검증 가이드

이 문서는 Mini Instagram 프로젝트의 성능 측정 및 검증 방법을 안내합니다.

## 목표

- **모바일 성능 점수**: 80+ (Lighthouse)
- **데스크톱 성능 점수**: 90+ (Lighthouse)
- **애니메이션 성능**: 60fps 유지
- **이미지 로딩**: 최적화된 크기 및 lazy loading

---

## 1. Lighthouse 성능 점수 확인

### 1.1 수동 테스트 방법

1. **Chrome DevTools 열기**
   - `F12` 또는 `Cmd+Option+I` (Mac)
   - `Ctrl+Shift+I` (Windows/Linux)

2. **Lighthouse 탭 선택**
   - DevTools 상단의 "Lighthouse" 탭 클릭

3. **설정 구성**
   - **Device**: Mobile 또는 Desktop 선택
   - **Categories**: Performance 체크
   - **Mode**: Navigation (기본)

4. **테스트 실행**
   - "Analyze page load" 버튼 클릭
   - 결과 대기 (약 30초~1분)

5. **결과 확인**
   - Performance 점수 확인
   - 주요 메트릭 확인:
     - **First Contentful Paint (FCP)**: < 1.8초 (모바일), < 1.0초 (데스크톱)
     - **Largest Contentful Paint (LCP)**: < 2.5초 (모바일), < 2.0초 (데스크톱)
     - **Time to Interactive (TTI)**: < 3.8초 (모바일), < 3.0초 (데스크톱)
     - **Total Blocking Time (TBT)**: < 200ms (모바일), < 100ms (데스크톱)
     - **Cumulative Layout Shift (CLS)**: < 0.1

### 1.2 성능 개선 체크리스트

- [ ] **코드 스플리팅**: 모달 컴포넌트 동적 import 적용
- [ ] **이미지 최적화**: Next.js Image 컴포넌트 사용, 적절한 `sizes` 속성
- [ ] **Lazy Loading**: 첫 화면 외 이미지 lazy loading
- [ ] **번들 크기**: 불필요한 의존성 제거, tree-shaking 확인
- [ ] **폰트 최적화**: 시스템 폰트 사용 (이미 적용됨)
- [ ] **CSS 최적화**: 사용하지 않는 CSS 제거
- [ ] **JavaScript 최적화**: 불필요한 코드 제거, minification 확인

### 1.3 Lighthouse CI 설정 (선택사항)

프로젝트 루트에 `.lighthouserc.js` 파일 생성:

```javascript
module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:3000'],
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.8 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],
      },
    },
  },
};
```

---

## 2. React DevTools Profiler 분석

### 2.1 Profiler 설치

1. **React DevTools 확장 프로그램 설치**
   - Chrome: [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)
   - Firefox: [React Developer Tools](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/)

2. **Profiler 탭 열기**
   - DevTools에서 "Profiler" 탭 선택

### 2.2 리렌더링 분석 방법

1. **프로파일링 시작**
   - "Record" 버튼 클릭
   - 앱에서 주요 동작 수행 (스크롤, 좋아요, 댓글 작성 등)
   - "Stop" 버튼 클릭

2. **결과 분석**
   - **Flamegraph**: 컴포넌트별 렌더링 시간 확인
   - **Ranked**: 렌더링 시간이 긴 컴포넌트 순서대로 표시
   - **Interactions**: 사용자 인터랙션별 성능 확인

3. **최적화 포인트 식별**
   - 렌더링 시간이 긴 컴포넌트 확인
   - 불필요한 리렌더링 발생 여부 확인
   - `React.memo`, `useMemo`, `useCallback` 적용 검토

### 2.3 주요 컴포넌트 분석 대상

- `PostFeed`: 게시물 목록 렌더링
- `PostCard`: 개별 게시물 카드
- `PostModal`: 게시물 상세 모달
- `CommentList`: 댓글 목록
- `ProfileHeader`: 프로필 헤더

### 2.4 최적화 가이드

- **불필요한 리렌더링 방지**
  - `React.memo`로 컴포넌트 메모이제이션
  - `useMemo`로 계산된 값 메모이제이션
  - `useCallback`으로 핸들러 함수 메모이제이션

- **Context 최적화**
  - Context 값 메모이제이션
  - Context Provider 분리 (필요시)

- **상태 관리 최적화**
  - 상태 업데이트 최소화
  - 로컬 상태 vs 전역 상태 구분

---

## 3. 네트워크 탭 이미지 로딩 확인

### 3.1 이미지 최적화 확인 체크리스트

- [ ] **Next.js Image 컴포넌트 사용**: 모든 이미지에 `next/image` 사용
- [ ] **적절한 `sizes` 속성**: 반응형 이미지 크기 지정
- [ ] **Lazy Loading**: 첫 화면 외 이미지 `loading="lazy"` 적용
- [ ] **Priority 설정**: 첫 화면 이미지 `priority` 속성 적용
- [ ] **이미지 포맷**: WebP 사용 (Next.js 자동 변환)

### 3.2 네트워크 탭 확인 방법

1. **DevTools 네트워크 탭 열기**
   - `F12` → "Network" 탭
   - 필터: "Img" 선택

2. **이미지 로딩 확인**
   - 이미지 크기 확인 (KB)
   - 로딩 시간 확인 (ms)
   - 이미지 포맷 확인 (WebP, JPEG, PNG)

3. **최적화 확인**
   - 적절한 이미지 크기 로드 여부
   - Lazy loading 동작 확인
   - 이미지 포맷 최적화 확인

### 3.3 이미지 최적화 가이드

**PostCard 이미지**:
```tsx
<Image
  src={post.image_url}
  alt={`${post.user.name}의 게시물`}
  width={630}
  height={630}
  sizes="(max-width: 768px) 100vw, 630px"
  loading={index < 3 ? "eager" : "lazy"}
  priority={index < 3}
/>
```

**PostGrid 썸네일**:
```tsx
<Image
  src={post.image_url}
  alt={`${post.user.name}의 게시물`}
  width={210}
  height={210}
  sizes="(max-width: 768px) 33vw, 210px"
  loading="lazy"
/>
```

---

## 4. 실제 디바이스 테스트

### 4.1 iOS Safari 테스트

1. **디바이스 준비**
   - iPhone 또는 iPad
   - Safari 브라우저

2. **테스트 항목**
   - [ ] 레이아웃 반응형 확인
   - [ ] 터치 제스처 동작 확인 (더블탭 좋아요)
   - [ ] 스크롤 성능 확인
   - [ ] 이미지 로딩 확인
   - [ ] 모달 동작 확인

3. **성능 확인**
   - Safari Web Inspector 사용
   - `Settings > Safari > Advanced > Web Inspector` 활성화
   - Mac Safari에서 `Develop > [Device] > [Page]` 선택

### 4.2 Android Chrome 테스트

1. **디바이스 준비**
   - Android 스마트폰 또는 태블릿
   - Chrome 브라우저

2. **테스트 항목**
   - [ ] 레이아웃 반응형 확인
   - [ ] 터치 제스처 동작 확인
   - [ ] 스크롤 성능 확인
   - [ ] 이미지 로딩 확인
   - [ ] 모달 동작 확인

3. **성능 확인**
   - Chrome DevTools 원격 디버깅
   - `chrome://inspect`에서 디바이스 연결
   - DevTools에서 성능 측정

### 4.3 터치 제스처 동작 확인

- [ ] **더블탭 좋아요**: 이미지 더블탭 시 좋아요 동작
- [ ] **스와이프 닫기**: 모달 스와이프로 닫기 (구현 시)
- [ ] **터치 영역**: 최소 44px × 44px 확인
- [ ] **스크롤 부드러움**: 부드러운 스크롤 동작 확인

---

## 5. 애니메이션 성능 확인 (60fps)

### 5.1 Chrome DevTools Performance 탭 사용

1. **Performance 탭 열기**
   - `F12` → "Performance" 탭

2. **프로파일링 시작**
   - "Record" 버튼 클릭
   - 애니메이션 동작 수행 (좋아요 클릭, 모달 열기 등)
   - "Stop" 버튼 클릭

3. **결과 분석**
   - **FPS 차트**: 60fps 유지 여부 확인
   - **프레임 드롭**: 빨간색 영역 확인
   - **렌더링 시간**: 각 프레임의 렌더링 시간 확인

### 5.2 60fps 목표 달성 확인 방법

- **FPS 차트**: 녹색 영역 (60fps) 유지
- **프레임 시간**: 16.67ms 이하 유지
- **프레임 드롭**: 최소화 (빨간색 영역 최소화)

### 5.3 프레임 드롭 발생 시 개선 방법

1. **애니메이션 최적화**
   - `transform`과 `opacity`만 사용 (GPU 가속)
   - `will-change` 속성 적절히 사용
   - `requestAnimationFrame` 사용

2. **리렌더링 최소화**
   - 불필요한 리렌더링 방지
   - `React.memo`, `useMemo`, `useCallback` 활용

3. **이미지 최적화**
   - 이미지 크기 최적화
   - Lazy loading 적용

4. **CSS 최적화**
   - 복잡한 CSS 선택자 피하기
   - 레이아웃 변경 최소화

### 5.4 주요 애니메이션 성능 확인 대상

- **좋아요 애니메이션**: 하트 클릭 시 scale 애니메이션
- **더블탭 큰 하트**: fade in/out 애니메이션
- **모달 열기/닫기**: Dialog 애니메이션
- **스크롤**: 무한 스크롤 동작

---

## 6. 성능 측정 결과 기록

### 6.1 측정 결과 템플릿

```markdown
## 측정 일자: YYYY-MM-DD

### Lighthouse 점수
- **모바일**: XX/100
- **데스크톱**: XX/100

### 주요 메트릭
- **FCP**: X.X초
- **LCP**: X.X초
- **TTI**: X.X초
- **TBT**: XXXms
- **CLS**: X.XX

### 개선 사항
- [ ] 항목 1
- [ ] 항목 2
```

### 6.2 정기적인 성능 측정

- **배포 전**: 모든 주요 변경사항 후 측정
- **주간**: 정기적인 성능 모니터링
- **월간**: 종합 성능 리뷰

---

## 참고 자료

- [Lighthouse Documentation](https://developer.chrome.com/docs/lighthouse/)
- [React Profiler API](https://react.dev/reference/react/Profiler)
- [Web Vitals](https://web.dev/vitals/)
- [Chrome DevTools Performance](https://developer.chrome.com/docs/devtools/performance/)

