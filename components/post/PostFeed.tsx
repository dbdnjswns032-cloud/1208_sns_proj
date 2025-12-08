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

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { PostCard } from "./PostCard";
import { PostCardSkeleton } from "./PostCardSkeleton";
import { PostModal } from "./PostModal";
import type { PostWithStatsAndUser } from "@/lib/types";
import { fetchWithTimeout, extractErrorMessage, getErrorMessage } from "@/lib/api-error-handler";
import { toastError } from "@/lib/toast";
import { AlertCircle } from "lucide-react";

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
  const [error, setError] = useState<string | null>(null);
  const observerTarget = useRef<HTMLDivElement>(null);

  // 게시물 삭제 핸들러
  const handlePostDelete = useCallback((postId: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  }, []);

  const fetchPosts = useCallback(
    async (currentOffset: number) => {
      if (loading || !hasMore) return;

    setLoading(true);
    setError(null); // 에러 상태 초기화
    try {
      const params = new URLSearchParams({
        limit: "10",
        offset: currentOffset.toString(),
      });

      if (userId) {
        params.append("userId", userId);
      }

      const response = await fetchWithTimeout(
        `/api/posts?${params.toString()}`,
        {},
        10000 // 10초 타임아웃
      );

      if (!response.ok) {
        const errorMessage = await extractErrorMessage(response);
        throw new Error(errorMessage);
      }

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
      const errorMessage = getErrorMessage(
        error,
        "게시물을 불러오는 중 오류가 발생했습니다."
      );
      setError(errorMessage);
      toastError(errorMessage);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
    },
    [userId, loading, hasMore]
  );

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
  }, [offset, hasMore, loading, fetchPosts]);

  const handleImageClick = useCallback((postId: string) => {
    setModalPostId(postId);
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalPostId(null);
  }, []);

  // 모달에 표시할 게시물 찾기 (메모이제이션)
  const modalPost = useMemo(() => {
    return modalPostId ? posts.find((p) => p.id === modalPostId) : undefined;
  }, [modalPostId, posts]);

  // 모달 삭제 핸들러 (메모이제이션)
  const handleModalPostDelete = useCallback(
    (deletedPostId: string) => {
      handlePostDelete(deletedPostId);
      handleCloseModal();
    },
    [handlePostDelete, handleCloseModal]
  );

  return (
    <div className="w-full">
      {/* 에러 상태 표시 */}
      {error && !loading && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-800 dark:text-red-200">{error}</p>
            <button
              onClick={() => fetchPosts(offset)}
              className="mt-2 text-sm text-red-600 dark:text-red-400 hover:underline"
            >
              다시 시도
            </button>
          </div>
        </div>
      )}

      {/* 게시물 목록 */}
      {posts.length > 0 ? (
        <>
          {posts.map((post, index) => (
            <PostCard
              key={post.id}
              post={post}
              onImageClick={handleImageClick}
              onPostDeleted={handlePostDelete}
              priority={index < 3} // 첫 3개만 priority
            />
          ))}
        </>
      ) : (
        !loading &&
        !error && (
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
          onPostDeleted={handleModalPostDelete}
        />
      )}
    </div>
  );
}

