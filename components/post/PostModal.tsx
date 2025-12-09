/**
 * @file components/post/PostModal.tsx
 * @description 게시물 상세 모달 컴포넌트
 *
 * 기능:
 * - Desktop: 모달 형식 (이미지 50% + 댓글 50%)
 * - Mobile: 전체 페이지로 전환
 * - 닫기 버튼 (✕)
 * - 이전/다음 게시물 네비게이션 (Desktop)
 * - 댓글 전체 목록 표시
 */

"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, MoreHorizontal, MessageCircle, Send, Bookmark, Heart, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { useUser } from "@clerk/nextjs";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { PostWithStatsAndUser } from "@/lib/types";
import { LikeButton } from "./LikeButton";
import { CommentList } from "@/components/comment/CommentList";
import { CommentForm } from "@/components/comment/CommentForm";
import { useClerkSupabaseClient } from "@/lib/supabase/clerk-client";
import { cn } from "@/lib/utils";

interface PostModalProps {
  postId: string;
  isOpen: boolean;
  onClose: () => void;
  initialPost?: PostWithStatsAndUser;
  allPosts?: PostWithStatsAndUser[]; // 이전/다음 게시물 네비게이션용
  onPostDeleted?: (postId: string) => void; // 게시물 삭제 콜백
}

export function PostModal({
  postId,
  isOpen,
  onClose,
  initialPost,
  allPosts = [],
  onPostDeleted,
}: PostModalProps) {
  const [post, setPost] = useState<PostWithStatsAndUser | null>(initialPost || null);
  const [loading, setLoading] = useState(!initialPost);
  const [isLiked, setIsLiked] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [showBigHeart, setShowBigHeart] = useState(false);
  const { user } = useUser();
  const supabase = useClerkSupabaseClient();

  // 스와이프로 닫기 (모바일 전용)
  const touchStartY = useRef<number | null>(null);
  const touchStartX = useRef<number | null>(null);
  const SWIPE_THRESHOLD = 100; // 최소 스와이프 거리 (px)
  const VERTICAL_SWIPE_RATIO = 0.5; // 수직 스와이프 비율 (수직/수평)

  // 현재 게시물 인덱스 찾기
  const currentIndex = allPosts.findIndex((p) => p.id === postId);
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < allPosts.length - 1 && currentIndex >= 0;

  // 게시물 데이터 로드
  useEffect(() => {
    async function loadPost() {
      if (initialPost && initialPost.id === postId) {
        setPost(initialPost);
        setLikesCount(initialPost.likes_count);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(`/api/posts?postId=${postId}`);
        if (!response.ok) {
          throw new Error("게시물을 불러올 수 없습니다.");
        }
        const data = await response.json();
        if (data.post) {
          setPost(data.post);
          setLikesCount(data.post.likes_count || 0);
        }
      } catch (error) {
        console.error("Error loading post:", error);
      } finally {
        setLoading(false);
      }
    }

    if (isOpen) {
      loadPost();
    }
  }, [postId, isOpen, initialPost]);

  // 좋아요 상태 확인
  useEffect(() => {
    async function checkLikeStatus() {
      if (!user || !post) {
        setIsLiked(false);
        return;
      }

      try {
        const { data: userData } = await supabase
          .from("users")
          .select("id")
          .eq("clerk_id", user.id)
          .single();

        if (!userData) return;

        const { data: likeData } = await supabase
          .from("likes")
          .select("id")
          .eq("post_id", post.id)
          .eq("user_id", userData.id)
          .single();

        setIsLiked(!!likeData);
      } catch (error) {
        setIsLiked(false);
      }
    }

    if (post) {
      checkLikeStatus();
    }
  }, [user, post, supabase]);

  // 좋아요 수 초기화
  useEffect(() => {
    if (post) {
      setLikesCount(post.likes_count);
    }
  }, [post]);

  // 이전 게시물로 이동
  const handlePrevious = () => {
    if (hasPrevious && allPosts[currentIndex - 1]) {
      const prevPost = allPosts[currentIndex - 1];
      setPost(prevPost);
      setLikesCount(prevPost.likes_count);
      // URL 업데이트 (선택사항)
      window.history.pushState({}, "", `/post/${prevPost.id}`);
    }
  };

  // 다음 게시물로 이동
  const handleNext = () => {
    if (hasNext && allPosts[currentIndex + 1]) {
      const nextPost = allPosts[currentIndex + 1];
      setPost(nextPost);
      setLikesCount(nextPost.likes_count);
      // URL 업데이트 (선택사항)
      window.history.pushState({}, "", `/post/${nextPost.id}`);
    }
  };

  // 더블탭 좋아요
  const handleImageDoubleTap = () => {
    if (!isLiked) {
      setShowBigHeart(true);
      setTimeout(() => setShowBigHeart(false), 1000);
    }
  };

  const lastTapRef = useRef(0);
  
  // 스와이프로 닫기 핸들러 (모바일 전용)
  const handleSwipeStart = (e: React.TouchEvent) => {
    // Desktop에서는 비활성화
    if (window.innerWidth >= 1024) return;

    const touch = e.touches[0];
    touchStartY.current = touch.clientY;
    touchStartX.current = touch.clientX;
  };

  const handleSwipeMove = (e: React.TouchEvent) => {
    // Desktop에서는 비활성화
    if (window.innerWidth >= 1024) return;

    if (touchStartY.current === null || touchStartX.current === null) return;

    const touch = e.touches[0];
    const deltaY = touch.clientY - touchStartY.current;
    const deltaX = touch.clientX - touchStartX.current;

    // 수직 스와이프가 수평 스와이프보다 큰 경우에만 처리
    if (Math.abs(deltaY) > Math.abs(deltaX) && deltaY > 0) {
      // 아래로 스와이프 중
      e.preventDefault();
    }
  };

  const handleSwipeEnd = (e: React.TouchEvent) => {
    // Desktop에서는 비활성화
    if (window.innerWidth >= 1024) return;

    if (touchStartY.current === null || touchStartX.current === null) return;

    const touch = e.changedTouches[0];
    const deltaY = touch.clientY - touchStartY.current;
    const deltaX = touch.clientX - touchStartX.current;
    const absDeltaY = Math.abs(deltaY);
    const absDeltaX = Math.abs(deltaX);

    // 아래로 스와이프하고, 최소 거리 이상이고, 수직 스와이프가 수평보다 큰 경우
    if (deltaY > 0 && absDeltaY >= SWIPE_THRESHOLD && absDeltaY > absDeltaX * VERTICAL_SWIPE_RATIO) {
      onClose();
    }

    // 초기화
    touchStartY.current = null;
    touchStartX.current = null;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTapRef.current;

    if (tapLength < 300 && tapLength > 0) {
      e.preventDefault();
      handleImageDoubleTap();
    }
    lastTapRef.current = currentTime;
  };

  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl w-full h-[90vh] p-0 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--instagram-blue)] mx-auto mb-4"></div>
            <p className="text-instagram-sm text-[var(--instagram-text-secondary)]">로딩 중...</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!post) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl w-full h-[90vh] p-0 flex items-center justify-center">
          <div className="text-center">
            <p className="text-instagram-base text-[var(--instagram-text-primary)] mb-2">게시물을 찾을 수 없습니다.</p>
            <button
              onClick={onClose}
              className="text-instagram-sm text-[var(--instagram-blue)] hover:opacity-70"
            >
              닫기
            </button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const isOwnPost = user?.id === post.user.clerk_id;

  const timeAgo = formatDistanceToNow(new Date(post.created_at), {
    addSuffix: true,
    locale: ko,
  });

  // 게시물 삭제 핸들러
  const handleDelete = async () => {
    if (!isOwnPost || !post || isDeleting) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/posts/${post.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "게시물 삭제에 실패했습니다.");
      }

      // 삭제 성공 시 모달 닫기 및 부모 컴포넌트에 알림
      onPostDeleted?.(post.id);
      onClose();
    } catch (error) {
      console.error("Error deleting post:", error);
      alert(error instanceof Error ? error.message : "게시물 삭제에 실패했습니다.");
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="max-w-4xl w-full h-[90vh] p-0 overflow-hidden flex flex-col md:flex-row"
        onTouchStart={handleSwipeStart}
        onTouchMove={handleSwipeMove}
        onTouchEnd={handleSwipeEnd}
      >
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
          aria-label="닫기"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        {/* 이전/다음 버튼 (Desktop만) */}
        {hasPrevious && (
          <button
            onClick={handlePrevious}
            className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-50 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
            aria-label="이전 게시물"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
        )}
        {hasNext && (
          <button
            onClick={handleNext}
            className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-50 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
            aria-label="다음 게시물"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        )}

        {/* 좌측: 이미지 영역 */}
        <div className="relative w-full md:w-1/2 h-[50vh] md:h-full bg-black flex items-center justify-center">
          <div
            className="relative w-full h-full"
            onTouchStart={handleTouchStart}
          >
            <Image
              src={post.image_url}
              alt={post.caption || "게시물 이미지"}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
            {/* 더블탭 좋아요 애니메이션 */}
            {showBigHeart && (
              <Heart
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 text-white drop-shadow-lg animate-fadeInOut"
                fill="white"
                stroke="red"
                strokeWidth={1}
              />
            )}
          </div>
        </div>

        {/* 우측: 게시물 정보 + 댓글 (Desktop만) */}
        <div className="hidden md:flex flex-col w-1/2 h-full bg-[var(--instagram-card-background)]">
          {/* 헤더 */}
          <header className="flex items-center justify-between p-4 border-b border-[var(--instagram-border)]">
            <div className="flex items-center gap-3">
              <Link href={`/profile/${post.user.clerk_id}`}>
                <div className="w-8 h-8 rounded-full bg-[var(--instagram-border)] flex items-center justify-center overflow-hidden">
                  {post.user.name.charAt(0).toUpperCase()}
                </div>
              </Link>
              <div className="flex flex-col">
                <Link
                  href={`/profile/${post.user.clerk_id}`}
                  className="text-instagram-sm font-instagram-semibold text-[var(--instagram-text-primary)] hover:opacity-70"
                >
                  {post.user.name}
                </Link>
              </div>
            </div>
            {isOwnPost ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="p-1 hover:opacity-70 transition-opacity"
                    aria-label="더보기"
                  >
                    <MoreHorizontal className="w-5 h-5 text-[var(--instagram-text-primary)]" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => setShowDeleteDialog(true)}
                    className="text-red-600 focus:text-red-600 focus:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    삭제
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <button
                className="p-1 hover:opacity-70 transition-opacity opacity-0"
                aria-label="더보기"
                disabled
              >
                <MoreHorizontal className="w-5 h-5 text-[var(--instagram-text-primary)]" />
              </button>
            )}
          </header>

          {/* 댓글 목록 (스크롤 가능) */}
          <div className="flex-1 overflow-y-auto min-h-0">
            {/* 게시물 내용 */}
            <div className="p-4 border-b border-[var(--instagram-border)]">
              <div className="flex items-start gap-3 mb-2">
                <Link href={`/profile/${post.user.clerk_id}`}>
                  <div className="w-8 h-8 rounded-full bg-[var(--instagram-border)] flex items-center justify-center overflow-hidden flex-shrink-0">
                    {post.user.name.charAt(0).toUpperCase()}
                  </div>
                </Link>
                <div className="flex-1">
                  <p className="text-instagram-sm text-[var(--instagram-text-primary)] whitespace-pre-wrap">
                    <Link
                      href={`/profile/${post.user.clerk_id}`}
                      className="font-instagram-semibold hover:opacity-70"
                    >
                      {post.user.name}
                    </Link>{" "}
                    {post.caption}
                  </p>
                  <span className="text-instagram-xs text-[var(--instagram-text-secondary)] mt-1 block">
                    {timeAgo}
                  </span>
                </div>
              </div>
            </div>

            {/* 댓글 목록 */}
            <CommentList
              postId={post.id}
              showAll={true}
              onDelete={() => {
                // 댓글 삭제 후 목록 자동 업데이트
              }}
            />
          </div>

          {/* 액션 버튼 및 좋아요 수 */}
          <div className="border-t border-[var(--instagram-border)]">
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-4">
                  <LikeButton
                    postId={post.id}
                    initialLiked={isLiked}
                    initialLikesCount={likesCount}
                    onLikeChange={(liked, newCount) => {
                      setIsLiked(liked);
                      setLikesCount(newCount);
                    }}
                  />
                  <button
                    className="p-1 transition-transform hover:scale-110"
                    aria-label="댓글"
                  >
                    <MessageCircle className="w-6 h-6 text-[var(--instagram-text-primary)]" />
                  </button>
                  <button
                    className="p-1 transition-transform hover:scale-110"
                    aria-label="공유"
                  >
                    <Send className="w-6 h-6 text-[var(--instagram-text-primary)]" />
                  </button>
                </div>
                <button
                  className="p-1 transition-transform hover:scale-110"
                  aria-label="저장"
                >
                  <Bookmark className="w-6 h-6 text-[var(--instagram-text-primary)]" />
                </button>
              </div>
              {likesCount > 0 && (
                <div className="mb-2">
                  <span className="text-instagram-sm font-instagram-semibold text-[var(--instagram-text-primary)]">
                    좋아요 {likesCount.toLocaleString()}개
                  </span>
                </div>
              )}
            </div>

            {/* 댓글 작성 폼 */}
            <CommentForm
              postId={post.id}
              onCommentAdded={() => {
                // 댓글 추가 후 목록 자동 업데이트
              }}
            />
          </div>
        </div>

        {/* Mobile: 세로 레이아웃 */}
        <div className="md:hidden flex flex-col w-full h-full bg-[var(--instagram-card-background)] overflow-y-auto">
          {/* 헤더 */}
          <header className="flex items-center justify-between p-4 border-b border-[var(--instagram-border)] sticky top-0 bg-[var(--instagram-card-background)] z-10">
            <div className="flex items-center gap-3">
              <Link href={`/profile/${post.user.clerk_id}`}>
                <div className="w-8 h-8 rounded-full bg-[var(--instagram-border)] flex items-center justify-center overflow-hidden">
                  {post.user.name.charAt(0).toUpperCase()}
                </div>
              </Link>
              <Link
                href={`/profile/${post.user.clerk_id}`}
                className="text-instagram-sm font-instagram-semibold text-[var(--instagram-text-primary)] hover:opacity-70"
              >
                {post.user.name}
              </Link>
            </div>
            {isOwnPost ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="p-1 hover:opacity-70 transition-opacity"
                    aria-label="더보기"
                  >
                    <MoreHorizontal className="w-5 h-5 text-[var(--instagram-text-primary)]" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => setShowDeleteDialog(true)}
                    className="text-red-600 focus:text-red-600 focus:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    삭제
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <button
                className="p-1 hover:opacity-70 transition-opacity opacity-0"
                aria-label="더보기"
                disabled
              >
                <MoreHorizontal className="w-5 h-5 text-[var(--instagram-text-primary)]" />
              </button>
            )}
          </header>

          {/* 게시물 내용 */}
          <div className="p-4 border-b border-[var(--instagram-border)]">
            <div className="flex items-start gap-3 mb-2">
              <Link href={`/profile/${post.user.clerk_id}`}>
                <div className="w-8 h-8 rounded-full bg-[var(--instagram-border)] flex items-center justify-center overflow-hidden flex-shrink-0">
                  {post.user.name.charAt(0).toUpperCase()}
                </div>
              </Link>
              <div className="flex-1">
                <p className="text-instagram-sm text-[var(--instagram-text-primary)] whitespace-pre-wrap">
                  <Link
                    href={`/profile/${post.user.clerk_id}`}
                    className="font-instagram-semibold hover:opacity-70"
                  >
                    {post.user.name}
                  </Link>{" "}
                  {post.caption}
                </p>
                <span className="text-instagram-xs text-[var(--instagram-text-secondary)] mt-1 block">
                  {timeAgo}
                </span>
              </div>
            </div>
          </div>

          {/* 액션 버튼 및 좋아요 수 */}
          <div className="p-4 border-b border-[var(--instagram-border)]">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-4">
                <LikeButton
                  postId={post.id}
                  initialLiked={isLiked}
                  initialLikesCount={likesCount}
                  onLikeChange={(liked, newCount) => {
                    setIsLiked(liked);
                    setLikesCount(newCount);
                  }}
                />
                <button
                  className="p-1 transition-transform hover:scale-110"
                  aria-label="댓글"
                >
                  <MessageCircle className="w-6 h-6 text-[var(--instagram-text-primary)]" />
                </button>
                <button
                  className="p-1 transition-transform hover:scale-110"
                  aria-label="공유"
                >
                  <Send className="w-6 h-6 text-[var(--instagram-text-primary)]" />
                </button>
              </div>
              <button
                className="p-1 transition-transform hover:scale-110"
                aria-label="저장"
              >
                <Bookmark className="w-6 h-6 text-[var(--instagram-text-primary)]" />
              </button>
            </div>
            {likesCount > 0 && (
              <div className="mb-2">
                <span className="text-instagram-sm font-instagram-semibold text-[var(--instagram-text-primary)]">
                  좋아요 {likesCount.toLocaleString()}개
                </span>
              </div>
            )}
          </div>

          {/* 댓글 목록 */}
          <CommentList
            postId={post.id}
            showAll={true}
            onDelete={() => {
              // 댓글 삭제 후 목록 자동 업데이트
            }}
          />

          {/* 댓글 작성 폼 */}
          <div className="sticky bottom-0 bg-[var(--instagram-card-background)] border-t border-[var(--instagram-border)]">
            <CommentForm
              postId={post.id}
              onCommentAdded={() => {
                // 댓글 추가 후 목록 자동 업데이트
              }}
            />
          </div>
        </div>

        {/* 삭제 확인 다이얼로그 */}
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>게시물 삭제</AlertDialogTitle>
              <AlertDialogDescription>
                정말 이 게시물을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>취소</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700"
              >
                {isDeleting ? "삭제 중..." : "삭제"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DialogContent>
    </Dialog>
  );
}

