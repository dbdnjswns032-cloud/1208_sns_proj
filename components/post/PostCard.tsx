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

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { MoreHorizontal, MessageCircle, Send, Bookmark } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { useUser } from "@clerk/nextjs";
import type { PostWithStatsAndUser } from "@/lib/types";
import { LikeButton } from "./LikeButton";
import { useClerkSupabaseClient } from "@/lib/supabase/clerk-client";
import { CommentList } from "@/components/comment/CommentList";
import { CommentForm } from "@/components/comment/CommentForm";

interface PostCardProps {
  post: PostWithStatsAndUser;
  onImageClick?: (postId: string) => void;
}

export function PostCard({ post, onImageClick }: PostCardProps) {
  const [showFullCaption, setShowFullCaption] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes_count);
  const { user } = useUser();
  const supabase = useClerkSupabaseClient();

  // 초기 좋아요 상태 확인
  useEffect(() => {
    async function checkLikeStatus() {
      if (!user) {
        setIsLiked(false);
        return;
      }

      try {
        // 사용자 ID 조회
        const { data: userData } = await supabase
          .from("users")
          .select("id")
          .eq("clerk_id", user.id)
          .single();

        if (!userData) return;

        // 좋아요 상태 확인
        const { data: likeData } = await supabase
          .from("likes")
          .select("id")
          .eq("post_id", post.id)
          .eq("user_id", userData.id)
          .single();

        setIsLiked(!!likeData);
      } catch (error) {
        // 좋아요가 없으면 에러가 발생할 수 있음 (정상)
        setIsLiked(false);
      }
    }

    checkLikeStatus();
  }, [user, post.id, supabase]);

  // 좋아요 수 초기화
  useEffect(() => {
    setLikesCount(post.likes_count);
  }, [post.likes_count]);

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

      {/* 이미지 영역 (1:1 정사각형) - 더블탭 좋아요 지원 */}
      <div
        className="relative w-full aspect-square bg-[var(--instagram-background)] cursor-pointer"
        onClick={() => onImageClick?.(post.id)}
      >
        <Image
          src={post.image_url}
          alt={post.caption || "게시물 이미지"}
          fill
          className="object-cover select-none pointer-events-none"
          sizes="(max-width: 768px) 100vw, 630px"
          priority
        />
        {/* 더블탭 좋아요를 위한 투명한 오버레이 */}
        <div className="absolute inset-0 pointer-events-auto">
          <LikeButton
            postId={post.id}
            initialLiked={isLiked}
            initialLikesCount={likesCount}
            onLikeChange={(liked, newCount) => {
              setIsLiked(liked);
              setLikesCount(newCount);
            }}
            className="w-full h-full opacity-0"
            size="lg"
          />
        </div>
      </div>

      {/* 액션 버튼 */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          {/* 좋아요 버튼 */}
          <LikeButton
            postId={post.id}
            initialLiked={isLiked}
            initialLikesCount={likesCount}
            onLikeChange={(liked, newCount) => {
              setIsLiked(liked);
              setLikesCount(newCount);
            }}
          />

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
      {likesCount > 0 && (
        <div className="px-4 pb-2">
          <span className="text-instagram-sm font-instagram-semibold text-[var(--instagram-text-primary)]">
            좋아요 {likesCount.toLocaleString()}개
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
      <CommentList
        postId={post.id}
        limit={2}
        showAll={false}
        onDelete={() => {
          // 댓글 삭제 시 좋아요 수 업데이트 (실제로는 서버에서 자동 업데이트됨)
          // 필요시 여기서 댓글 수를 감소시킬 수 있음
        }}
      />
      {/* 댓글 "모두 보기" 링크 클릭 시 모달 열기 */}
      {post.comments_count > 2 && (
        <div className="px-4 pb-2">
          <button
            onClick={() => onImageClick?.(post.id)}
            className="text-instagram-xs text-[var(--instagram-text-secondary)] hover:opacity-70"
          >
            댓글 {post.comments_count.toLocaleString()}개 모두 보기
          </button>
        </div>
      )}

      {/* 댓글 작성 폼 */}
      <CommentForm
        postId={post.id}
        onCommentAdded={() => {
          // 댓글 추가 후 피드 새로고침 (또는 댓글 수 업데이트)
          // 실제로는 서버에서 자동으로 comments_count가 업데이트됨
          // 필요시 여기서 댓글 수를 증가시킬 수 있음
        }}
      />
    </article>
  );
}

