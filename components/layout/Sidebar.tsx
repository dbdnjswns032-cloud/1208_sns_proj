/**
 * @file components/layout/Sidebar.tsx
 * @description Instagram 스타일 사이드바 컴포넌트
 *
 * 반응형 레이아웃:
 * - Desktop (1024px+): 244px 너비, 아이콘 + 텍스트
 * - Tablet (768px ~ 1023px): 72px 너비, 아이콘만
 * - Mobile (< 768px): 숨김
 *
 * 메뉴 항목: 홈, 검색, 만들기, 프로필
 * Hover 효과 및 Active 상태 스타일 포함
 */

"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, PlusSquare, User } from "lucide-react";
import { useUser, SignedOut } from "@clerk/nextjs";
import { cn } from "@/lib/utils";

// CreatePostModal을 동적 import로 lazy loading
const CreatePostModal = dynamic(
  () => import("@/components/post/CreatePostModal").then((mod) => ({ default: mod.CreatePostModal })),
  {
    ssr: false,
    loading: () => null, // 모달이 열릴 때만 로드되므로 로딩 상태 불필요
  }
);

interface NavItem {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  requiresAuth?: boolean;
}

const navItems: NavItem[] = [
  { href: "/", icon: Home, label: "홈" },
  { href: "/search", icon: Search, label: "검색" },
  { href: "/create", icon: PlusSquare, label: "만들기", requiresAuth: true },
  { href: "#", icon: User, label: "프로필", requiresAuth: true }, // href는 동적으로 설정
];

export function Sidebar() {
  const pathname = usePathname();
  const { isSignedIn, user } = useUser();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <aside className="fixed left-0 top-0 h-screen bg-[var(--instagram-card-background)] border-r border-[var(--instagram-border)] z-40 hidden md:block">
      {/* Desktop: 244px 너비, 아이콘 + 텍스트 */}
      <div className="hidden lg:block w-[244px] h-full">
        <div className="flex flex-col p-4 pt-6 gap-1">
          {/* 로고 영역 (선택사항) */}
          <div className="mb-8 px-2">
            <Link href="/" className="text-2xl font-instagram-bold text-[var(--instagram-text-primary)]">
              Instagram
            </Link>
          </div>

          {/* 메뉴 항목 */}
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
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
                      "flex items-center gap-4 px-3 py-3 rounded-lg transition-colors w-full text-left",
                      "hover:bg-[var(--instagram-background)]",
                      "font-instagram-normal text-[var(--instagram-text-primary)]"
                    )}
                  >
                    <Icon className="w-6 h-6 transition-transform group-hover:scale-105" />
                    <span className="text-instagram-base">{item.label}</span>
                  </button>
                );
              }

              // "프로필" 버튼은 본인 프로필로 리다이렉트
              if (item.href === "#" && item.label === "프로필") {
                const profileHref = user ? `/profile/${user.id}` : "/sign-in";
                const isActive = pathname.startsWith("/profile/");
                return (
                  <Link
                    key={item.href}
                    href={profileHref}
                    className={cn(
                      "flex items-center gap-4 px-3 py-3 rounded-lg transition-colors",
                      "hover:bg-[var(--instagram-background)]",
                      isActive
                        ? "font-instagram-semibold text-[var(--instagram-text-primary)]"
                        : "font-instagram-normal text-[var(--instagram-text-primary)]"
                    )}
                  >
                    <Icon
                      className={cn(
                        "w-6 h-6 transition-transform",
                        isActive ? "scale-110" : "group-hover:scale-105"
                      )}
                    />
                    <span className="text-instagram-base">{item.label}</span>
                  </Link>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-4 px-3 py-3 rounded-lg transition-colors",
                    "hover:bg-[var(--instagram-background)]",
                    isActive
                      ? "font-instagram-semibold text-[var(--instagram-text-primary)]"
                      : "font-instagram-normal text-[var(--instagram-text-primary)]"
                  )}
                >
                  <Icon
                    className={cn(
                      "w-6 h-6 transition-transform",
                      isActive ? "scale-110" : "group-hover:scale-105"
                    )}
                  />
                  <span className="text-instagram-base">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* 비로그인 사용자용 로그인 버튼 */}
          <SignedOut>
            <div className="mt-auto mb-4">
              <Link
                href="/sign-in"
                className={cn(
                  "flex items-center gap-4 px-3 py-3 rounded-lg transition-colors w-full",
                  "bg-[var(--instagram-blue)] text-white",
                  "hover:bg-[var(--instagram-blue)]/90",
                  "font-instagram-semibold text-instagram-base"
                )}
              >
                <span>로그인</span>
              </Link>
            </div>
          </SignedOut>
        </div>
      </div>

      {/* Tablet: 72px 너비, 아이콘만 */}
      <div className="lg:hidden w-[72px] h-full">
        <div className="flex flex-col items-center p-2 pt-6 gap-1">
          {/* 메뉴 항목 */}
          <nav className="flex flex-col items-center gap-1 w-full">
            {navItems.map((item) => {
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
                      "flex items-center justify-center w-12 h-12 rounded-lg transition-colors",
                      "hover:bg-[var(--instagram-background)]"
                    )}
                    title={item.label}
                  >
                    <Icon className="w-6 h-6 transition-transform group-hover:scale-105" />
                  </button>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center justify-center w-12 h-12 rounded-lg transition-colors",
                    "hover:bg-[var(--instagram-background)]",
                    isActive && "bg-[var(--instagram-background)]"
                  )}
                  title={item.label}
                >
                  <Icon
                    className={cn(
                      "w-6 h-6 transition-transform",
                      isActive ? "scale-110" : "group-hover:scale-105"
                    )}
                  />
                </Link>
              );
            })}
          </nav>

          {/* 비로그인 사용자용 로그인 버튼 (Tablet) */}
          <SignedOut>
            <div className="mt-auto mb-4">
              <Link
                href="/sign-in"
                className={cn(
                  "flex items-center justify-center w-12 h-12 rounded-lg transition-colors",
                  "bg-[var(--instagram-blue)] text-white",
                  "hover:bg-[var(--instagram-blue)]/90"
                )}
                title="로그인"
                aria-label="로그인"
              >
                <User className="w-6 h-6" />
              </Link>
            </div>
          </SignedOut>
        </div>
      </div>

      {/* 게시물 작성 모달 */}
      <CreatePostModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
      />
    </aside>
  );
}

