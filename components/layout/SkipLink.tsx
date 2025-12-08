/**
 * @file components/layout/SkipLink.tsx
 * @description 스킵 링크 컴포넌트
 *
 * 접근성을 위한 스킵 링크:
 * - 키보드 사용자가 메인 콘텐츠로 바로 이동 가능
 * - Tab 키로 첫 번째 포커스 가능한 요소
 * - 화면에는 숨겨져 있지만 스크린 리더와 키보드로 접근 가능
 */

"use client";

import Link from "next/link";

export function SkipLink() {
  return (
    <Link
      href="#main-content"
      className="absolute left-[-9999px] focus:left-4 focus:top-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-[var(--instagram-blue)] focus:text-white focus:rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:font-instagram-semibold"
    >
      메인 콘텐츠로 건너뛰기
    </Link>
  );
}

