/**
 * @file components/post/PostCard.tsx
 * @description Instagram 스타일 게시물 카드 컴포넌트
 *
 * 구성 요소:
 * - 헤더: 프로필 이미지 32px, 사용자명, 시간, ⋯ 메뉴
 * - 이미지 영역: 1:1 정사각형
 * - 액션 버튼: 좋아요, 댓글, 공유, 북마크
 * - 좋아요 수 표시
 * - 캡션: 사용자명 Bold + 내용, 2줄 초과 시 "... 더 보기"
 * - 댓글 미리보기: 최신 2개
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MoreHorizontal, Heart, MessageCircle, Send, Bookmark } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import type { PostWithStatsAndUser } from "@/lib/types";
import { cn } from "@/lib/utils";

interface PostCardProps {
  post: PostWithStatsAndUser;
}

export function PostCard({ post }: PostCardProps) {
  const [showFullCaption, setShowFullCaption] = useState(false);
  const [isLiked, setIsLiked] = useState(false); // TODO: 실제 좋아요 상태 연동

  // 캡션 처리: 2줄 초과 시 "... 더 보기" 표시
  const captionLines = post.caption?.split("\n") || [];
  const shouldTruncate = captionLines.length > 2 || (post.caption && post.caption.length > 100);
  const displayCaption = showFullCaption
    ? post.caption
    : shouldTruncate
    ? post.caption?.substring(0, 100) + "..."
    : post.caption;

  // 시간 포맷팅
  const timeAgo = formatDistanceToNow(new Date(post.created_at), {
    addSuffix: true,
    locale: ko,
  });

  return (
    <article className="bg-[var(--instagram-card-background)] border border-[var(--instagram-border)] rounded-lg mb-6">
      {/* 헤더 */}
      <header className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          {/* 프로필 이미지 (32px 원형) */}
          <Link href={`/profile/${post.user.clerk_id}`}>
            <div className="w-8 h-8 rounded-full bg-[var(--instagram-border)] flex items-center justify-center overflow-hidden">
              {post.user.name.charAt(0).toUpperCase()}
            </div>
          </Link>

          {/* 사용자명 및 시간 */}
          <div className="flex flex-col">
            <Link
              href={`/profile/${post.user.clerk_id}`}
              className="text-instagram-sm font-instagram-semibold text-[var(--instagram-text-primary)] hover:opacity-70"
            >
              {post.user.name}
            </Link>
            <span className="text-instagram-xs text-[var(--instagram-text-secondary)]">
              {timeAgo}
            </span>
          </div>
        </div>

        {/* ⋯ 메뉴 */}
        <button
          className="p-1 hover:opacity-70 transition-opacity"
          aria-label="더보기"
        >
          <MoreHorizontal className="w-5 h-5 text-[var(--instagram-text-primary)]" />
        </button>
      </header>

      {/* 이미지 영역 (1:1 정사각형) */}
      <div className="relative w-full aspect-square bg-[var(--instagram-background)]">
        <Image
          src={post.image_url}
          alt={post.caption || "게시물 이미지"}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 630px"
          priority
        />
      </div>

      {/* 액션 버튼 */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          {/* 좋아요 */}
          <button
            className={cn(
              "p-1 transition-transform hover:scale-110",
              isLiked && "text-[var(--instagram-like)]"
            )}
            aria-label="좋아요"
          >
            <Heart
              className={cn("w-6 h-6", isLiked && "fill-current")}
              strokeWidth={isLiked ? 0 : 2}
            />
          </button>

          {/* 댓글 */}
          <button
            className="p-1 transition-transform hover:scale-110"
            aria-label="댓글"
          >
            <MessageCircle className="w-6 h-6 text-[var(--instagram-text-primary)]" />
          </button>

          {/* 공유 */}
          <button
            className="p-1 transition-transform hover:scale-110"
            aria-label="공유"
          >
            <Send className="w-6 h-6 text-[var(--instagram-text-primary)]" />
          </button>
        </div>

        {/* 북마크 */}
        <button
          className="p-1 transition-transform hover:scale-110"
          aria-label="저장"
        >
          <Bookmark className="w-6 h-6 text-[var(--instagram-text-primary)]" />
        </button>
      </div>

      {/* 좋아요 수 */}
      {post.likes_count > 0 && (
        <div className="px-4 pb-2">
          <span className="text-instagram-sm font-instagram-semibold text-[var(--instagram-text-primary)]">
            좋아요 {post.likes_count.toLocaleString()}개
          </span>
        </div>
      )}

      {/* 캡션 */}
      {post.caption && (
        <div className="px-4 pb-2">
          <p className="text-instagram-sm text-[var(--instagram-text-primary)]">
            <Link
              href={`/profile/${post.user.clerk_id}`}
              className="font-instagram-semibold hover:opacity-70"
            >
              {post.user.name}
            </Link>{" "}
            {displayCaption}
            {shouldTruncate && !showFullCaption && (
              <button
                onClick={() => setShowFullCaption(true)}
                className="text-[var(--instagram-text-secondary)] hover:opacity-70 ml-1"
              >
                더 보기
              </button>
            )}
          </p>
        </div>
      )}

      {/* 댓글 미리보기 (최신 2개) */}
      {post.comments_count > 0 && (
        <div className="px-4 pb-4">
          <Link
            href={`/post/${post.id}`}
            className="text-instagram-xs text-[var(--instagram-text-secondary)] hover:opacity-70 mb-2 block"
          >
            댓글 {post.comments_count.toLocaleString()}개 모두 보기
          </Link>
          {/* TODO: 실제 댓글 데이터 연동 */}
          <div className="space-y-1">
            <p className="text-instagram-sm text-[var(--instagram-text-primary)]">
              <span className="font-instagram-semibold">username2</span> 멋진 사진이네요!
            </p>
            <p className="text-instagram-sm text-[var(--instagram-text-primary)]">
              <span className="font-instagram-semibold">username3</span> 좋아요 👍
            </p>
          </div>
        </div>
      )}
    </article>
  );
}

