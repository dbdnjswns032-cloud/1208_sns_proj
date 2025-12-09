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
  try {
    const supabase = await createClient();
    
    // Supabase 클라이언트가 제대로 생성되었는지 확인
    if (!supabase) {
      throw new Error("Supabase 클라이언트를 생성할 수 없습니다.");
    }

    // 전체 응답을 로깅
    const response = await supabase
      .from("instruments")
      .select();
    
    const { data: instruments, error, status, statusText } = response;

    // 응답 전체를 로깅
    console.log("Supabase response:", {
      hasData: !!instruments,
      dataLength: instruments?.length,
      hasError: !!error,
      errorType: typeof error,
      errorKeys: error ? Object.keys(error) : [],
      status,
      statusText,
    });

    // 에러가 실제로 존재하는지 확인 (빈 객체가 아닌지)
    const hasRealError = error && (
      error.message ||
      error.details ||
      error.hint ||
      error.code ||
      Object.keys(error).length > 0
    );

    if (error && hasRealError) {
      // 에러 객체를 안전하게 직렬화하여 로깅
      const errorInfo = {
        message: error?.message,
        details: error?.details,
        hint: error?.hint,
        code: error?.code,
        // 에러 객체의 모든 속성 확인
        keys: error ? Object.keys(error) : [],
        stringified: error ? JSON.stringify(error, null, 2) : "null",
        // 에러 객체의 모든 속성 직접 접근
        allProperties: error ? Object.getOwnPropertyNames(error) : [],
      };

      console.error("Error fetching instruments:", errorInfo);
      console.error("Raw error object:", error);
      console.error("Error type:", typeof error);
      console.error("Error constructor:", error?.constructor?.name);

      // 에러 타입에 따른 메시지
      const errorMessage = error?.message || error?.toString() || "알 수 없는 오류가 발생했습니다.";
      let errorHint = "💡 instruments 테이블이 생성되었는지 확인하세요.";

      const errorCode = error?.code;
      const errorMessageStr = String(errorMessage).toLowerCase();

      if (errorCode === "PGRST116" || errorMessageStr.includes("relation") || errorMessageStr.includes("does not exist") || errorMessageStr.includes("존재하지")) {
        errorHint = "💡 Supabase Dashboard에서 instruments 테이블을 생성하거나 마이그레이션을 실행하세요.";
      } else if (errorCode === "42501" || errorMessageStr.includes("permission denied") || errorMessageStr.includes("권한")) {
        errorHint = "💡 RLS 정책을 확인하거나 개발 모드에서는 RLS를 비활성화하세요.";
      }

      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 font-semibold">에러 발생</p>
          <p className="text-red-700 text-sm mt-1">{errorMessage}</p>
          {error?.details && (
            <p className="text-red-600 text-xs mt-1">상세: {error.details}</p>
          )}
          {error?.hint && (
            <p className="text-red-600 text-xs mt-1">힌트: {error.hint}</p>
          )}
          {error?.code && (
            <p className="text-red-600 text-xs mt-1">에러 코드: {error.code}</p>
          )}
          <p className="text-red-600 text-xs mt-2">{errorHint}</p>
          <details className="mt-2">
            <summary className="text-red-600 text-xs cursor-pointer">에러 상세 정보 (개발자용)</summary>
            <pre className="text-xs mt-1 p-2 bg-red-100 rounded overflow-auto max-h-40">
              {JSON.stringify(errorInfo, null, 2)}
            </pre>
          </details>
        </div>
      );
    }

    // 에러가 빈 객체인 경우 (실제 에러가 아닐 수 있음)
    if (error && !hasRealError) {
      console.warn("에러 객체가 빈 객체입니다. 실제 에러가 아닐 수 있습니다.", {
        error,
        data: instruments,
        status,
        statusText,
      });
      
      // 데이터가 있으면 정상적으로 처리
      if (instruments) {
        // 정상 처리로 넘어감
      } else {
        // 데이터도 없고 에러도 빈 객체인 경우
        return (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-yellow-800 font-semibold">경고</p>
            <p className="text-yellow-700 text-sm mt-1">
              instruments 테이블에서 데이터를 가져올 수 없습니다.
            </p>
            <p className="text-yellow-600 text-xs mt-2">
              💡 Supabase Dashboard에서 instruments 테이블이 존재하는지 확인하세요.
            </p>
            <details className="mt-2">
              <summary className="text-yellow-600 text-xs cursor-pointer">응답 상세 정보 (개발자용)</summary>
              <pre className="text-xs mt-1 p-2 bg-yellow-100 rounded overflow-auto max-h-40">
                {JSON.stringify({ status, statusText, hasData: !!instruments, error }, null, 2)}
              </pre>
            </details>
          </div>
        );
      }
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
  } catch (err) {
    // 예상치 못한 에러 처리
    const error = err instanceof Error ? err : new Error(String(err));
    console.error("Unexpected error in InstrumentsData:", {
      message: error.message,
      stack: error.stack,
      error: err,
    });

    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-800 font-semibold">예상치 못한 오류 발생</p>
        <p className="text-red-700 text-sm mt-1">{error.message || "알 수 없는 오류가 발생했습니다."}</p>
        <p className="text-red-600 text-xs mt-2">
          💡 브라우저 콘솔을 확인하거나 페이지를 새로고침해보세요.
        </p>
      </div>
    );
  }
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

