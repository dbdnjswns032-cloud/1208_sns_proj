/**
 * @file components/profile/ProfileHeaderSkeleton.tsx
 * @description 프로필 헤더 로딩 Skeleton 컴포넌트
 */

export function ProfileHeaderSkeleton() {
  return (
    <div className="w-full animate-pulse">
      {/* Desktop 레이아웃 */}
      <div className="hidden md:flex items-start gap-8 px-4 py-6">
        {/* 프로필 이미지 Skeleton */}
        <div className="w-[150px] h-[150px] rounded-full bg-[var(--instagram-border)]" />

        {/* 정보 영역 */}
        <div className="flex-1 space-y-4">
          {/* 사용자명 및 버튼 */}
          <div className="flex items-center gap-4">
            <div className="h-6 w-32 bg-[var(--instagram-border)] rounded" />
            <div className="h-9 w-24 bg-[var(--instagram-border)] rounded" />
          </div>

          {/* 통계 */}
          <div className="flex items-center gap-6">
            <div className="h-4 w-16 bg-[var(--instagram-border)] rounded" />
            <div className="h-4 w-20 bg-[var(--instagram-border)] rounded" />
            <div className="h-4 w-16 bg-[var(--instagram-border)] rounded" />
          </div>

          {/* 이름 및 소개 */}
          <div className="space-y-2">
            <div className="h-5 w-24 bg-[var(--instagram-border)] rounded" />
            <div className="h-4 w-full bg-[var(--instagram-border)] rounded" />
            <div className="h-4 w-3/4 bg-[var(--instagram-border)] rounded" />
          </div>
        </div>
      </div>

      {/* Mobile 레이아웃 */}
      <div className="md:hidden flex flex-col items-center px-4 py-6 space-y-4">
        {/* 프로필 이미지 Skeleton */}
        <div className="w-[90px] h-[90px] rounded-full bg-[var(--instagram-border)]" />

        {/* 사용자명 */}
        <div className="h-5 w-32 bg-[var(--instagram-border)] rounded" />

        {/* 통계 */}
        <div className="flex items-center gap-6">
          <div className="h-4 w-16 bg-[var(--instagram-border)] rounded" />
          <div className="h-4 w-20 bg-[var(--instagram-border)] rounded" />
          <div className="h-4 w-16 bg-[var(--instagram-border)] rounded" />
        </div>

        {/* 버튼 */}
        <div className="h-9 w-full max-w-[200px] bg-[var(--instagram-border)] rounded" />

        {/* 이름 및 소개 */}
        <div className="w-full space-y-2">
          <div className="h-5 w-24 bg-[var(--instagram-border)] rounded" />
          <div className="h-4 w-full bg-[var(--instagram-border)] rounded" />
        </div>
      </div>
    </div>
  );
}

