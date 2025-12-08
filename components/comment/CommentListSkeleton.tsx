/**
 * @file components/comment/CommentListSkeleton.tsx
 * @description 댓글 목록 로딩 Skeleton 컴포넌트
 */

interface CommentListSkeletonProps {
  count?: number;
}

export function CommentListSkeleton({ count = 3 }: CommentListSkeletonProps) {
  return (
    <div className="space-y-4 animate-pulse">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex items-start gap-3">
          {/* 프로필 이미지 Skeleton */}
          <div className="w-8 h-8 rounded-full bg-[var(--instagram-border)] flex-shrink-0" />

          {/* 댓글 내용 Skeleton */}
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-4 w-20 bg-[var(--instagram-border)] rounded" />
              <div className="h-3 w-16 bg-[var(--instagram-border)] rounded" />
            </div>
            <div className="space-y-1">
              <div className="h-4 w-full bg-[var(--instagram-border)] rounded" />
              <div className="h-4 w-3/4 bg-[var(--instagram-border)] rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

