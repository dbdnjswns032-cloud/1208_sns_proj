/**
 * @file app/(main)/layout.tsx
 * @description 메인 레이아웃 컴포넌트
 *
 * Instagram 스타일 레이아웃:
 * - Desktop: Sidebar (244px) + Main Content
 * - Tablet: Sidebar (72px) + Main Content
 * - Mobile: Header + Main Content + BottomNav
 *
 * 배경색: #FAFAFA (Instagram 배경색)
 */

import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-[var(--instagram-background)]">
      {/* Sidebar: Desktop/Tablet 전용 */}
      <Sidebar />

      {/* Header: Mobile 전용 */}
      <Header />

      {/* Main Content */}
      <main
        className={`
          /* Desktop: Sidebar 너비만큼 왼쪽 여백 */
          lg:ml-[244px]
          /* Tablet: Sidebar 너비만큼 왼쪽 여백 */
          md:ml-[72px]
          /* Mobile: Header 높이만큼 상단 여백 */
          mt-[60px]
          /* Mobile: BottomNav 높이만큼 하단 여백 */
          mb-[50px]
          md:mb-0
          /* 최대 너비 및 중앙 정렬 */
          max-w-[630px] mx-auto
          /* 패딩 */
          px-4 py-6
        `}
      >
        {children}
      </main>

      {/* BottomNav: Mobile 전용 */}
      <BottomNav />
    </div>
  );
}

