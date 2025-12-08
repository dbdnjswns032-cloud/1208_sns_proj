- [x] `.cursor/` 디렉토리
  - [x] `rules/` 커서룰
  - [ ] `mcp.json` MCP 서버 설정
  - [ ] `dir.md` 프로젝트 디렉토리 구조 (docs/DIR.md는 존재)
- [ ] `.github/` 디렉토리
- [ ] `.husky/` 디렉토리
- [x] `app/` 디렉토리
  - [x] `favicon.ico` 파일
  - [ ] `not-found.tsx` 파일
  - [ ] `robots.ts` 파일
  - [ ] `sitemap.ts` 파일
  - [ ] `manifest.ts` 파일
- [x] `supabase/` 디렉토리
- [x] `public/` 디렉토리
  - [x] `icons/` 디렉토리
  - [x] `logo.png` 파일
  - [x] `og-image.png` 파일
- [x] `tsconfig.json` 파일
- [x] `.cursorignore` 파일
- [x] `.gitignore` 파일
- [x] `.prettierignore` 파일
- [x] `.prettierrc` 파일
- [x] `eslint.config.mjs` 파일
- [x] `AGENTS.md` 파일

# 📋 Mini Instagram - 개발 TODO 리스트

## 1. 기본 세팅

- [x] Tailwind CSS 설정 (인스타 컬러 스키마)
  - [x] `app/globals.css`에 Instagram 컬러 변수 추가
  - [x] 타이포그래피 설정
- [x] Supabase 데이터베이스 마이그레이션
  - [x] `db.sql` 파일을 Supabase에 적용 (마이그레이션 파일 생성 완료: `20251208142145_initial_sns_schema.sql`)
  - [x] 테이블 생성 확인 (users, posts, likes, comments, follows)
  - [x] Views 및 Triggers 확인
- [x] Supabase Storage 버킷 생성
  - [x] `posts` 버킷 생성 (공개 읽기) (마이그레이션 파일 생성 완료: `20251208142146_create_posts_storage_bucket.sql`)
  - [x] 업로드 정책 설정
- [x] TypeScript 타입 정의
  - [x] `lib/types.ts` 파일 생성
  - [x] User, Post, Like, Comment, Follow 타입 정의

## 2. 레이아웃 구조

- [x] `app/(main)/layout.tsx` 생성
  - [x] Sidebar 통합
  - [x] 반응형 레이아웃 (Desktop/Tablet/Mobile)
- [x] `components/layout/Sidebar.tsx`
  - [x] Desktop: 244px 너비, 아이콘 + 텍스트
  - [x] Tablet: 72px 너비, 아이콘만
  - [x] Mobile: 숨김
  - [x] 메뉴 항목: 홈, 검색, 만들기, 프로필
  - [x] Hover 효과 및 Active 상태 스타일
- [x] `components/layout/Header.tsx`
  - [x] Mobile 전용 (60px 높이)
  - [x] 로고 + 알림/DM/프로필 아이콘
- [x] `components/layout/BottomNav.tsx`
  - [x] Mobile 전용 (50px 높이)
  - [x] 5개 아이콘: 홈, 검색, 만들기, 좋아요, 프로필

## 3. 홈 피드 페이지

- [x] `app/(main)/page.tsx` 생성
  - [x] PostFeed 컴포넌트 통합
  - [x] 배경색 #FAFAFA 설정
- [x] `components/post/PostCard.tsx`
  - [x] 헤더 (프로필 이미지 32px, 사용자명, 시간, ⋯ 메뉴)
  - [x] 이미지 영역 (1:1 정사각형)
  - [x] 액션 버튼 (좋아요, 댓글, 공유, 북마크)
  - [x] 좋아요 수 표시
  - [x] 캡션 (사용자명 Bold + 내용, 2줄 초과 시 "... 더 보기")
  - [x] 댓글 미리보기 (최신 2개)
- [x] `components/post/PostCardSkeleton.tsx`
  - [x] 로딩 UI (Skeleton + Shimmer 효과)
- [x] `components/post/PostFeed.tsx`
  - [x] 게시물 목록 렌더링
  - [x] 무한 스크롤 (Intersection Observer)
  - [x] 페이지네이션 (10개씩)
- [x] `app/api/posts/route.ts`
  - [x] GET: 게시물 목록 조회 (시간 역순 정렬)
  - [x] 페이지네이션 지원 (limit, offset)
  - [x] userId 파라미터 지원 (프로필 페이지용)

## 4. 좋아요 기능

- [x] `app/api/likes/route.ts`
  - [x] POST: 좋아요 추가
  - [x] DELETE: 좋아요 제거
  - [x] 인증 검증 (Clerk)
- [x] `components/post/LikeButton.tsx`
  - [x] 빈 하트 ↔ 빨간 하트 상태 관리
  - [x] 클릭 애니메이션 (scale 1.3 → 1)
  - [x] 더블탭 좋아요 (모바일, 큰 하트 fade in/out)
- [x] PostCard에 LikeButton 통합
  - [x] 좋아요 상태 표시
  - [x] 좋아요 수 실시간 업데이트

## 5. 게시물 작성

- [x] `components/post/CreatePostModal.tsx`
  - [x] Dialog 컴포넌트 사용
  - [x] 이미지 미리보기 UI
  - [x] 텍스트 입력 필드 (최대 2,200자)
  - [x] 파일 선택 버튼
  - [x] 업로드 버튼
- [x] `app/api/posts/route.ts`
  - [x] POST: 게시물 생성
  - [x] 이미지 파일 검증 (최대 5MB)
  - [x] Supabase Storage 업로드
  - [x] posts 테이블에 데이터 저장
  - [x] 인증 검증 (Clerk)
- [x] Sidebar "만들기" 버튼 연결
  - [x] CreatePostModal 열기

## 6. 댓글 기능

- [x] `components/comment/CommentList.tsx`
  - [x] 댓글 목록 렌더링
  - [x] PostCard: 최신 2개만 표시
  - [x] 상세 모달: 전체 댓글 + 스크롤
  - [x] 삭제 버튼 (본인만 표시)
- [x] `components/comment/CommentForm.tsx`
  - [x] 댓글 입력 필드 ("댓글 달기...")
  - [x] Enter 키 또는 "게시" 버튼으로 제출
- [x] `app/api/comments/route.ts`
  - [x] POST: 댓글 작성
  - [x] DELETE: 댓글 삭제 (본인만)
  - [x] 인증 검증 (Clerk)
- [x] PostCard에 댓글 기능 통합
  - [x] CommentList 통합
  - [x] CommentForm 통합

## 7. 게시물 상세 모달

### 7.1. PostModal 컴포넌트 생성

- [x] `components/post/PostModal.tsx` 파일 생성
  - [x] Props 인터페이스 정의
    - [x] `postId: string` (필수)
    - [x] `isOpen: boolean` (필수)
    - [x] `onClose: () => void` (필수)
    - [x] `initialPost?: PostWithStatsAndUser` (선택, 이미 로드된 게시물 데이터)
    - [x] `allPosts?: PostWithStatsAndUser[]` (이전/다음 네비게이션용)
  - [x] Dialog 컴포넌트 사용 (shadcn/ui)
  - [x] 반응형 레이아웃 구현
    - [x] Desktop (1024px+): 모달 형식 (이미지 50% + 댓글 50%)
    - [x] Mobile (< 1024px): 전체 페이지로 전환 (DialogContent 커스터마이징)
  - [x] 닫기 버튼 (✕) 구현
    - [x] 우측 상단에 배치
    - [x] 클릭 시 `onClose` 호출
    - [x] ESC 키로도 닫기 가능 (Dialog 기본 기능)
  - [x] 이전/다음 게시물 네비게이션 (Desktop만)
    - [x] 좌측/우측 화살표 버튼
    - [x] 현재 게시물 기준 이전/다음 게시물 ID 조회
    - [x] 클릭 시 해당 게시물로 이동 (모달 내용 업데이트)
    - [x] 첫 번째/마지막 게시물일 경우 버튼 비활성화

### 7.2. 모달 내부 레이아웃 구성

- [x] 좌측 영역: 이미지 표시
  - [x] Next.js Image 컴포넌트 사용
  - [x] 1:1 비율 유지 (정사각형)
  - [x] Desktop: 50% 너비
  - [x] Mobile: 전체 너비
  - [x] 더블탭 좋아요 기능 (PostCard와 동일)
- [x] 우측 영역: 게시물 정보 + 댓글 (Desktop만)
  - [x] 헤더 섹션
    - [x] 프로필 이미지 (32px 원형)
    - [x] 사용자명 (프로필 링크)
    - [x] ⋯ 메뉴 버튼 (게시물 삭제 등, 추후 구현)
  - [x] 게시물 내용 섹션
    - [x] 캡션 표시 (전체 내용, 줄바꿈 유지)
    - [x] 시간 표시 (date-fns 사용)
  - [x] 댓글 목록 섹션
    - [x] CommentList 컴포넌트 재사용
    - [x] `showAll={true}` prop 전달 (전체 댓글 표시)
    - [x] 스크롤 가능한 영역 (max-height 설정)
  - [x] 액션 버튼 섹션
    - [x] LikeButton 통합
    - [x] 좋아요 수 표시
    - [x] 댓글, 공유, 북마크 아이콘 (UI만)
  - [x] 댓글 작성 폼
    - [x] CommentForm 컴포넌트 재사용
    - [x] 댓글 추가 후 목록 자동 업데이트

### 7.3. 게시물 데이터 로딩

- [x] 게시물 상세 정보 로드
  - [x] `initialPost` prop이 있으면 사용 (이미 로드된 데이터)
  - [x] 없으면 `/api/posts?postId={postId}` API 호출
  - [x] 로딩 상태 표시 (Spinner)
  - [x] 에러 처리 (게시물을 찾을 수 없음 등)
- [x] 이전/다음 게시물 ID 조회
  - [x] 클라이언트에서 PostFeed의 게시물 목록 활용 (`allPosts` prop)

### 7.4. PostCard와 통합

- [x] PostCard 클릭 이벤트 추가
  - [x] 이미지 영역 클릭 시 모달 열기
  - [x] 댓글 "모두 보기" 링크 클릭 시 모달 열기
  - [x] 모달에 `postId` 전달
  - [x] `initialPost` prop으로 현재 게시물 데이터 전달 (불필요한 API 호출 방지)
- [x] PostFeed에서 PostModal 상태 관리
  - [x] `useState`로 현재 열린 모달의 `postId` 관리
  - [x] 여러 PostCard에서 동일한 PostModal 인스턴스 공유
  - [x] 모달 닫기 시 상태 초기화

### 7.5. 모바일 반응형 처리

- [x] Mobile 레이아웃
  - [x] DialogContent를 전체 화면으로 확장
  - [x] 이미지가 상단에 배치
  - [x] 게시물 정보와 댓글이 하단에 스크롤 가능하게 배치
  - [x] 닫기 버튼은 상단 고정
- [x] 터치 제스처 지원
  - [ ] 스와이프로 닫기 (선택사항, 추후 구현 가능)
  - [x] 이미지 더블탭 좋아요 (PostCard와 동일)

### 7.6. API 엔드포인트 (필요시)

- [x] 단일 게시물 조회 API
  - [x] 기존 `/api/posts`에 `postId` 쿼리 파라미터 추가
  - [x] GET: 특정 게시물 상세 정보 조회
  - [x] PostWithStatsAndUser 타입 반환

### 7.7. 접근성 및 UX 개선

- [x] 키보드 네비게이션
  - [x] ESC 키로 모달 닫기 (Dialog 기본 기능)
  - [ ] 좌/우 화살표 키로 이전/다음 게시물 이동 (선택사항)
- [x] 포커스 관리
  - [x] 모달 열릴 때 첫 번째 포커스 가능한 요소로 포커스 이동 (Dialog 기본 기능)
  - [x] 모달 닫힐 때 이전 포커스 위치로 복귀 (Dialog 기본 기능)
- [x] 스크롤 잠금
  - [x] 모달 열릴 때 배경 스크롤 방지 (Dialog 기본 기능)
- [x] 애니메이션
  - [x] 모달 열기/닫기 애니메이션 (Dialog 기본 기능)
  - [x] 더블탭 좋아요 큰 하트 애니메이션 (fadeInOut)

## 8. 프로필 페이지

### 8.1. 동적 라우트 생성

- [x] `app/(main)/profile/[userId]/page.tsx` 파일 생성
  - [x] Next.js 15 동적 라우트 구현 (`params`는 async로 받기)
  - [x] `userId` 파라미터 파싱 (clerk_id 사용)
  - [x] Server Component로 사용자 정보 및 게시물 초기 로드
  - [x] ProfileHeader 컴포넌트 통합
  - [x] PostGrid 컴포넌트 통합
  - [x] 에러 처리 (사용자를 찾을 수 없음 등)
  - [x] 본인 프로필 여부 확인 (Clerk `auth()` 사용)

### 8.2. ProfileHeader 컴포넌트

- [x] `components/profile/ProfileHeader.tsx` 파일 생성
  - [x] Props 인터페이스 정의
    - [x] `user: UserWithStats` (필수)
    - [x] `isOwnProfile: boolean` (필수)
    - [x] `isFollowing?: boolean` (선택, 팔로우 상태)
    - [x] `onFollowChange?: (isFollowing: boolean) => void` (선택, 팔로우 상태 변경 콜백)
  - [x] 반응형 레이아웃
    - [x] Desktop: 가로 레이아웃 (프로필 이미지 + 정보)
    - [x] Mobile: 세로 레이아웃 (프로필 이미지 상단, 정보 하단)
  - [x] 프로필 이미지
    - [x] Desktop: 150px 원형
    - [x] Mobile: 90px 원형
    - [x] 기본 아바타 (이름 첫 글자)
  - [x] 사용자 정보 섹션
    - [x] 사용자명 (Bold, 큰 글씨)
    - [x] 통계 표시
      - [x] 게시물 수 (`posts_count`)
      - [x] 팔로워 수 (`followers_count`)
      - [x] 팔로잉 수 (`following_count`)
      - [x] 클릭 가능한 버튼 (추후 팔로워/팔로잉 목록 모달, 1차 제외)
  - [x] 액션 버튼
    - [x] 본인 프로필: "프로필 편집" 버튼 (링크만, 1차 제외)
    - [x] 다른 사람 프로필: 팔로우 버튼 (UI만, Phase 9에서 기능 구현)
      - [x] "팔로우" 버튼 (파란색, 미팔로우 상태)
      - [x] "팔로잉" 버튼 (회색, 팔로우 중 상태)
      - [x] Hover 시 "언팔로우" (빨간 테두리)

### 8.3. PostGrid 컴포넌트

- [x] `components/profile/PostGrid.tsx` 파일 생성
  - [x] Props 인터페이스 정의
    - [x] `posts: PostWithStatsAndUser[]` (필수)
    - [x] `onPostClick?: (postId: string) => void` (선택, 게시물 클릭 핸들러)
  - [x] 3열 그리드 레이아웃
    - [x] Desktop: 3열 고정
    - [x] Tablet: 3열 고정
    - [x] Mobile: 3열 고정 (반응형으로 조정 가능)
    - [x] `grid-cols-3` Tailwind 클래스 사용
  - [x] 게시물 썸네일
    - [x] 1:1 정사각형 비율 유지 (`aspect-square`)
    - [x] Next.js Image 컴포넌트 사용
    - [x] `object-cover`로 이미지 크롭
    - [x] 게시물이 없을 경우 빈 상태 표시
  - [x] Hover 효과
    - [x] Desktop/Tablet: 마우스 hover 시 오버레이 표시
      - [x] 좋아요 수 표시 (❤️ 아이콘 + 숫자)
      - [x] 댓글 수 표시 (💬 아이콘 + 숫자)
      - [x] 반투명 검은 배경
      - [x] 흰색 텍스트
    - [x] Mobile: hover 효과 없음 (터치 디바이스)
  - [x] 클릭 이벤트
    - [x] 게시물 썸네일 클릭 시 `onPostClick` 호출
    - [x] PostModal 열기 (PostFeed와 동일한 방식)

### 8.4. API 엔드포인트

- [x] `app/api/users/[userId]/route.ts` 파일 생성
  - [x] GET: 사용자 정보 조회
    - [x] `userId` 파라미터 파싱 (clerk_id)
    - [x] `user_stats` 뷰에서 데이터 조회
      - [x] `user_id`, `clerk_id`, `name`
      - [x] `posts_count`, `followers_count`, `following_count`
    - [x] 사용자를 찾을 수 없을 경우 404 에러
    - [x] `UserWithStats` 타입 반환
    - [x] `users` 테이블에서 `created_at` 조회

### 8.5. Sidebar 프로필 버튼 연결

- [x] `components/layout/Sidebar.tsx` 수정
  - [x] "프로필" 메뉴 항목 클릭 이벤트 추가
  - [x] Clerk `useUser()` 훅으로 현재 사용자 정보 가져오기
  - [x] `/profile/[clerk_id]`로 리다이렉트
- [x] `components/layout/BottomNav.tsx` 수정
  - [x] "프로필" 메뉴 항목 클릭 이벤트 추가
  - [x] 동일한 로직 적용

### 8.6. 프로필 페이지 통합

- [x] 프로필 페이지에서 PostModal 통합
  - [x] PostGrid의 게시물 클릭 시 PostModal 열기
  - [x] PostFeed와 동일한 모달 상태 관리
  - [x] 이전/다음 게시물 네비게이션 (프로필 페이지의 게시물 목록 기준)

### 8.7. 반응형 및 스타일링

- [x] Desktop 레이아웃
  - [x] 프로필 이미지와 정보 가로 배치
  - [x] 통계 숫자 클릭 가능한 버튼 스타일
  - [x] 3열 그리드 고정 너비
- [x] Mobile 레이아웃
  - [x] 프로필 이미지 상단 중앙 배치
  - [x] 사용자 정보 하단 배치
  - [x] 통계 가로 배치 (3개)
  - [x] 액션 버튼 전체 너비
  - [x] 3열 그리드 유지 (작은 썸네일)

### 8.8. 에러 처리 및 최적화

- [x] 에러 처리
  - [x] 사용자를 찾을 수 없을 경우 에러 메시지 표시
  - [x] API 호출 실패 시 사용자 친화적 에러 메시지
- [x] 성능 최적화
  - [x] 이미지 lazy loading (Next.js Image 기본)
  - [x] 초기 데이터는 Server Component에서 로드
  - [x] 클라이언트 사이드 네비게이션 최적화

## 9. 팔로우 기능

### 9.1. API 엔드포인트

- [x] `app/api/follows/route.ts` 파일 생성
  - [x] POST: 팔로우 추가
    - [x] 인증 검증 (Clerk `auth()`)
    - [x] 요청 본문에서 `followingId` (clerk_id) 파싱
    - [x] Clerk User ID로 Supabase User ID 조회
    - [x] `followingId`로 대상 사용자의 Supabase User ID 조회
    - [x] 자기 자신 팔로우 방지 (`follower_id !== following_id`)
    - [x] 중복 팔로우 방지 (UNIQUE 제약 조건 확인)
    - [x] `follows` 테이블에 팔로우 관계 추가
    - [x] 성공 시 201 응답 반환
  - [x] DELETE: 팔로우 제거
    - [x] 인증 검증 (Clerk `auth()`)
    - [x] 쿼리 파라미터에서 `followingId` (clerk_id) 파싱
    - [x] Clerk User ID로 Supabase User ID 조회
    - [x] `followingId`로 대상 사용자의 Supabase User ID 조회
    - [x] `follows` 테이블에서 팔로우 관계 삭제
    - [x] 성공 시 200 응답 반환
  - [x] 에러 처리
    - [x] 인증되지 않은 사용자: 401 에러
    - [x] 사용자를 찾을 수 없음: 404 에러
    - [x] 자기 자신 팔로우 시도: 400 에러
    - [x] 중복 팔로우: 409 에러
    - [x] 기타 에러: 500 에러

### 9.2. FollowButton 컴포넌트

- [x] `components/profile/FollowButton.tsx` 파일 생성
  - [x] Props 인터페이스 정의
    - [x] `followingId: string` (필수, 팔로우할 사용자의 clerk_id)
    - [x] `initialIsFollowing: boolean` (필수, 초기 팔로우 상태)
    - [x] `onFollowChange?: (isFollowing: boolean) => void` (선택, 팔로우 상태 변경 콜백)
    - [x] `className?: string` (선택, 추가 스타일)
  - [x] 상태 관리
    - [x] `isFollowing` 상태 (초기값: `initialIsFollowing`)
    - [x] `isLoading` 상태 (API 호출 중)
    - [x] `isHovering` 상태 (hover 효과용)
    - [x] `useEffect`로 `initialIsFollowing` 변경 시 상태 업데이트
  - [x] 버튼 스타일
    - [x] 미팔로우 상태: "팔로우" 버튼
      - [x] 파란색 배경 (`bg-[var(--instagram-blue)]`)
      - [x] 흰색 텍스트
      - [x] hover 시 더 진한 파란색
    - [x] 팔로우 중 상태: "팔로잉" 버튼
      - [x] 회색 배경 (`bg-[var(--instagram-card-background)]`)
      - [x] 회색 테두리 (`border border-[var(--instagram-border)]`)
      - [x] 검은색 텍스트
      - [x] hover 시 빨간 테두리 및 빨간 텍스트 ("언팔로우")
  - [x] 클릭 이벤트
    - [x] 클릭 시 즉시 Optimistic UI 업데이트
    - [x] API 호출 (POST 또는 DELETE)
    - [x] 성공 시 상태 업데이트 및 `onFollowChange` 콜백 호출
    - [x] 실패 시 UI 롤백 및 에러 메시지 표시
  - [x] 로딩 상태
    - [x] API 호출 중 버튼 비활성화
    - [x] disabled 스타일 적용

### 9.3. 프로필 페이지 팔로우 상태 확인

- [x] `app/(main)/profile/[userId]/page.tsx` 수정
  - [x] 팔로우 상태 확인 함수 추가 (`getFollowStatus`)
    - [x] 현재 로그인한 사용자의 Clerk ID 가져오기
    - [x] `follows` 테이블에서 팔로우 관계 조회
    - [x] `follower_id` = 현재 사용자, `following_id` = 프로필 사용자
    - [x] 팔로우 상태 반환 (boolean)
  - [x] Server Component에서 초기 팔로우 상태 로드
    - [x] 본인 프로필이 아닌 경우에만 확인
    - [x] `initialIsFollowing` prop으로 ProfileHeader에 전달

### 9.4. ProfileHeader 통합

- [x] `components/profile/ProfileHeader.tsx` 수정
  - [x] FollowButton 컴포넌트 import
  - [x] 본인 프로필이 아닌 경우 FollowButton 표시
  - [x] 팔로우 상태 관리
    - [x] `initialIsFollowing` prop 받기
    - [x] `useState`로 팔로우 상태 관리
    - [x] `onFollowChange` 콜백으로 상태 업데이트
  - [x] 통계 실시간 업데이트
    - [x] 팔로우 추가 시: `followers_count` 증가 (Optimistic UI)
    - [x] 팔로우 제거 시: `followers_count` 감소 (Optimistic UI)
    - [x] `useState`로 팔로워 수 관리

### 9.5. 팔로우 상태 관리 (클라이언트)

- [x] 프로필 페이지 클라이언트 상태 관리
  - [x] ProfileHeader를 Client Component로 유지
  - [x] 팔로우 상태를 클라이언트에서 관리
    - [x] 초기 상태는 Server Component에서 전달 (`initialIsFollowing`)
    - [x] 팔로우/언팔로우 후 상태 업데이트
  - [x] 통계 업데이트
    - [x] 팔로우 추가: `followers_count++` (Optimistic UI)
    - [x] 팔로우 제거: `followers_count--` (Optimistic UI)
    - [x] `useState`로 팔로워 수 관리

### 9.6. 에러 처리 및 UX 개선

- [x] 에러 처리
  - [x] 네트워크 에러 처리
  - [x] API 에러 메시지 표시 (alert 사용)
  - [x] Optimistic UI 실패 시 롤백
- [x] UX 개선
  - [x] 버튼 클릭 시 즉시 피드백 (Optimistic UI)
  - [x] 중복 클릭 방지 (로딩 중 버튼 비활성화)
  - [x] hover 효과 (팔로잉 버튼 hover 시 "언팔로우" 표시)

### 9.7. 통계 업데이트 최적화

- [x] `user_stats` 뷰 자동 업데이트
  - [x] `follows` 테이블 변경 시 뷰가 자동으로 업데이트됨 (데이터베이스 뷰 특성)
  - [x] 클라이언트에서 Optimistic UI로 즉시 반영
  - [x] Optimistic UI만 사용 (더 빠른 UX)

## 10. 게시물 삭제

- [ ] `app/api/posts/[postId]/route.ts`
  - [ ] DELETE: 게시물 삭제
  - [ ] 본인만 삭제 가능 (인증 검증)
  - [ ] Supabase Storage에서 이미지 삭제
- [ ] PostCard ⋯ 메뉴
  - [ ] 본인 게시물만 삭제 옵션 표시
  - [ ] 삭제 확인 다이얼로그
  - [ ] 삭제 후 피드에서 제거

## 11. 반응형 및 애니메이션

- [ ] 반응형 브레이크포인트 적용
  - [ ] Mobile (< 768px): BottomNav, Header 표시
  - [ ] Tablet (768px ~ 1023px): Icon-only Sidebar
  - [ ] Desktop (1024px+): Full Sidebar
- [ ] 좋아요 애니메이션
  - [ ] 클릭 시 scale(1.3) → scale(1) (0.15초)
  - [ ] 더블탭 시 큰 하트 fade in/out (1초)
- [ ] 로딩 상태
  - [ ] Skeleton UI (PostCardSkeleton)
  - [ ] Shimmer 효과

## 12. 에러 핸들링 및 최적화

- [ ] 에러 핸들링
  - [ ] API 에러 처리
  - [ ] 사용자 친화적 에러 메시지
  - [ ] 네트워크 에러 처리
- [ ] 이미지 최적화
  - [ ] Next.js Image 컴포넌트 사용
  - [ ] Lazy loading
- [ ] 성능 최적화
  - [ ] React.memo 적용 (필요한 컴포넌트)
  - [ ] useMemo, useCallback 활용

## 13. 최종 마무리

- [ ] 모바일/태블릿 반응형 테스트
  - [ ] 다양한 화면 크기에서 테스트
  - [ ] 터치 인터랙션 테스트
- [ ] 접근성 검토
  - [ ] 키보드 네비게이션
  - [ ] ARIA 레이블
- [ ] 코드 정리
  - [ ] 불필요한 주석 제거
  - [ ] 코드 포맷팅
- [ ] 배포 준비
  - [ ] 환경 변수 설정
  - [ ] Vercel 배포 설정
  - [ ] 프로덕션 빌드 테스트
