/**
 * @file components/layout/BottomNav.tsx
 * @description Mobile 전용 하단 네비게이션 컴포넌트
 *
 * Mobile (< 768px) 전용 하단 네비게이션:
 * - 높이: 50px
 * - 5개 아이콘: 홈, 검색, 만들기, 좋아요, 프로필
 * - Instagram 스타일 적용
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, PlusSquare, Heart, User } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { CreatePostModal } from "@/components/post/CreatePostModal";

interface BottomNavItem {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  requiresAuth?: boolean;
}

const bottomNavItems: BottomNavItem[] = [
  { href: "/", icon: Home, label: "홈" },
  { href: "/search", icon: Search, label: "검색" },
  { href: "/create", icon: PlusSquare, label: "만들기", requiresAuth: true },
  { href: "/activity", icon: Heart, label: "좋아요", requiresAuth: true },
  { href: "/profile", icon: User, label: "프로필", requiresAuth: true },
];

export function BottomNav() {
  const pathname = usePathname();
  const { isSignedIn, user } = useUser();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-[50px] bg-[var(--instagram-card-background)] border-t border-[var(--instagram-border)] z-50">
      <div className="flex items-center justify-around h-full px-2">
        {bottomNavItems.map((item) => {
          // 인증이 필요한 항목이고 로그인하지 않은 경우 건너뛰기
          if (item.requiresAuth && !isSignedIn) {
            return null;
          }

          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

          // "만들기" 버튼은 모달 열기
          if (item.href === "/create") {
            return (
              <button
                key={item.href}
                onClick={() => setIsCreateModalOpen(true)}
                className={cn(
                  "flex flex-col items-center justify-center flex-1 h-full transition-colors",
                  "hover:bg-[var(--instagram-background)]",
                  "text-[var(--instagram-text-primary)]"
                )}
                aria-label={item.label}
              >
                <Icon
                  className="w-6 h-6 transition-transform group-hover:scale-105"
                  strokeWidth={2}
                />
              </button>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full transition-colors",
                "hover:bg-[var(--instagram-background)]",
                isActive && "text-[var(--instagram-text-primary)]"
              )}
              aria-label={item.label}
            >
              <Icon
                className={cn(
                  "w-6 h-6 transition-transform",
                  isActive ? "scale-110" : "group-hover:scale-105"
                )}
                strokeWidth={isActive ? 2.5 : 2}
              />
            </Link>
          );
        })}
      </div>

      {/* 게시물 작성 모달 */}
      <CreatePostModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />
    </nav>
  );
}

