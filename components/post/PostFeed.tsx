/**
 * @file components/post/PostFeed.tsx
 * @description 게시물 피드 컴포넌트
 *
 * 기능:
 * - 게시물 목록 렌더링
 * - 무한 스크롤 (Intersection Observer)
 * - 페이지네이션 (10개씩)
 * - 로딩 상태 표시 (Skeleton UI)
 */

"use client";

import { useEffect, useRef, useState } from "react";
import { PostCard } from "./PostCard";
import { PostCardSkeleton } from "./PostCardSkeleton";
import type { PostWithStatsAndUser } from "@/lib/types";

interface PostFeedProps {
  initialPosts?: PostWithStatsAndUser[];
  userId?: string; // 프로필 페이지용
}

export function PostFeed({ initialPosts = [], userId }: PostFeedProps) {
  const [posts, setPosts] = useState<PostWithStatsAndUser[]>(initialPosts);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(initialPosts.length);
  const observerTarget = useRef<HTMLDivElement>(null);

  const fetchPosts = async (currentOffset: number) => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const params = new URLSearchParams({
        limit: "10",
        offset: currentOffset.toString(),
      });

      if (userId) {
        params.append("userId", userId);
      }

      const response = await fetch(`/api/posts?${params.toString()}`);
      const data = await response.json();

      if (data.posts && data.posts.length > 0) {
        setPosts((prev) => [...prev, ...data.posts]);
        setOffset(currentOffset + data.posts.length);
        setHasMore(data.hasMore);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  // Intersection Observer로 무한 스크롤 구현
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          fetchPosts(offset);
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [offset, hasMore, loading, userId]);

  return (
    <div className="w-full">
      {/* 게시물 목록 */}
      {posts.length > 0 ? (
        <>
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </>
      ) : (
        !loading && (
          <div className="text-center py-12 text-[var(--instagram-text-secondary)]">
            게시물이 없습니다.
          </div>
        )
      )}

      {/* 로딩 스켈레톤 */}
      {loading && (
        <>
          <PostCardSkeleton />
          <PostCardSkeleton />
        </>
      )}

      {/* Intersection Observer 타겟 */}
      <div ref={observerTarget} className="h-4" />
    </div>
  );
}

