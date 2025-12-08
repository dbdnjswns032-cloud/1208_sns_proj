/**
 * @file components/profile/ProfilePageClient.tsx
 * @description 프로필 페이지 클라이언트 컴포넌트
 *
 * 기능:
 * - 게시물 삭제 시 통계 업데이트
 * - PostGrid와 ProfileHeader 간 상태 공유
 */

"use client";

import { useState, useCallback } from "react";
import { ProfileHeader } from "./ProfileHeader";
import { PostGrid } from "./PostGrid";
import type { UserWithStats, PostWithStatsAndUser } from "@/lib/types";

interface ProfilePageClientProps {
  user: UserWithStats;
  isOwnProfile: boolean;
  initialIsFollowing: boolean;
  initialPosts: PostWithStatsAndUser[];
}

export function ProfilePageClient({
  user,
  isOwnProfile,
  initialIsFollowing,
  initialPosts,
}: ProfilePageClientProps) {
  const [posts, setPosts] = useState(initialPosts);
  const [postsCount, setPostsCount] = useState(user.posts_count);

  // 게시물 삭제 핸들러
  const handlePostDelete = useCallback((postId: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
    // 게시물 수 감소 (Optimistic UI)
    setPostsCount((prev) => Math.max(0, prev - 1));
  }, []);

  // 업데이트된 user 객체 생성 (posts_count 반영)
  const updatedUser: UserWithStats = {
    ...user,
    posts_count: postsCount,
  };

  return (
    <div className="w-full">
      <ProfileHeader
        user={updatedUser}
        isOwnProfile={isOwnProfile}
        initialIsFollowing={initialIsFollowing}
      />
      <div className="mt-8">
        <PostGrid
          posts={posts}
          onPostDeleted={handlePostDelete}
        />
      </div>
    </div>
  );
}

