/**
 * @file components/post/LikeButton.tsx
 * @description 좋아요 버튼 컴포넌트
 *
 * 기능:
 * - 빈 하트 ↔ 빨간 하트 상태 관리
 * - 클릭 애니메이션 (scale 1.3 → 1, 0.15초)
 * - 더블탭 좋아요 (모바일, 큰 하트 fade in/out, 1초)
 */

"use client";

import { useState, useRef, useEffect, memo, useCallback } from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { fetchWithTimeout, extractErrorMessage, getErrorMessage } from "@/lib/api-error-handler";
import { toastError } from "@/lib/toast";

interface LikeButtonProps {
  postId: string;
  initialLiked: boolean;
  initialLikesCount: number;
  onLikeChange?: (liked: boolean, newCount: number) => void;
  className?: string;
  size?: "sm" | "md" | "lg";
  showCount?: boolean;
}

function LikeButtonComponent({
  postId,
  initialLiked,
  initialLikesCount,
  onLikeChange,
  className,
  size = "md",
  showCount = false,
}: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showBigHeart, setShowBigHeart] = useState(false);
  const lastTapRef = useRef<number>(0);
  const tapTimeoutRef = useRef<NodeJS.Timeout>();

  // 초기값이 변경되면 상태 업데이트 (서버에서 최신 데이터를 받았을 때)
  useEffect(() => {
    setIsLiked(initialLiked);
    setLikesCount(initialLikesCount);
  }, [initialLiked, initialLikesCount]);

  const handleLike = useCallback(async (liked: boolean) => {
    try {
      if (liked) {
        // 좋아요 추가
        const response = await fetchWithTimeout(
          "/api/likes",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ postId }),
          },
          10000 // 10초 타임아웃
        );

        if (response.ok) {
          setIsLiked(true);
          setLikesCount((prev) => prev + 1);
          onLikeChange?.(true, likesCount + 1);
        } else {
          const errorMessage = await extractErrorMessage(response);
          toastError(errorMessage);
        }
      } else {
        // 좋아요 제거
        const response = await fetchWithTimeout(
          `/api/likes?postId=${postId}`,
          {
            method: "DELETE",
          },
          10000 // 10초 타임아웃
        );

        if (response.ok) {
          setIsLiked(false);
          setLikesCount((prev) => Math.max(0, prev - 1));
          onLikeChange?.(false, Math.max(0, likesCount - 1));
        } else {
          const errorMessage = await extractErrorMessage(response);
          toastError(errorMessage);
        }
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      const errorMessage = getErrorMessage(error, "좋아요 처리 중 오류가 발생했습니다.");
      toastError(errorMessage);
    }
  }, [postId, likesCount, onLikeChange]);

  const handleClick = useCallback(() => {
    // 클릭 애니메이션
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 150);

    // 좋아요 토글
    handleLike(!isLiked);
  }, [isLiked, handleLike]);

  const handleDoubleTap = useCallback(() => {
    // 더블탭 좋아요 (모바일)
    if (!isLiked) {
      // 큰 하트 표시
      setShowBigHeart(true);
      setTimeout(() => setShowBigHeart(false), 1000);

      // 좋아요 추가
      handleLike(true);
    }
  }, [isLiked, handleLike]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTapRef.current;

    if (tapLength < 300 && tapLength > 0) {
      // 더블탭 감지
      e.preventDefault();
      if (tapTimeoutRef.current) {
        clearTimeout(tapTimeoutRef.current);
      }
      handleDoubleTap();
    } else {
      // 단일 탭인 경우 타이머 설정
      tapTimeoutRef.current = setTimeout(() => {
        // 단일 탭은 클릭으로 처리하지 않음 (이미지 영역의 경우)
        // handleClick();
      }, 300);
    }

    lastTapRef.current = currentTime;
  }, [handleDoubleTap]);

  const handleTouchEnd = useCallback(() => {
    if (tapTimeoutRef.current) {
      clearTimeout(tapTimeoutRef.current);
    }
  }, []);

  const sizeClasses = {
    sm: "w-5 h-5",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className={cn(
          "p-2 transition-transform duration-150 min-w-[44px] min-h-[44px] flex items-center justify-center",
          isAnimating && "scale-[1.3]",
          className
        )}
        style={isAnimating ? { willChange: "transform" } : undefined}
        aria-label={isLiked ? "좋아요 취소" : "좋아요"}
      >
        <Heart
          className={cn(
            sizeClasses[size],
            isLiked
              ? "fill-[var(--instagram-like)] text-[var(--instagram-like)]"
              : "text-[var(--instagram-text-primary)]"
          )}
          strokeWidth={isLiked ? 0 : 2}
        />
      </button>

      {/* 더블탭 큰 하트 (모바일) */}
      {showBigHeart && (
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none animate-[fadeInOut_1s_ease-in-out]"
          style={{
            transform: "translate(-50%, -50%)",
            left: "50%",
            top: "50%",
            willChange: "transform, opacity",
          }}
        >
          <Heart
            className={cn(
              "fill-[var(--instagram-like)] text-[var(--instagram-like)]",
              size === "sm" ? "w-12 h-12" : size === "md" ? "w-16 h-16" : "w-20 h-20"
            )}
            strokeWidth={0}
          />
        </div>
      )}

      {/* 좋아요 수 표시 (선택사항) */}
      {showCount && likesCount > 0 && (
        <span className="ml-2 text-instagram-sm font-instagram-semibold text-[var(--instagram-text-primary)]">
          {likesCount.toLocaleString()}
        </span>
      )}
    </div>
  );
}

// React.memo로 메모이제이션 (props가 변경되지 않으면 리렌더링 방지)
export const LikeButton = memo(LikeButtonComponent, (prevProps, nextProps) => {
  // props 비교 함수: 중요한 props만 비교
  return (
    prevProps.postId === nextProps.postId &&
    prevProps.initialLiked === nextProps.initialLiked &&
    prevProps.initialLikesCount === nextProps.initialLikesCount &&
    prevProps.size === nextProps.size &&
    prevProps.showCount === nextProps.showCount &&
    prevProps.className === nextProps.className
  );
});

