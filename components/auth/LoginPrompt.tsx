/**
 * @file components/auth/LoginPrompt.tsx
 * @description 비로그인 사용자용 로그인 유도 컴포넌트
 *
 * 비로그인 사용자에게 로그인을 유도하는 UI 컴포넌트입니다.
 * Instagram 스타일 디자인을 따릅니다.
 */

"use client";

import Link from "next/link";
import { LogIn, UserPlus } from "lucide-react";
import { SignedOut } from "@clerk/nextjs";

interface LoginPromptProps {
  message?: string;
  showSignUp?: boolean;
  className?: string;
}

export function LoginPrompt({
  message = "로그인하여 더 많은 기능을 이용하세요",
  showSignUp = true,
  className = "",
}: LoginPromptProps) {
  return (
    <SignedOut>
      <div
        className={`flex flex-col items-center justify-center p-8 bg-[var(--instagram-card-background)] border border-[var(--instagram-border)] rounded-lg ${className}`}
      >
        <div className="flex flex-col items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-[var(--instagram-background)] flex items-center justify-center">
            <LogIn className="w-8 h-8 text-[var(--instagram-text-secondary)]" />
          </div>
          <p className="text-instagram-base text-[var(--instagram-text-primary)] text-center">
            {message}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
          <Link
            href="/sign-in"
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[var(--instagram-blue)] text-white font-instagram-semibold text-instagram-sm hover:bg-[var(--instagram-blue)]/90 transition-colors"
          >
            <LogIn className="w-4 h-4" />
            로그인
          </Link>
          {showSignUp && (
            <Link
              href="/sign-up"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[var(--instagram-card-background)] border border-[var(--instagram-border)] text-[var(--instagram-text-primary)] font-instagram-semibold text-instagram-sm hover:bg-[var(--instagram-background)] transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              회원가입
            </Link>
          )}
        </div>
      </div>
    </SignedOut>
  );
}

