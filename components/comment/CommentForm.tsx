/**
 * @file components/comment/CommentForm.tsx
 * @description 댓글 작성 폼 컴포넌트
 *
 * 기능:
 * - 댓글 입력 필드 ("댓글 달기...")
 * - Enter 키 또는 "게시" 버튼으로 제출
 * - 로딩 상태 표시
 */

"use client";

import { useState, FormEvent, useCallback } from "react";
import Link from "next/link";
import { Send } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toastError } from "@/lib/toast";
import { fetchWithTimeout, extractErrorMessage, getErrorMessage } from "@/lib/api-error-handler";

interface CommentFormProps {
  postId: string;
  onCommentAdded?: () => void; // 댓글 추가 후 콜백
  placeholder?: string;
}

export function CommentForm({
  postId,
  onCommentAdded,
  placeholder = "댓글 달기...",
}: CommentFormProps) {
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { user } = useUser();

  const handleSubmit = useCallback(async (e: FormEvent) => {
    e.preventDefault();

    if (!user) {
      toastError("로그인이 필요합니다.");
      return;
    }

    if (!content.trim()) {
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetchWithTimeout(
        "/api/comments",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            postId,
            content: content.trim(),
          }),
        },
        10000 // 10초 타임아웃
      );

      if (!response.ok) {
        const errorMessage = await extractErrorMessage(response);
        throw new Error(errorMessage);
      }

      // 성공 시 입력 필드 초기화
      setContent("");
      onCommentAdded?.();
    } catch (error) {
      console.error("Error submitting comment:", error);
      const errorMessage = getErrorMessage(error, "댓글 작성에 실패했습니다.");
      toastError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  }, [user, content, postId, onCommentAdded]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit(e);
      }
    },
    [handleSubmit]
  );

  if (!user) {
    return (
      <div className="px-4 py-3 border-t border-[var(--instagram-border)]">
        <Link
          href="/sign-in"
          className="text-instagram-sm text-[var(--instagram-blue)]"
        >
          로그인하여 댓글을 남겨보세요
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="px-4 py-3 border-t border-[var(--instagram-border)] flex items-center gap-2"
    >
      <Input
        type="text"
        placeholder={placeholder}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={submitting}
        className="flex-1 border-0 focus-visible:ring-0 text-instagram-sm bg-transparent"
        style={{
          fontFamily: "inherit",
        }}
      />
      <Button
        type="submit"
        disabled={!content.trim() || submitting}
        className="p-0 h-auto bg-transparent hover:bg-transparent text-[var(--instagram-blue)] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? (
          <span className="text-instagram-sm">게시 중...</span>
        ) : (
          <span className="text-instagram-sm font-instagram-semibold">게시</span>
        )}
      </Button>
    </form>
  );
}

