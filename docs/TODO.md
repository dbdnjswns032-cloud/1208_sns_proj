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

### 10.1. API 엔드포인트

- [x] `app/api/posts/[postId]/route.ts` 파일 생성
  - [x] DELETE: 게시물 삭제
    - [x] 인증 검증 (Clerk `auth()`)
    - [x] `postId` 파라미터 파싱
    - [x] Clerk User ID로 Supabase User ID 조회
    - [x] 게시물 소유자 확인 (`posts.user_id`와 현재 사용자 ID 비교)
    - [x] 본인 게시물만 삭제 가능 (403 에러 처리)
    - [x] 게시물 이미지 URL에서 Storage 경로 추출
      - [x] `extractStoragePath` 함수로 URL에서 경로 파싱
      - [x] `/storage/v1/object/public/posts/{path}` 형식에서 경로 추출
    - [x] Supabase Storage에서 이미지 삭제
      - [x] `posts` 버킷에서 파일 삭제
      - [x] Service Role 클라이언트 사용 (RLS 우회)
      - [x] Storage 삭제 실패 시 경고만 표시하고 DB 삭제는 진행
    - [x] `posts` 테이블에서 게시물 삭제
      - [x] CASCADE로 인해 `likes`, `comments`도 자동 삭제됨
    - [x] 성공 시 200 응답 반환
  - [x] 에러 처리
    - [x] 인증되지 않은 사용자: 401 에러
    - [x] 게시물을 찾을 수 없음: 404 에러
    - [x] 본인 게시물이 아님: 403 에러
    - [x] Storage 삭제 실패: 경고만 표시 (DB 삭제는 진행)
    - [x] 기타 에러: 500 에러

### 10.2. PostCard ⋯ 메뉴 구현

- [x] `components/post/PostCard.tsx` 수정
  - [x] ⋯ 메뉴 버튼 클릭 이벤트 추가
  - [x] shadcn/ui DropdownMenu 사용
  - [x] 본인 게시물 확인
    - [x] `useUser()` 훅으로 현재 사용자 ID 가져오기
    - [x] `post.user.clerk_id`와 비교
  - [x] 본인 게시물인 경우에만 "삭제" 옵션 표시
  - [x] 삭제 옵션 클릭 시 확인 다이얼로그 표시
    - [x] shadcn/ui AlertDialog 사용
    - [x] "정말 삭제하시겠습니까?" 메시지
    - [x] "취소" 및 "삭제" 버튼
  - [x] 삭제 확인 후 API 호출
    - [x] `/api/posts/[postId]` DELETE 요청
    - [x] 성공 시 `onPostDeleted` 콜백 호출
    - [x] 실패 시 에러 메시지 표시 (alert)
  - [x] 삭제 후 UI 업데이트
    - [x] `onPostDeleted` 콜백 prop 추가
    - [x] 로딩 상태 관리 (`isDeleting`)

### 10.3. PostFeed에서 삭제된 게시물 제거

- [x] `components/post/PostFeed.tsx` 수정
  - [x] 게시물 삭제 핸들러 추가
    - [x] `handlePostDelete(postId: string)` 함수
    - [x] `posts` 상태에서 해당 게시물 제거
    - [x] Optimistic UI 업데이트
  - [x] PostCard에 `onPostDeleted` prop 전달
    - [x] 삭제 성공 시 `handlePostDelete` 호출
  - [x] PostModal에도 `onPostDeleted` prop 전달
    - [x] 삭제 성공 시 모달 닫기 및 게시물 제거

### 10.4. PostModal에서 삭제 기능 지원

- [x] `components/post/PostModal.tsx` 수정
  - [x] 헤더의 ⋯ 메뉴 버튼 활성화
  - [x] 본인 게시물 확인 (`isOwnPost`)
  - [x] 본인 게시물인 경우에만 "삭제" 옵션 표시 (DropdownMenu)
  - [x] 삭제 확인 다이얼로그 (PostCard와 동일, AlertDialog)
  - [x] 삭제 성공 시
    - [x] 모달 닫기 (`onClose` 호출)
    - [x] 부모 컴포넌트에 삭제 알림 (`onPostDeleted` 콜백)
  - [x] `onPostDeleted` prop 추가
  - [x] Desktop 및 Mobile 레이아웃 모두에 적용

### 10.5. 프로필 페이지에서 삭제된 게시물 제거

- [x] `components/profile/PostGrid.tsx` 수정
  - [x] 게시물 삭제 핸들러 추가
    - [x] `onPostDeleted` prop 추가
    - [x] `currentPosts` 상태로 게시물 관리
    - [x] 삭제된 게시물을 그리드에서 제거
    - [x] `useEffect`로 `posts` prop 변경 시 상태 업데이트
  - [x] PostModal에 `onPostDeleted` prop 전달
    - [x] 삭제 성공 시 모달 닫기 및 게시물 제거
- [x] `app/(main)/profile/[userId]/page.tsx` 수정
  - [x] `ProfilePageClient` 컴포넌트 생성
    - [x] 게시물 삭제 핸들러 추가
    - [x] `posts` 상태에서 해당 게시물 제거
    - [x] 통계 업데이트 (`posts_count` 감소)
    - [x] ProfileHeader와 PostGrid 간 상태 공유
  - [x] Server Component에서 Client Component로 전환
    - [x] 초기 데이터는 Server Component에서 로드
    - [x] 클라이언트 상태 관리는 ProfilePageClient에서 처리

### 10.6. 이미지 URL에서 Storage 경로 추출 로직

- [x] Storage 경로 파싱 함수 생성
  - [x] `app/api/posts/[postId]/route.ts`에 `extractStoragePath` 함수 추가
  - [x] `image_url`에서 Storage 경로 추출
    - [x] URL 형식: `https://[project].supabase.co/storage/v1/object/public/posts/{clerk_id}/{filename}`
    - [x] 경로 추출: `/storage/v1/object/public/posts/` 이후 부분
    - [x] 정규식으로 경로 파싱
  - [x] 경로 추출 실패 시 경고만 표시하고 DB 삭제는 진행

### 10.7. 에러 처리 및 UX 개선

- [x] 에러 처리
  - [x] 네트워크 에러 처리 (try-catch)
  - [x] API 에러 메시지 표시 (alert 사용)
  - [x] Storage 삭제 실패 시 경고만 표시 (DB 삭제는 성공)
- [x] UX 개선
  - [x] 삭제 확인 다이얼로그 (실수 방지, AlertDialog)
  - [x] 삭제 중 로딩 상태 표시 (`isDeleting` 상태, 버튼 비활성화)
  - [x] 삭제 성공 시 피드에서 즉시 제거 (Optimistic UI)
  - [x] 삭제 실패 시 에러 메시지 표시 (alert)

## 11. 반응형 및 애니메이션

### 11.1. 반응형 브레이크포인트 검증 및 개선

- [x] 레이아웃 컴포넌트 반응형 검증

  - [x] `components/layout/Sidebar.tsx` 검증
    - [x] Mobile (< 768px): `hidden md:block` 확인 (구현됨)
    - [x] Tablet (768px ~ 1023px): `lg:hidden` 확인, 72px 너비 확인 (구현됨)
    - [x] Desktop (1024px+): `hidden lg:block` 확인, 244px 너비 확인 (구현됨)
    - [x] 아이콘 크기 및 간격 반응형 확인 (구현됨)
  - [x] `components/layout/Header.tsx` 검증
    - [x] Mobile (< 768px): `md:hidden` 확인, 60px 높이 확인 (구현됨)
    - [x] Tablet/Desktop: 숨김 확인 (구현됨)
    - [x] 아이콘 크기 및 간격 확인 (구현됨)
  - [x] `components/layout/BottomNav.tsx` 검증
    - [x] Mobile (< 768px): `md:hidden` 확인, 50px 높이 확인 (구현됨)
    - [x] Tablet/Desktop: 숨김 확인 (구현됨)
    - [x] 5개 아이콘 균등 분배 확인 (구현됨)
  - [x] `app/(main)/layout.tsx` 검증
    - [x] Mobile: `mt-[60px]`, `mb-[50px]` 확인 (구현됨)
    - [x] Tablet: `md:ml-[72px]`, `md:mb-0` 확인 (구현됨)
    - [x] Desktop: `lg:ml-[244px]` 확인 (구현됨)
    - [x] Main content 최대 너비 630px 중앙 정렬 확인 (구현됨)

- [x] PostCard 반응형 검증

  - [x] `components/post/PostCard.tsx` 검증
    - [x] 이미지 영역 1:1 비율 유지 (`aspect-square`) (구현됨)
    - [x] Mobile: 전체 너비 사용 (구현됨, layout에서 제어)
    - [x] Tablet/Desktop: 최대 630px 제한 확인 (구현됨, layout에서 제어)
    - [x] 텍스트 크기 반응형 확인 (text-instagram-sm, text-instagram-xs) (구현됨)
  - [x] PostModal 반응형 검증
    - [x] Desktop: 이미지 50% + 댓글 50% 레이아웃 (구현됨, `md:w-1/2`)
    - [x] Mobile: 세로 레이아웃 (전체 페이지) (구현됨, `md:hidden`)
    - [x] 이전/다음 버튼 Desktop만 표시 확인 (구현됨, `hidden md:flex`)

- [x] 프로필 페이지 반응형 검증

  - [x] `components/profile/ProfileHeader.tsx` 검증
    - [x] Desktop: 가로 레이아웃 (프로필 이미지 150px + 정보) (구현됨, `hidden md:flex`)
    - [x] Mobile: 세로 레이아웃 (프로필 이미지 90px 상단, 정보 하단) (구현됨, `md:hidden`)
    - [x] 통계 표시 반응형 확인 (구현됨)
  - [x] `components/profile/PostGrid.tsx` 검증
    - [x] 3열 그리드 모든 화면 크기에서 유지 (구현됨, `grid-cols-3`)
    - [x] Gap 반응형 (Mobile: gap-1, Desktop: gap-4) (구현됨, `gap-1 md:gap-4`)
    - [x] Hover 효과 Desktop/Tablet만 표시 확인 (구현됨, `hidden md:flex`)

- [x] CreatePostModal 반응형 검증
  - [x] `components/post/CreatePostModal.tsx` 검증
    - [x] 모달 크기 반응형 (Mobile: 전체 너비, Desktop: 최대 500px) (구현됨, shadcn/ui Dialog 기본)
    - [x] 이미지 미리보기 비율 유지 (구현됨, `aspect-square`)
    - [x] 입력 필드 반응형 확인 (구현됨)

### 11.2. 좋아요 애니메이션 개선

- [x] `components/post/LikeButton.tsx` 애니메이션 검증 및 개선

  - [x] 클릭 애니메이션 검증
    - [x] `scale-[1.3]` 클래스 적용 확인 (구현됨)
    - [x] `duration-150` (0.15초) 확인 (구현됨)
    - [x] 애니메이션 후 원래 크기로 복귀 확인 (구현됨, `transition-transform`)
    - [x] `transition-transform` 적용 확인 (구현됨)
  - [x] 더블탭 큰 하트 애니메이션 검증
    - [x] `fadeInOut` 애니메이션 적용 확인 (1초) (구현됨, `animate-[fadeInOut_1s_ease-in-out]`)
    - [x] 큰 하트 크기 확인 (sm: 48px, md: 64px, lg: 80px) (구현됨)
    - [x] 중앙 정렬 확인 (`translate(-50%, -50%)`) (구현됨)
    - [x] `pointer-events-none` 적용 확인 (클릭 방해 방지) (구현됨)
  - [x] 애니메이션 성능 최적화
    - [x] `will-change` 속성 추가 (구현됨, LikeButton에 추가)
    - [x] GPU 가속 확인 (`transform`, `opacity` 사용) (구현됨)

- [x] PostCard 이미지 더블탭 좋아요 검증

  - [x] 투명 오버레이로 더블탭 감지 확인 (구현됨, `opacity-0` 오버레이)
  - [x] `LikeButton` 컴포넌트 재사용 확인 (구현됨)
  - [x] 큰 하트 애니메이션 표시 확인 (구현됨)

- [x] PostModal 이미지 더블탭 좋아요 검증
  - [x] 모달 내 이미지 영역 더블탭 감지 확인 (구현됨, `handleTouchStart`)
  - [x] 큰 하트 애니메이션 표시 확인 (구현됨, `showBigHeart` 상태)

### 11.3. 로딩 상태 및 Skeleton UI 개선

- [x] `components/post/PostCardSkeleton.tsx` 검증 및 개선

  - [x] Shimmer 효과 적용 확인
    - [x] Tailwind 애니메이션 사용 (구현됨, `animate-[shimmer_2s_infinite]`)
    - [x] `@keyframes shimmer` 정의 확인 (globals.css) (구현됨)
    - [x] 무한 반복 애니메이션 확인 (구현됨, `infinite`)
  - [x] Skeleton 구조 검증
    - [x] 헤더 영역 (프로필 이미지, 사용자명, 시간) (구현됨)
    - [x] 이미지 영역 (정사각형) (구현됨, `aspect-square`)
    - [x] 액션 버튼 영역 (구현됨)
    - [x] 좋아요 수 영역 (구현됨)
    - [x] 캡션 영역 (구현됨)
    - [x] 댓글 미리보기 영역 (구현됨)
  - [x] 반응형 Skeleton 크기 확인
    - [x] Mobile: 전체 너비 (구현됨, layout에서 제어)
    - [x] Desktop: 최대 630px (구현됨, layout에서 제어)

- [x] PostFeed 로딩 상태 개선

  - [x] `components/post/PostFeed.tsx` 검증
    - [x] 로딩 중 `PostCardSkeleton` 표시 확인 (구현됨)
    - [x] 여러 개의 Skeleton 표시 (2개 이상) (구현됨, 2개 표시)
    - [x] Intersection Observer 타겟 영역 확인 (구현됨)

- [x] 기타 로딩 상태 추가
  - [x] 프로필 페이지 로딩 Skeleton (구현됨, `components/profile/ProfileHeaderSkeleton.tsx`)
  - [x] 댓글 목록 로딩 Skeleton (구현됨, `components/comment/CommentListSkeleton.tsx`, CommentList에 통합)
  - [x] 이미지 업로드 진행률 표시 (구현됨, CreatePostModal에 진행률 바 추가)

### 11.4. Hover 효과 및 Transition 개선

- [x] Sidebar Hover 효과 검증

  - [x] `components/layout/Sidebar.tsx` 검증
    - [x] 메뉴 항목 hover 시 배경색 변경 (`hover:bg-[var(--instagram-background)]`) (구현됨)
    - [x] 아이콘 hover 시 scale 효과 (`group-hover:scale-105`) (구현됨)
    - [x] Active 상태 스타일 확인 (볼드, scale-110) (구현됨)
    - [x] Transition 적용 확인 (`transition-colors`, `transition-transform`) (구현됨)

- [x] BottomNav Hover 효과 검증

  - [x] `components/layout/BottomNav.tsx` 검증
    - [x] 아이콘 hover 시 배경색 변경 (구현됨, `hover:bg-[var(--instagram-background)]`)
    - [x] Active 상태 스타일 확인 (구현됨, `scale-110`)
    - [x] Transition 적용 확인 (구현됨, `transition-colors`, `transition-transform`)

- [x] PostCard Hover 효과 검증

  - [x] 버튼 hover 효과 확인
    - [x] 좋아요, 댓글, 공유, 북마크 버튼 hover 시 scale 효과 (구현됨, `hover:scale-110`)
    - [x] `transition-transform hover:scale-110` 적용 확인 (구현됨)
  - [x] 링크 hover 효과 확인
    - [x] 사용자명 링크 hover 시 opacity 변경 (구현됨, `hover:opacity-70`)
    - [x] `hover:opacity-70` 적용 확인 (구현됨)

- [x] PostGrid Hover 효과 검증

  - [x] `components/profile/PostGrid.tsx` 검증
    - [x] Desktop/Tablet hover 시 오버레이 표시 (구현됨, `hidden md:flex`)
    - [x] 좋아요/댓글 수 표시 (구현됨)
    - [x] 반투명 검은 배경 (`bg-black/40`) (구현됨)
    - [x] Mobile에서는 hover 효과 없음 확인 (구현됨, `hidden md:flex`)

- [x] 버튼 Transition 개선
  - [x] 모든 버튼에 transition 적용 확인 (구현됨)
  - [x] 일관된 transition duration 사용 (150ms, 200ms) (구현됨)
  - [x] Hover 시 부드러운 색상 전환 확인 (구현됨)

### 11.5. 모달 및 Dialog 애니메이션

- [x] PostModal 애니메이션 검증

  - [x] 모달 열기/닫기 애니메이션 확인 (shadcn/ui Dialog 기본) (구현됨)
  - [x] 배경 오버레이 fade in/out 확인 (구현됨, shadcn/ui 기본)
  - [x] 모달 내용 scale/fade 애니메이션 확인 (구현됨, shadcn/ui 기본)

- [x] CreatePostModal 애니메이션 검증

  - [x] 모달 열기/닫기 애니메이션 확인 (구현됨, shadcn/ui Dialog 기본)
  - [ ] 이미지 미리보기 fade in 애니메이션 (선택사항, 현재 즉시 표시)
  - [x] 업로드 진행률 애니메이션 (구현됨, 진행률 바 및 퍼센트 표시 추가)

- [x] AlertDialog 애니메이션 검증
  - [x] 삭제 확인 다이얼로그 애니메이션 확인 (구현됨, shadcn/ui 기본)
  - [x] 배경 오버레이 및 다이얼로그 내용 애니메이션 확인 (구현됨, shadcn/ui 기본)

### 11.6. 무한 스크롤 최적화

- [x] PostFeed 무한 스크롤 검증
  - [x] `components/post/PostFeed.tsx` 검증
    - [x] Intersection Observer 설정 확인 (구현됨)
    - [x] Threshold 값 확인 (0.1) (구현됨)
    - [x] 로딩 중 중복 요청 방지 확인 (구현됨, `loading` 상태 체크)
    - [x] 마지막 게시물 도달 시 더 이상 로드하지 않음 확인 (구현됨, `hasMore` 상태)
  - [ ] 성능 최적화
    - [x] Intersection Observer cleanup 확인 (구현됨, `useEffect` return)
    - [x] 메모리 누수 방지 확인 (구현됨, cleanup 함수)
    - [ ] 스크롤 성능 확인 (requestAnimationFrame 사용 여부, 현재는 기본 Intersection Observer 사용)

### 11.7. 터치 인터랙션 개선 (모바일)

- [x] 터치 제스처 검증

  - [x] 이미지 더블탭 좋아요 동작 확인 (구현됨, `handleTouchStart`)
  - [x] 탭 간격 300ms 이내 확인 (구현됨, `tapLength < 300`)
  - [x] 단일 탭과 더블탭 구분 확인 (구현됨, `lastTapRef` 사용)
  - [x] 터치 영역 최소 44px 확인 (구현됨, LikeButton에 `min-w-[44px] min-h-[44px]` 추가)

- [x] 모바일 스크롤 최적화
  - [x] 스크롤 부드러움 확인 (구현됨, `-webkit-overflow-scrolling: touch` 추가)
  - [ ] 스크롤 성능 확인 (실제 테스트 필요)
  - [x] Pull-to-refresh 방지 (구현됨, `overscroll-behavior-y: contain` 추가)

### 11.8. 반응형 테스트 및 검증

- [ ] 다양한 화면 크기 테스트

  - [ ] Mobile: 320px, 375px, 414px
  - [ ] Tablet: 768px, 834px, 1024px
  - [ ] Desktop: 1280px, 1440px, 1920px
  - [ ] 각 브레이크포인트에서 레이아웃 확인
  - [ ] 실제 디바이스 테스트 (선택사항)

- [ ] 브라우저 호환성 테스트

  - [ ] Chrome, Firefox, Safari, Edge
  - [ ] 모바일 브라우저 (iOS Safari, Chrome Mobile)
  - [ ] 애니메이션 성능 확인 (60fps 목표)

- [x] 접근성 검증
  - [ ] 키보드 네비게이션 확인 (Tab, Enter, Escape)
  - [ ] 스크린 리더 호환성 확인 (ARIA 레이블)
  - [x] 애니메이션 감소 설정 지원 (구현됨, `prefers-reduced-motion` 미디어 쿼리 추가)

### 11.9. CSS 애니메이션 유틸리티 클래스 추가

- [x] `app/globals.css`에 애니메이션 유틸리티 추가

  - [x] `@keyframes fadeInOut` 정의 확인 (이미 존재) (구현됨)
  - [x] `@keyframes shimmer` 정의 확인 (이미 존재) (구현됨)
  - [ ] 추가 애니메이션 클래스 (필요시)
    - [ ] `animate-scale-in` (모달 열기, shadcn/ui Dialog 기본 사용)
    - [ ] `animate-fade-in` (요소 등장, 필요시 추가)
    - [ ] `animate-slide-up` (요소 슬라이드, 필요시 추가)

- [x] Tailwind 애니메이션 설정 확인
  - [x] `tw-animate-css` import 확인 (구현됨)
  - [x] 커스텀 애니메이션 등록 확인 (구현됨, `@keyframes` 사용)

### 11.10. 성능 최적화

- [x] 애니메이션 성능 최적화

  - [ ] `will-change` 속성 적절히 사용 (성능 테스트 후 결정)
  - [x] GPU 가속 활용 (`transform`, `opacity`) (구현됨)
  - [x] 불필요한 리플로우 방지 (구현됨, `transform` 사용)
  - [ ] 애니메이션 프레임 드롭 확인 (실제 테스트 필요)

- [x] 반응형 이미지 최적화

  - [x] Next.js Image 컴포넌트 `sizes` prop 확인 (구현됨)
  - [x] 적절한 이미지 크기 로드 확인 (구현됨)
  - [x] Lazy loading 확인 (구현됨, Next.js Image 기본)

- [ ] 코드 스플리팅 확인
  - [ ] 모바일/데스크톱별 코드 분리 (필요시, 현재는 CSS로 처리)
  - [ ] 동적 import 활용 (필요시, 현재는 정적 import)

## 12. 에러 핸들링 및 최적화

### 12.1. 에러 핸들링 시스템 구축

- [x] Toast 알림 시스템 설치 및 설정

  - [x] sonner 라이브러리 설치 (구현됨, shadcn/ui toast v4 미지원으로 대체)
  - [x] `lib/toast.ts` 유틸리티 함수 생성 (구현됨)
  - [x] `app/layout.tsx`에 `<Toaster />` 추가 (구현됨)
  - [x] `toastSuccess`, `toastError`, `toastInfo`, `toastWarning` 함수 export (구현됨)

- [x] API 에러 처리 개선

  - [x] `lib/api-error-handler.ts` 유틸리티 함수 생성 (구현됨)
    - [x] HTTP 상태 코드별 사용자 친화적 메시지 매핑 (구현됨)
    - [x] 네트워크 에러 감지 및 처리 (구현됨)
    - [x] 타임아웃 에러 처리 (구현됨, `fetchWithTimeout` 함수)
    - [x] JSON 파싱 에러 처리 (구현됨)
    - [x] `apiCall` 헬퍼 함수 제공 (구현됨)
  - [x] API 라우트 에러 응답 표준화
    - [x] `app/api/posts/route.ts` 에러 메시지 개선 (구현됨, 한국어 메시지)
    - [x] `app/api/likes/route.ts` 에러 메시지 개선 (구현됨, 한국어 메시지)
    - [x] `app/api/comments/route.ts` 에러 메시지 개선 (구현됨, 한국어 메시지)
    - [x] `app/api/follows/route.ts` 에러 메시지 개선 (구현됨, 한국어 메시지)
    - [x] `app/api/users/[userId]/route.ts` 에러 메시지 개선 (구현됨, 한국어 메시지)

- [x] 클라이언트 컴포넌트 에러 처리 개선

  - [x] `components/post/CreatePostModal.tsx` alert() → toast() 변경 (구현됨)
  - [x] `components/post/PostFeed.tsx` 에러 상태 표시 추가 (구현됨, 에러 메시지 및 "다시 시도" 버튼)
  - [x] `components/post/PostModal.tsx` 에러 처리 개선 (구현됨, alert → toast)
  - [x] `components/comment/CommentForm.tsx` 에러 처리 개선 (구현됨, alert → toast)
  - [x] `components/profile/FollowButton.tsx` 에러 처리 개선 (구현됨, alert → toast)
  - [x] `components/comment/CommentList.tsx` 에러 처리 개선 (구현됨, alert → toast)
  - [x] `components/post/PostCard.tsx` 에러 처리 개선 (구현됨, alert → toast)
  - [x] `hooks/use-sync-user.ts` 에러 처리 개선 (조용한 실패 유지, 이미 구현됨)

- [x] 네트워크 에러 처리

  - [x] fetch 타임아웃 설정 (예: 10초) (구현됨, `fetchWithTimeout` 사용)
  - [x] 네트워크 연결 상태 확인 (구현됨, `useNetworkStatus` 훅)
  - [ ] 재시도 로직 (선택사항, 중요한 API만, PostFeed에 "다시 시도" 버튼 추가)
  - [x] 오프라인 상태 감지 및 사용자 알림 (구현됨, `NetworkStatusProvider`)

- [x] 사용자 친화적 에러 메시지
  - [x] 에러 메시지 한국어 번역 (구현됨, 모든 API 라우트 및 클라이언트 컴포넌트)
  - [x] 기술적 에러를 사용자 친화적 메시지로 변환 (구현됨, `getErrorMessage` 함수)
  - [ ] 에러 발생 시 해결 방법 제시 (선택사항, 기본 메시지에 포함됨)

### 12.2. 이미지 최적화 검증 및 개선

- [x] Next.js Image 컴포넌트 사용 확인

  - [x] `components/post/PostCard.tsx` Image 사용 확인 (구현됨)
  - [x] `components/post/PostModal.tsx` Image 사용 확인 (구현됨)
  - [x] `components/profile/PostGrid.tsx` Image 사용 확인 (구현됨)
  - [x] `components/post/CreatePostModal.tsx` Image 사용 확인 (구현됨)

- [x] Lazy loading 최적화

  - [x] PostCard 이미지: 첫 3개만 `priority`, 나머지는 lazy loading (구현됨)
  - [x] PostGrid 썸네일: 모든 이미지 lazy loading (구현됨, `loading="lazy"` 명시)
  - [x] PostModal 이미지: `priority` 설정 (구현됨, 모달 열릴 때 즉시 로드)
  - [x] `loading="lazy"` 속성 확인 (구현됨, PostCard와 PostGrid에 명시)

- [x] 이미지 크기 최적화
  - [x] `sizes` 속성 최적화 (반응형 이미지)
    - [x] PostCard: `sizes="(max-width: 768px) 100vw, 630px"` (구현됨)
    - [x] PostGrid: `sizes="(max-width: 768px) 33vw, 210px"` (구현됨)
    - [x] PostModal: `sizes="(max-width: 768px) 100vw, 50vw"` (구현됨)
  - [x] 이미지 품질 설정 (기본값 75 사용, Next.js Image 기본값)

### 12.3. React 성능 최적화

- [x] React.memo 적용

  - [ ] `components/post/PostCard.tsx` memo 적용 검토 (복잡한 상태 관리로 인해 선택사항, useMemo/useCallback으로 최적화)
  - [x] `components/post/LikeButton.tsx` memo 적용 (구현됨, 커스텀 비교 함수 포함)
  - [x] `components/comment/CommentList.tsx` memo 적용 (구현됨)
  - [ ] `components/comment/CommentForm.tsx` memo 적용 (선택사항, useCallback으로 최적화)
  - [x] `components/profile/PostGrid.tsx` memo 적용 (구현됨)

- [x] useMemo 활용

  - [x] `components/post/PostFeed.tsx` 게시물 목록 메모이제이션 (구현됨, modalPost 메모이제이션)
  - [x] `components/post/PostModal.tsx` 계산된 값 메모이제이션 (구현됨, currentIndex, hasPrevious, hasNext, timeAgo)
  - [x] `components/profile/ProfileHeader.tsx` 통계 계산 메모이제이션 (구현됨, formattedStats, avatarText)
  - [x] `components/post/PostCard.tsx` 계산된 값 메모이제이션 (구현됨, displayCaption, timeAgo)
  - [x] `components/comment/CommentList.tsx` displayComments 메모이제이션 (구현됨)
  - [x] `components/profile/PostGrid.tsx` modalPost 메모이제이션 (구현됨)

- [x] useCallback 활용

  - [x] `components/post/PostFeed.tsx` 핸들러 함수들 useCallback 적용 (구현됨, handlePostDelete, handleImageClick, handleCloseModal, handleModalPostDelete)
  - [x] `components/post/PostCard.tsx` 핸들러 함수들 useCallback 적용 (구현됨, handleDelete)
  - [x] `components/post/PostModal.tsx` 핸들러 함수들 useCallback 적용 (구현됨, handlePrevious, handleNext, handleImageDoubleTap, handleTouchStart, handleDelete)
  - [x] `components/comment/CommentForm.tsx` 핸들러 함수 useCallback 적용 (구현됨, handleSubmit, handleKeyDown)
  - [x] `components/post/LikeButton.tsx` 핸들러 함수들 useCallback 적용 (구현됨, handleLike, handleClick, handleDoubleTap, handleTouchStart, handleTouchEnd)
  - [x] `components/comment/CommentList.tsx` 핸들러 함수 useCallback 적용 (구현됨, handleDelete)
  - [x] `components/profile/PostGrid.tsx` 핸들러 함수들 useCallback 적용 (구현됨, handlePostClick, handleCloseModal, handlePostDelete)
  - [x] `components/profile/ProfileHeader.tsx` 핸들러 함수 useCallback 적용 (구현됨, handleFollowChange)
  - [x] `components/profile/ProfilePageClient.tsx` useCallback 사용 확인 (구현됨)

- [ ] 불필요한 리렌더링 방지
  - [ ] Context 값 메모이제이션 (필요시)
  - [ ] props drilling 최소화 (이미 잘 구성됨)
  - [ ] 상태 업데이트 최적화

### 12.4. 번들 크기 최적화 (선택사항)

- [ ] 동적 import 적용

  - [ ] PostModal 동적 import (모달이 열릴 때만 로드)
  - [ ] CreatePostModal 동적 import (선택사항)
  - [ ] 무거운 컴포넌트 동적 import

- [ ] 불필요한 의존성 제거
  - [ ] 사용하지 않는 라이브러리 확인
  - [ ] tree-shaking 확인

### 12.5. 성능 측정 및 검증

- [ ] Lighthouse 성능 점수 확인
  - [ ] 모바일 성능 점수 목표: 80+
  - [ ] 데스크톱 성능 점수 목표: 90+
- [ ] React DevTools Profiler로 리렌더링 분석
- [ ] 네트워크 탭에서 이미지 로딩 최적화 확인

## 13. 최종 마무리

### 13.1. 모바일/태블릿 반응형 테스트

- [x] 반응형 테스트 체크리스트 문서화
  - [x] `docs/RESPONSIVE_TEST.md` 파일 생성 (구현됨)
  - [x] 주요 화면 크기별 테스트 항목 정리 (구현됨)
    - [x] Mobile: 320px, 375px, 414px (구현됨)
    - [x] Tablet: 768px, 834px, 1024px (구현됨)
    - [x] Desktop: 1280px, 1440px, 1920px (구현됨)
  - [x] 각 컴포넌트별 반응형 동작 확인 항목 정리 (구현됨)
- [x] 터치 인터랙션 테스트 가이드
  - [x] 더블탭 좋아요 동작 확인 (구현됨)
  - [x] 터치 영역 최소 44px 확인 (구현됨)
  - [ ] 스크롤 성능 확인 (실제 테스트 필요)
  - [x] Pull-to-refresh 방지 확인 (구현됨, CSS 추가됨)

### 13.2. 접근성 검토 및 개선

- [x] ARIA 레이블 추가
  - [x] 버튼 컴포넌트에 `aria-label` 추가 (구현됨, Sidebar, BottomNav, Header, PostModal)
  - [x] 아이콘 버튼에 의미 있는 레이블 추가 (구현됨, `aria-hidden="true"` 추가)
  - [x] 링크에 `aria-label` 추가 (구현됨, `aria-current="page"` 추가)
  - [x] 이미지에 `alt` 텍스트 확인 및 개선 (이미 구현됨, PostCard, PostModal, PostGrid)
- [x] 키보드 네비게이션 개선
  - [x] 모든 인터랙티브 요소가 Tab으로 접근 가능한지 확인 (구현됨, focus:outline-none focus:ring-2 추가)
  - [x] Enter/Space 키로 버튼 활성화 확인 (기본 HTML 동작)
  - [x] ESC 키로 모달 닫기 확인 (이미 구현됨, Dialog 기본 기능)
  - [x] PostModal 좌/우 화살표 키 네비게이션 (구현됨, useEffect로 키보드 이벤트 처리)
- [x] 포커스 관리
  - [x] 포커스 시각적 표시 확인 (구현됨, focus:ring-2 focus:ring-[var(--instagram-blue)] 추가)
  - [x] 모달 열릴 때 포커스 트랩 확인 (Dialog 기본 기능)
  - [ ] 스킵 링크 추가 (선택사항, 필요시 추가)

### 13.3. 코드 정리

- [x] 불필요한 주석 제거
  - [x] 개발 중 임시 주석 제거 (구현됨, 린터 경고 확인)
  - [x] 중복 설명 주석 정리 (구현됨)
  - [ ] TODO 주석 검토 및 정리 (일부 TODO는 유지, 향후 작업용)
- [x] 코드 포맷팅
  - [x] Prettier 설정 확인 (구현됨, .prettierrc 파일 존재)
  - [x] 린터 실행 및 주요 에러 수정 (구현됨, Hook 규칙 위반 수정)
  - [x] 일관된 코드 스타일 확인 (구현됨)

### 13.4. 배포 준비

- [x] SEO 및 메타데이터 파일 생성
  - [x] `app/robots.ts` 파일 생성 (구현됨, 검색 엔진 크롤러 설정)
  - [x] `app/sitemap.ts` 파일 생성 (구현됨, 사이트맵 생성)
  - [x] `app/manifest.ts` 파일 생성 (구현됨, PWA 매니페스트)
- [x] 에러 페이지 생성
  - [x] `app/not-found.tsx` 파일 생성 (구현됨, 404 페이지)
- [x] 환경 변수 문서화
  - [x] `.env.example` 파일 생성 (구현됨, 모든 필수 환경 변수 포함)
  - [x] `README.md`에 환경 변수 설정 가이드 확인 (이미 존재)
- [x] 배포 설정 문서화
  - [x] Vercel 배포 가이드 작성 (구현됨, `docs/DEPLOYMENT.md`)
  - [x] 프로덕션 빌드 테스트 가이드 작성 (구현됨, `docs/DEPLOYMENT.md`에 포함)
  - [x] 환경 변수 설정 방법 문서화 (구현됨, `docs/DEPLOYMENT.md`에 포함)
