/**
 * @file components/layout/SkipLink.tsx
 * @description 스킵 링크 컴포넌트 (접근성)
 *
 * 키보드 사용자가 메인 콘텐츠로 바로 이동할 수 있도록 하는 스킵 링크
 * Tab 키를 누르면 첫 번째로 포커스되는 요소
 */

"use client";

import Link from "next/link";

export function SkipLink() {
  return (
    <Link
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
      메인 콘텐츠로 건너뛰기
    </Link>
  );
}

