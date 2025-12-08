/**
 * @file components/profile/ProfileHeader.tsx
 * @description 프로필 헤더 컴포넌트
 *
 * 기능:
 * - 프로필 이미지 (150px Desktop / 90px Mobile)
 * - 사용자명 및 통계 (게시물 수, 팔로워 수, 팔로잉 수)
 * - 팔로우 버튼 또는 프로필 편집 버튼
 * - 반응형 레이아웃
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import type { UserWithStats } from "@/lib/types";
import { FollowButton } from "./FollowButton";
import { cn } from "@/lib/utils";

interface ProfileHeaderProps {
  user: UserWithStats;
  isOwnProfile: boolean;
  initialIsFollowing?: boolean;
}

export function ProfileHeader({
  user,
  isOwnProfile,
  initialIsFollowing = false,
}: ProfileHeaderProps) {
  const { user: clerkUser } = useUser();
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [followersCount, setFollowersCount] = useState(user.followers_count);

  // 프로필 이미지 (기본 아바타: 이름 첫 글자)
  const avatarText = user.name.charAt(0).toUpperCase();

  const handleFollowChange = (newIsFollowing: boolean) => {
    setIsFollowing(newIsFollowing);
    // Optimistic UI: 팔로우 수 업데이트
    setFollowersCount((prev) => (newIsFollowing ? prev + 1 : prev - 1));
  };

  // 게시물 삭제 시 통계 업데이트 (외부에서 호출 가능하도록)
  // onPostDeleted는 함수가 아니라 트리거 역할
  // 실제로는 PostGrid에서 삭제 시 ProfilePageClient를 통해 상태가 업데이트됨

  return (
    <div className="w-full">
      {/* Desktop: 가로 레이아웃 */}
      <div className="hidden md:flex items-start gap-8 px-4 py-8">
        {/* 프로필 이미지 */}
        <div className="w-[150px] h-[150px] rounded-full bg-[var(--instagram-border)] flex items-center justify-center overflow-hidden flex-shrink-0">
          <div className="w-full h-full flex items-center justify-center text-6xl font-instagram-bold text-[var(--instagram-text-primary)]">
            {avatarText}
          </div>
        </div>

        {/* 사용자 정보 */}
        <div className="flex-1">
          {/* 사용자명 및 액션 버튼 */}
          <div className="flex items-center gap-4 mb-4">
            <h1 className="text-instagram-xl font-instagram-normal text-[var(--instagram-text-primary)]">
              {user.name}
            </h1>
            {isOwnProfile ? (
              <Link
                href="/profile/edit"
                className="px-4 py-1.5 text-instagram-sm font-instagram-semibold border border-[var(--instagram-border)] rounded-md hover:bg-[var(--instagram-background)] transition-colors"
              >
                프로필 편집
              </Link>
            ) : (
              <FollowButton
                followingId={user.clerk_id}
                initialIsFollowing={isFollowing}
                onFollowChange={handleFollowChange}
              />
            )}
          </div>

          {/* 통계 */}
          <div className="flex items-center gap-8 mb-4">
            <div className="flex items-center gap-1">
              <span className="text-instagram-base font-instagram-semibold text-[var(--instagram-text-primary)]">
                {user.posts_count.toLocaleString()}
              </span>
              <span className="text-instagram-base text-[var(--instagram-text-primary)]">
                게시물
              </span>
            </div>
            <button className="flex items-center gap-1 hover:opacity-70 transition-opacity">
              <span className="text-instagram-base font-instagram-semibold text-[var(--instagram-text-primary)]">
                {followersCount.toLocaleString()}
              </span>
              <span className="text-instagram-base text-[var(--instagram-text-primary)]">
                팔로워
              </span>
            </button>
            <button className="flex items-center gap-1 hover:opacity-70 transition-opacity">
              <span className="text-instagram-base font-instagram-semibold text-[var(--instagram-text-primary)]">
                {user.following_count.toLocaleString()}
              </span>
              <span className="text-instagram-base text-[var(--instagram-text-primary)]">
                팔로잉
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile: 세로 레이아웃 */}
      <div className="md:hidden px-4 py-6">
        {/* 프로필 이미지 및 사용자명 */}
        <div className="flex items-center gap-4 mb-4">
          <div className="w-[90px] h-[90px] rounded-full bg-[var(--instagram-border)] flex items-center justify-center overflow-hidden flex-shrink-0">
            <div className="w-full h-full flex items-center justify-center text-4xl font-instagram-bold text-[var(--instagram-text-primary)]">
              {avatarText}
            </div>
          </div>
          <div className="flex-1">
            <h1 className="text-instagram-base font-instagram-normal text-[var(--instagram-text-primary)] mb-3">
              {user.name}
            </h1>
            {isOwnProfile ? (
              <Link
                href="/profile/edit"
                className="block w-full px-4 py-1.5 text-instagram-sm font-instagram-semibold border border-[var(--instagram-border)] rounded-md hover:bg-[var(--instagram-background)] transition-colors text-center"
              >
                프로필 편집
              </Link>
            ) : (
              <FollowButton
                followingId={user.clerk_id}
                initialIsFollowing={isFollowing}
                onFollowChange={handleFollowChange}
                className="w-full"
              />
            )}
          </div>
        </div>

        {/* 통계 */}
        <div className="flex items-center justify-around border-t border-[var(--instagram-border)] pt-4">
          <div className="flex flex-col items-center">
            <span className="text-instagram-base font-instagram-semibold text-[var(--instagram-text-primary)]">
              {user.posts_count.toLocaleString()}
            </span>
            <span className="text-instagram-xs text-[var(--instagram-text-secondary)]">
              게시물
            </span>
          </div>
          <button className="flex flex-col items-center hover:opacity-70 transition-opacity">
            <span className="text-instagram-base font-instagram-semibold text-[var(--instagram-text-primary)]">
              {followersCount.toLocaleString()}
            </span>
            <span className="text-instagram-xs text-[var(--instagram-text-secondary)]">
              팔로워
            </span>
          </button>
          <button className="flex flex-col items-center hover:opacity-70 transition-opacity">
            <span className="text-instagram-base font-instagram-semibold text-[var(--instagram-text-primary)]">
              {user.following_count.toLocaleString()}
            </span>
            <span className="text-instagram-xs text-[var(--instagram-text-secondary)]">
              팔로잉
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

