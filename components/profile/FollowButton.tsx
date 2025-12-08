/**
 * @file components/profile/FollowButton.tsx
 * @description 팔로우 버튼 컴포넌트
 *
 * 기능:
 * - "팔로우" 버튼 (파란색, 미팔로우 상태)
 * - "팔로잉" 버튼 (회색, 팔로우 중 상태)
 * - Hover 시 "언팔로우" (빨간 테두리)
 * - Optimistic UI 업데이트
 */

"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface FollowButtonProps {
  followingId: string; // 팔로우할 사용자의 clerk_id
  initialIsFollowing: boolean;
  onFollowChange?: (isFollowing: boolean) => void;
  className?: string;
}

export function FollowButton({
  followingId,
  initialIsFollowing,
  onFollowChange,
  className,
}: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isLoading, setIsLoading] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  // initialIsFollowing이 변경되면 상태 업데이트 (서버에서 로드된 초기값 반영)
  useEffect(() => {
    setIsFollowing(initialIsFollowing);
  }, [initialIsFollowing]);

  const handleFollow = async () => {
    if (isLoading) return;

    setIsLoading(true);
    const previousState = isFollowing;

    // Optimistic UI 업데이트
    setIsFollowing(!previousState);
    onFollowChange?.(!previousState);

    try {
      const response = await fetch(
        previousState
          ? `/api/follows?followingId=${followingId}`
          : "/api/follows",
        {
          method: previousState ? "DELETE" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: previousState
            ? undefined
            : JSON.stringify({ followingId }),
        }
      );

      if (!response.ok) {
        // 에러 발생 시 UI 롤백
        setIsFollowing(previousState);
        onFollowChange?.(previousState);
        const errorData = await response.json();
        alert(errorData.error || "팔로우 처리 중 오류가 발생했습니다.");
      }
    } catch (error) {
      console.error("Failed to toggle follow:", error);
      // 네트워크 오류 시 UI 롤백
      setIsFollowing(previousState);
      onFollowChange?.(previousState);
      alert("네트워크 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleFollow}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      disabled={isLoading}
      className={cn(
        "px-4 py-1.5 text-instagram-sm font-instagram-semibold rounded-md transition-colors",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        isFollowing
          ? cn(
              "bg-[var(--instagram-card-background)] border border-[var(--instagram-border)] text-[var(--instagram-text-primary)]",
              isHovering &&
                "border-red-500 text-red-500 hover:bg-red-50"
            )
          : "bg-[var(--instagram-blue)] text-white hover:bg-blue-600",
        className
      )}
    >
      {isFollowing
        ? isHovering
          ? "언팔로우"
          : "팔로잉"
        : "팔로우"}
    </button>
  );
}

