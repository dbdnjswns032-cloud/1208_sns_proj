# 반응형 테스트 체크리스트

## 화면 크기별 테스트

### Mobile (< 768px)

#### 320px (iPhone SE)
- [ ] Sidebar 숨김 확인
- [ ] Header 표시 확인 (60px 높이)
- [ ] BottomNav 표시 확인 (50px 높이)
- [ ] PostCard 전체 너비 사용 확인
- [ ] 프로필 페이지 세로 레이아웃 확인
- [ ] 터치 인터랙션 정상 작동

#### 375px (iPhone 12/13/14)
- [ ] 모든 Mobile 항목 확인
- [ ] 이미지 비율 유지 확인
- [ ] 텍스트 가독성 확인

#### 414px (iPhone Plus)
- [ ] 모든 Mobile 항목 확인
- [ ] 레이아웃 여백 적절한지 확인

### Tablet (768px ~ 1023px)

#### 768px (iPad Mini)
- [ ] Sidebar 아이콘만 표시 (72px 너비)
- [ ] Header 숨김 확인
- [ ] BottomNav 숨김 확인
- [ ] PostCard 최대 630px 제한 확인
- [ ] 프로필 페이지 가로 레이아웃 확인

#### 834px (iPad Air)
- [ ] 모든 Tablet 항목 확인
- [ ] 그리드 레이아웃 정상 작동

#### 1024px (iPad Pro)
- [ ] Desktop 레이아웃으로 전환 확인

### Desktop (1024px+)

#### 1280px
- [ ] Sidebar 전체 표시 (244px 너비)
- [ ] PostCard 최대 630px 중앙 정렬 확인
- [ ] 프로필 페이지 가로 레이아웃 확인

#### 1440px
- [ ] 모든 Desktop 항목 확인
- [ ] 여백 적절한지 확인

#### 1920px
- [ ] 모든 Desktop 항목 확인
- [ ] 최대 너비 제한 확인

## 컴포넌트별 반응형 테스트

### 레이아웃 컴포넌트

#### Sidebar
- [ ] Mobile: 숨김 (`hidden md:block`)
- [ ] Tablet: 아이콘만 표시 (72px)
- [ ] Desktop: 아이콘 + 텍스트 (244px)
- [ ] Hover 효과 정상 작동
- [ ] Active 상태 표시 정상

#### Header
- [ ] Mobile: 표시 (60px 높이)
- [ ] Tablet/Desktop: 숨김
- [ ] 아이콘 크기 및 간격 확인

#### BottomNav
- [ ] Mobile: 표시 (50px 높이)
- [ ] Tablet/Desktop: 숨김
- [ ] 5개 아이콘 균등 분배 확인

### PostCard
- [ ] 이미지 1:1 비율 유지 (`aspect-square`)
- [ ] Mobile: 전체 너비
- [ ] Desktop: 최대 630px 제한
- [ ] 텍스트 크기 반응형 확인

### PostModal
- [ ] Desktop: 이미지 50% + 댓글 50% 레이아웃
- [ ] Mobile: 세로 레이아웃 (전체 페이지)
- [ ] 이전/다음 버튼 Desktop만 표시

### ProfileHeader
- [ ] Desktop: 가로 레이아웃 (프로필 이미지 150px + 정보)
- [ ] Mobile: 세로 레이아웃 (프로필 이미지 90px 상단, 정보 하단)
- [ ] 통계 표시 반응형 확인

### PostGrid
- [ ] 모든 화면 크기에서 3열 그리드 유지
- [ ] Gap 반응형 (Mobile: gap-1, Desktop: gap-4)
- [ ] Hover 효과 Desktop/Tablet만 표시

## 터치 인터랙션 테스트

### 더블탭 좋아요
- [ ] 이미지 더블탭 시 좋아요 추가
- [ ] 큰 하트 애니메이션 표시
- [ ] 탭 간격 300ms 이내 확인

### 터치 영역
- [ ] 모든 버튼 최소 44px × 44px 확인
- [ ] 터치 반응 정상 작동

### 스크롤
- [ ] 부드러운 스크롤 확인 (`-webkit-overflow-scrolling: touch`)
- [ ] Pull-to-refresh 방지 확인
- [ ] 무한 스크롤 정상 작동

## 브라우저 호환성 테스트

### Desktop 브라우저
- [ ] Chrome (최신 버전)
- [ ] Firefox (최신 버전)
- [ ] Safari (최신 버전)
- [ ] Edge (최신 버전)

### Mobile 브라우저
- [ ] iOS Safari
- [ ] Chrome Mobile
- [ ] Samsung Internet (Android)

## 성능 확인

### 애니메이션 성능
- [ ] 60fps 목표 달성
- [ ] 프레임 드롭 없음
- [ ] GPU 가속 활용 확인

### 이미지 로딩
- [ ] Lazy loading 정상 작동
- [ ] Priority 이미지 즉시 로드
- [ ] 반응형 이미지 크기 적절

## 접근성 확인

### 키보드 네비게이션
- [ ] Tab 키로 모든 인터랙티브 요소 접근 가능
- [ ] Enter/Space 키로 버튼 활성화
- [ ] ESC 키로 모달 닫기
- [ ] 포커스 시각적 표시 확인

### 스크린 리더
- [ ] ARIA 레이블 정상 작동
- [ ] 의미 있는 alt 텍스트 확인
- [ ] 읽기 순서 적절

## 테스트 도구

### 개발자 도구
- Chrome DevTools → Device Toolbar
- Firefox Responsive Design Mode
- Safari Responsive Design Mode

### 온라인 도구
- [Responsive Design Checker](https://responsivedesignchecker.com/)
- [BrowserStack](https://www.browserstack.com/) (실제 디바이스 테스트)

## 테스트 시나리오

1. **모바일 → 태블릿 → 데스크톱 순서로 테스트**
2. **각 화면 크기에서 주요 기능 테스트**
   - 게시물 작성
   - 좋아요
   - 댓글 작성
   - 프로필 보기
   - 팔로우/언팔로우
3. **터치 제스처 테스트** (모바일)
4. **키보드 네비게이션 테스트** (데스크톱)

