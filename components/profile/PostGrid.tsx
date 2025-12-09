/**
 * @file components/profile/PostGrid.tsx
 * @description 프로필 페이지 게시물 그리드 컴포넌트
 *
 * 기능:
 * - 3열 그리드 레이아웃 (반응형)
 * - 1:1 정사각형 썸네일
 * - Hover 시 좋아요/댓글 수 표시 (Desktop/Tablet)
 * - 클릭 시 게시물 상세 모달 열기
 */

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Heart, MessageCircle } from "lucide-react";
import type { PostWithStatsAndUser } from "@/lib/types";
import { PostModal } from "@/components/post/PostModal";
import { cn } from "@/lib/utils";

interface PostGridProps {
  posts: PostWithStatsAndUser[];
  onPostClick?: (postId: string) => void;
  onPostDeleted?: (postId: string) => void; // 게시물 삭제 콜백
}

export function PostGrid({ posts, onPostClick, onPostDeleted }: PostGridProps) {
  const [modalPostId, setModalPostId] = useState<string | null>(null);
  const [hoveredPostId, setHoveredPostId] = useState<string | null>(null);
  const [currentPosts, setCurrentPosts] = useState(posts);

  // posts prop이 변경되면 상태 업데이트
  useEffect(() => {
    setCurrentPosts(posts);
  }, [posts]);

  const handlePostClick = (postId: string) => {
    setModalPostId(postId);
    onPostClick?.(postId);
  };

  const handleCloseModal = () => {
    setModalPostId(null);
  };

  // 게시물 삭제 핸들러
  const handlePostDelete = (postId: string) => {
    setCurrentPosts((prev) => prev.filter((p) => p.id !== postId));
    onPostDeleted?.(postId);
    handleCloseModal();
  };

  // 모달에 표시할 게시물 찾기
  const modalPost = modalPostId
    ? currentPosts.find((p) => p.id === modalPostId)
    : undefined;

  if (currentPosts.length === 0) {
    return (
      <div className="w-full py-12 text-center">
        <p className="text-instagram-base text-[var(--instagram-text-secondary)]">
          게시물이 없습니다.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-3 gap-1 md:gap-4 w-full">
        {currentPosts.map((post) => (
          <div
            key={post.id}
            className="relative aspect-square bg-[var(--instagram-background)] cursor-pointer group"
            onClick={() => handlePostClick(post.id)}
            onMouseEnter={() => setHoveredPostId(post.id)}
            onMouseLeave={() => setHoveredPostId(null)}
          >
            <Image
              src={post.image_url}
              alt={post.caption || "게시물 이미지"}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 33vw, (max-width: 1024px) 33vw, 210px"
            />
            {/* Hover 오버레이 (Desktop/Tablet만) */}
            {hoveredPostId === post.id && (
              <div className="hidden md:flex absolute inset-0 bg-black/40 items-center justify-center gap-6 text-white">
                <div className="flex items-center gap-2">
                  <Heart className="w-6 h-6 fill-white" />
                  <span className="text-instagram-base font-instagram-semibold">
                    {post.likes_count.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-6 h-6 fill-white" />
                  <span className="text-instagram-base font-instagram-semibold">
                    {post.comments_count.toLocaleString()}
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 게시물 상세 모달 */}
      {modalPostId && (
        <PostModal
          postId={modalPostId}
          isOpen={!!modalPostId}
          onClose={handleCloseModal}
          initialPost={modalPost}
          allPosts={currentPosts}
          onPostDeleted={handlePostDelete}
        />
      )}
    </>
  );
}

