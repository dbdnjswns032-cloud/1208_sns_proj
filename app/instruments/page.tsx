/**
 * @file app/instruments/page.tsx
 * @description Supabase 공식 문서 예제 페이지
 *
 * 이 페이지는 Supabase 공식 문서의 Next.js Quickstart 예제를 기반으로 합니다.
 * 문서: https://supabase.com/docs/guides/getting-started/quickstarts/nextjs
 *
 * 주요 기능:
 * 1. Supabase에서 instruments 테이블 데이터 조회
 * 2. Server Component에서 직접 데이터 fetching
 * 3. Cookie 기반 세션 관리
 *
 * 핵심 구현 로직:
 * - @supabase/ssr의 createServerClient 사용
 * - Next.js 15의 async cookies() API 사용
 * - Server Component에서 직접 데이터 조회
 *
 * @dependencies
 * - @supabase/ssr: Supabase SSR 클라이언트
 * - lib/supabase/server: Server Component용 Supabase 클라이언트
 */

import { createClient } from "@/lib/supabase/server";
import { Suspense } from "react";

async function InstrumentsData() {
  const supabase = await createClient();
  const { data: instruments, error } = await supabase
    .from("instruments")
    .select();

  if (error) {
    console.error("Error fetching instruments:", error);
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-800 font-semibold">에러 발생</p>
        <p className="text-red-700 text-sm mt-1">{error.message}</p>
        <p className="text-red-600 text-xs mt-2">
          💡 instruments 테이블이 생성되었는지 확인하세요.
        </p>
      </div>
    );
  }

  if (!instruments || instruments.length === 0) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-yellow-800">데이터가 없습니다.</p>
        <p className="text-yellow-700 text-sm mt-1">
          Supabase Dashboard에서 instruments 테이블에 데이터를 추가하세요.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {instruments.map((instrument: { id: number; name: string }) => (
        <div
          key={instrument.id}
          className="p-4 border rounded-lg bg-white hover:bg-gray-50"
        >
          <p className="font-medium">{instrument.name}</p>
        </div>
      ))}
    </div>
  );
}

export default function Instruments() {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Instruments</h1>
        <p className="text-gray-600">
          Supabase 공식 문서 예제: Next.js Quickstart
        </p>
      </div>

      <Suspense fallback={<div>로딩 중...</div>}>
        <InstrumentsData />
      </Suspense>

      {/* 설명 섹션 */}
      <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-bold mb-2">💡 이 예제의 작동 원리</h3>
        <ul className="text-sm text-blue-900 space-y-1 list-disc list-inside">
          <li>
            <strong>Server Component</strong>: 서버에서 데이터를 직접 조회하여
            초기 로딩 속도 향상
          </li>
          <li>
            <strong>@supabase/ssr</strong>: Cookie 기반 세션 관리로 안전한
            인증 처리
          </li>
          <li>
            <strong>Suspense</strong>: React 19의 Suspense로 로딩 상태 처리
          </li>
          <li>
            <strong>createClient()</strong>: lib/supabase/server에서 제공하는
            공식 문서 방식의 클라이언트
          </li>
        </ul>
        <p className="text-xs text-blue-700 mt-3">
          📚{" "}
          <a
            href="https://supabase.com/docs/guides/getting-started/quickstarts/nextjs"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            Supabase 공식 문서
          </a>
          에서 더 자세한 정보를 확인하세요.
        </p>
      </div>
    </div>
  );
}

