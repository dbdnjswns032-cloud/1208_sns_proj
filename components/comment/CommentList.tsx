/**
 * @file components/comment/CommentList.tsx
 * @description 댓글 목록 컴포넌트
 *
 * 기능:
 * - 댓글 목록 렌더링
 * - PostCard: 최신 2개만 표시
 * - 상세 모달: 전체 댓글 + 스크롤
 * - 삭제 버튼 (본인만 표시)
 */

"use client";

import { useState, useEffect, memo, useCallback, useMemo } from "react";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { useUser } from "@clerk/nextjs";
import { useClerkSupabaseClient } from "@/lib/supabase/clerk-client";
import type { CommentWithUser } from "@/lib/types";
import { cn } from "@/lib/utils";
import { CommentListSkeleton } from "./CommentListSkeleton";
import { toastError } from "@/lib/toast";
import { fetchWithTimeout, extractErrorMessage, getErrorMessage } from "@/lib/api-error-handler";

interface CommentListProps {
  postId: string;
  limit?: number; // PostCard에서는 2개, 상세 모달에서는 전체
  showAll?: boolean; // 전체 댓글 표시 여부
  onDelete?: () => void; // 삭제 후 콜백
}

function CommentListComponent({
  postId,
  limit = 2,
  showAll = false,
  onDelete,
}: CommentListProps) {
  const [comments, setComments] = useState<CommentWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const supabase = useClerkSupabaseClient();

  useEffect(() => {
    async function fetchComments() {
      try {
        setLoading(true);

        // 댓글 목록 가져오기
        const { data, error } = await supabase
          .from("comments")
          .select(
            `
            id,
            post_id,
            user_id,
            content,
            created_at,
            updated_at,
            users!comments_user_id_fkey (
              id,
              clerk_id,
              name,
              created_at
            )
          `
          )
          .eq("post_id", postId)
          .order("created_at", { ascending: true });

        if (error) {
          console.error("Error fetching comments:", error);
          return;
        }

        // 데이터 변환: CommentWithUser 타입으로 변환
        const commentsData: CommentWithUser[] = (data || []).map(
          (item: any) => ({
            id: item.id,
            post_id: item.post_id,
            user_id: item.user_id,
            content: item.content,
            created_at: item.created_at,
            updated_at: item.updated_at,
            user: {
              id: item.users.id,
              clerk_id: item.users.clerk_id,
              name: item.users.name,
              created_at: item.users.created_at,
            },
          })
        );

        setComments(commentsData);
      } catch (error) {
        console.error("Unexpected error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchComments();
  }, [postId, supabase]);

  const handleDelete = useCallback(async (commentId: string) => {
    if (!user) return;

    if (!confirm("댓글을 삭제하시겠습니까?")) {
      return;
    }

    try {
      const response = await fetchWithTimeout(
        `/api/comments?commentId=${commentId}`,
        {
          method: "DELETE",
        },
        10000 // 10초 타임아웃
      );

      if (!response.ok) {
        const errorMessage = await extractErrorMessage(response);
        throw new Error(errorMessage);
      }

      // 댓글 목록에서 제거
      setComments((prev) => prev.filter((c) => c.id !== commentId));
      onDelete?.();
    } catch (error) {
      console.error("Error deleting comment:", error);
      const errorMessage = getErrorMessage(error, "댓글 삭제에 실패했습니다.");
      toastError(errorMessage);
    }
  }, [user, onDelete]);

  if (loading) {
    return (
      <div className="px-4 pb-4">
        <CommentListSkeleton count={limit} />
      </div>
    );
  }

  if (comments.length === 0) {
    return null;
  }

  // 표시할 댓글 (limit 적용, 메모이제이션)
  const displayComments = useMemo(
    () => (showAll ? comments : comments.slice(-limit)),
    [comments, showAll, limit]
  );

  return (
    <div
      className={cn(
        "px-4 pb-4",
        showAll && "max-h-[400px] overflow-y-auto"
      )}
    >
      {!showAll && comments.length > limit && (
        <Link
          href={`/post/${postId}`}
          className="text-instagram-xs text-[var(--instagram-text-secondary)] hover:opacity-70 mb-2 block"
        >
          댓글 {comments.length.toLocaleString()}개 모두 보기
        </Link>
      )}

      <div className="space-y-1">
        {displayComments.map((comment) => {
          const timeAgo = formatDistanceToNow(new Date(comment.created_at), {
            addSuffix: true,
            locale: ko,
          });

          const isOwner = user?.id === comment.user.clerk_id;

          return (
            <div key={comment.id} className="flex items-start gap-2 group">
              <div className="flex-1">
                <p className="text-instagram-sm text-[var(--instagram-text-primary)]">
                  <Link
                    href={`/profile/${comment.user.clerk_id}`}
                    className="font-instagram-semibold hover:opacity-70"
                  >
                    {comment.user.name}
                  </Link>{" "}
                  {comment.content}
                </p>
                <span className="text-instagram-xs text-[var(--instagram-text-secondary)]">
                  {timeAgo}
                </span>
              </div>

              {/* 삭제 버튼 (본인만 표시) */}
              {isOwner && (
                <button
                  onClick={() => handleDelete(comment.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:opacity-70"
                  aria-label="댓글 삭제"
                >
                  <Trash2 className="w-4 h-4 text-[var(--instagram-text-secondary)]" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// React.memo로 메모이제이션
export const CommentList = memo(CommentListComponent);

