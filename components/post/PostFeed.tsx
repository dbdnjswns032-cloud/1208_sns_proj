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
import dynamic from "next/dynamic";
import { PostCard } from "./PostCard";
import { PostCardSkeleton } from "./PostCardSkeleton";
import type { PostWithStatsAndUser } from "@/lib/types";

// PostModal을 동적 import로 lazy loading
const PostModal = dynamic(() => import("./PostModal").then((mod) => ({ default: mod.PostModal })), {
  ssr: false,
  loading: () => null, // 모달이 열릴 때만 로드되므로 로딩 상태 불필요
});

interface PostFeedProps {
  initialPosts?: PostWithStatsAndUser[];
  userId?: string; // 프로필 페이지용
}

export function PostFeed({ initialPosts = [], userId }: PostFeedProps) {
  const [posts, setPosts] = useState<PostWithStatsAndUser[]>(initialPosts);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(initialPosts.length);
  const [modalPostId, setModalPostId] = useState<string | null>(null);
  const observerTarget = useRef<HTMLDivElement>(null);

  // 게시물 삭제 핸들러
  const handlePostDelete = (postId: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  };

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

  // Intersection Observer로 무한 스크롤 구현 (성능 최적화: requestAnimationFrame 사용)
  useEffect(() => {
    let rafId: number | null = null;

    const observer = new IntersectionObserver(
      (entries) => {
        // requestAnimationFrame으로 콜백 래핑하여 성능 최적화
        if (rafId !== null) {
          cancelAnimationFrame(rafId);
        }

        rafId = requestAnimationFrame(() => {
          if (entries[0].isIntersecting && hasMore && !loading) {
            // 개발 모드에서 성능 측정 로그
            if (process.env.NODE_ENV === "development") {
              const startTime = performance.now();
              fetchPosts(offset).finally(() => {
                const endTime = performance.now();
                console.log(`[PostFeed] Fetch posts took ${(endTime - startTime).toFixed(2)}ms`);
              });
            } else {
              fetchPosts(offset);
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [offset, hasMore, loading, userId]);

  const handleImageClick = (postId: string) => {
    setModalPostId(postId);
  };

  const handleCloseModal = () => {
    setModalPostId(null);
  };

  // 모달에 표시할 게시물 찾기
  const modalPost = modalPostId
    ? posts.find((p) => p.id === modalPostId)
    : undefined;

  return (
    <div className="w-full">
      {/* 게시물 목록 */}
      {posts.length > 0 ? (
        <>
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onImageClick={handleImageClick}
              onPostDeleted={handlePostDelete}
            />
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

      {/* 게시물 상세 모달 */}
      {modalPostId && (
        <PostModal
          postId={modalPostId}
          isOpen={!!modalPostId}
          onClose={handleCloseModal}
          initialPost={modalPost}
          allPosts={posts}
          onPostDeleted={(deletedPostId) => {
            handlePostDelete(deletedPostId);
            handleCloseModal();
          }}
        />
      )}
    </div>
  );
}

