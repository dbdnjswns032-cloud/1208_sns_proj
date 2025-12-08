import Link from "next/link";
import { Home } from "lucide-react";

/**
 * @file app/not-found.tsx
 * @description 404 에러 페이지
 *
 * 사용자가 존재하지 않는 페이지에 접근했을 때 표시되는 페이지입니다.
 */

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--instagram-background)] px-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-instagram-bold text-[var(--instagram-text-primary)] mb-4">
          404
        </h1>
        <h2 className="text-2xl font-instagram-semibold text-[var(--instagram-text-primary)] mb-2">
          페이지를 찾을 수 없습니다
        </h2>
        <p className="text-instagram-base text-[var(--instagram-text-secondary)] mb-8">
          요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--instagram-blue)] text-white rounded-lg font-instagram-semibold hover:opacity-90 transition-opacity"
        >
          <Home className="w-5 h-5" />
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
}

