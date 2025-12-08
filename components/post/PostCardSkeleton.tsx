/**
 * @file components/post/PostCardSkeleton.tsx
 * @description 게시물 카드 로딩 스켈레톤 UI
 *
 * Instagram 스타일의 로딩 UI:
 * - Skeleton UI (회색 박스)
 * - Shimmer 효과 (애니메이션)
 * - PostCard와 동일한 레이아웃
 */

export function PostCardSkeleton() {
  return (
    <div className="bg-[var(--instagram-card-background)] border border-[var(--instagram-border)] rounded-lg mb-6 animate-pulse">
      {/* 헤더 스켈레톤 */}
      <div className="flex items-center gap-3 p-4">
        <div className="w-8 h-8 rounded-full bg-[var(--instagram-border)]" />
        <div className="flex-1">
          <div className="h-4 w-24 bg-[var(--instagram-border)] rounded mb-2" />
          <div className="h-3 w-16 bg-[var(--instagram-border)] rounded" />
        </div>
        <div className="w-6 h-6 bg-[var(--instagram-border)] rounded" />
      </div>

      {/* 이미지 스켈레톤 (1:1 정사각형) */}
      <div className="w-full aspect-square bg-[var(--instagram-border)] relative overflow-hidden">
        {/* Shimmer 효과 */}
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </div>

      {/* 액션 버튼 스켈레톤 */}
      <div className="flex items-center justify-between p-4">
        <div className="flex gap-4">
          <div className="w-6 h-6 bg-[var(--instagram-border)] rounded" />
          <div className="w-6 h-6 bg-[var(--instagram-border)] rounded" />
          <div className="w-6 h-6 bg-[var(--instagram-border)] rounded" />
        </div>
        <div className="w-6 h-6 bg-[var(--instagram-border)] rounded" />
      </div>

      {/* 좋아요 수 스켈레톤 */}
      <div className="px-4 pb-2">
        <div className="h-4 w-32 bg-[var(--instagram-border)] rounded" />
      </div>

      {/* 캡션 스켈레톤 */}
      <div className="px-4 pb-2">
        <div className="h-4 w-full bg-[var(--instagram-border)] rounded mb-2" />
        <div className="h-4 w-3/4 bg-[var(--instagram-border)] rounded" />
      </div>

      {/* 댓글 미리보기 스켈레톤 */}
      <div className="px-4 pb-4">
        <div className="h-3 w-24 bg-[var(--instagram-border)] rounded mb-2" />
        <div className="h-4 w-full bg-[var(--instagram-border)] rounded mb-1" />
        <div className="h-4 w-5/6 bg-[var(--instagram-border)] rounded" />
      </div>
    </div>
  );
}

