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

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { cn } from "@/lib/utils";

interface LikeButtonProps {
  postId: string;
  initialLiked: boolean;
  initialLikesCount: number;
  onLikeChange?: (liked: boolean, newCount: number) => void;
  className?: string;
  size?: "sm" | "md" | "lg";
  showCount?: boolean;
}

export function LikeButton({
  postId,
  initialLiked,
  initialLikesCount,
  onLikeChange,
  className,
  size = "md",
  showCount = false,
}: LikeButtonProps) {
  const { isSignedIn } = useUser();
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showBigHeart, setShowBigHeart] = useState(false);
  const lastTapRef = useRef<number>(0);
  const tapTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 초기값이 변경되면 상태 업데이트 (서버에서 최신 데이터를 받았을 때)
  useEffect(() => {
    setIsLiked(initialLiked);
    setLikesCount(initialLikesCount);
  }, [initialLiked, initialLikesCount]);

  const handleLike = async (liked: boolean) => {
    // 비로그인 사용자는 로그인 페이지로 리다이렉트
    if (!isSignedIn) {
      router.push(`/sign-in?redirect_url=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    try {
      if (liked) {
        // 좋아요 추가
        const response = await fetch("/api/likes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ postId }),
        });

        if (response.ok) {
          setIsLiked(true);
          setLikesCount((prev) => prev + 1);
          onLikeChange?.(true, likesCount + 1);
        }
      } else {
        // 좋아요 제거
        const response = await fetch(`/api/likes?postId=${postId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          setIsLiked(false);
          setLikesCount((prev) => Math.max(0, prev - 1));
          onLikeChange?.(false, Math.max(0, likesCount - 1));
        }
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handleClick = () => {
    // 클릭 애니메이션
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 150);

    // 좋아요 토글
    handleLike(!isLiked);
  };

  const handleDoubleTap = () => {
    // 더블탭 좋아요 (모바일)
    if (!isLiked) {
      // 큰 하트 표시
      setShowBigHeart(true);
      setTimeout(() => setShowBigHeart(false), 1000);

      // 좋아요 추가
      handleLike(true);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
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
  };

  const handleTouchEnd = () => {
    if (tapTimeoutRef.current) {
      clearTimeout(tapTimeoutRef.current);
    }
  };

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
          "p-1 transition-transform duration-150",
          isAnimating && "scale-[1.3]",
          className
        )}
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

