/**
 * @file components/layout/Header.tsx
 * @description Mobile 전용 헤더 컴포넌트
 *
 * Mobile (< 768px) 전용 헤더:
 * - 높이: 60px
 * - 로고 + 알림/DM/프로필 아이콘
 * - Instagram 스타일 적용
 */

"use client";

import Link from "next/link";
import { Heart, MessageCircle } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { UserButton } from "@clerk/nextjs";

export function Header() {
  const { isSignedIn } = useUser();

  return (
    <header className="md:hidden fixed top-0 left-0 right-0 h-[60px] bg-[var(--instagram-card-background)] border-b border-[var(--instagram-border)] z-50">
      <div className="flex items-center justify-between h-full px-4">
        {/* 로고 */}
        <Link
          href="/"
          className="text-xl font-instagram-bold text-[var(--instagram-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--instagram-blue)] focus:ring-offset-2 rounded"
          aria-label="홈으로 이동"
        >
          Instagram
        </Link>

        {/* 우측 아이콘들 */}
        <div className="flex items-center gap-4">
          {isSignedIn ? (
            <>
              {/* 알림 (좋아요) */}
              <Link
                href="/activity"
                className="p-2 hover:opacity-70 transition-opacity focus:outline-none focus:ring-2 focus:ring-[var(--instagram-blue)] focus:ring-offset-2 rounded"
                aria-label="활동"
              >
                <Heart
                  className="w-6 h-6 text-[var(--instagram-text-primary)]"
                  strokeWidth={2}
                  aria-hidden="true"
                />
              </Link>

              {/* DM (메시지) */}
              <Link
                href="/direct"
                className="p-2 hover:opacity-70 transition-opacity focus:outline-none focus:ring-2 focus:ring-[var(--instagram-blue)] focus:ring-offset-2 rounded"
                aria-label="메시지"
              >
                <MessageCircle
                  className="w-6 h-6 text-[var(--instagram-text-primary)]"
                  strokeWidth={2}
                  aria-hidden="true"
                />
              </Link>

              {/* 프로필 */}
              <div className="flex items-center">
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "w-7 h-7",
                    },
                  }}
                />
              </div>
            </>
          ) : (
            <Link
              href="/sign-in"
              className="text-instagram-sm font-instagram-semibold text-[var(--instagram-blue)]"
            >
              로그인
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

