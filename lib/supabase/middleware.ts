/**
 * @file lib/supabase/middleware.ts
 * @description Supabase Middleware 헬퍼 함수
 *
 * Supabase Auth를 사용하는 경우 (Clerk 대신) Middleware에서 세션 관리를 위한 헬퍼 함수
 * 현재 프로젝트는 Clerk를 사용하므로 참고용으로 제공됩니다.
 *
 * @example
 * ```ts
 * // middleware.ts (Supabase Auth 사용 시)
 * import { createServerClient } from '@supabase/ssr'
 * import { NextResponse, type NextRequest } from 'next/server'
 * import { createSupabaseMiddlewareClient } from '@/lib/supabase/middleware'
 *
 * export async function middleware(request: NextRequest) {
 *   const { supabase, response } = createSupabaseMiddlewareClient(request)
 *
 *   // 세션 자동 갱신
 *   const { data: { session } } = await supabase.auth.getSession()
 *
 *   // 보호된 라우트 체크
 *   if (!session && request.nextUrl.pathname.startsWith('/dashboard')) {
 *     return NextResponse.redirect(new URL('/login', request.url))
 *   }
 *
 *   return response
 * }
 * ```
 *
 * @see https://supabase.com/docs/guides/auth/auth-helpers/nextjs
 */

import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Middleware에서 사용할 Supabase 클라이언트 생성
 *
 * @param request Next.js Request 객체
 * @returns Supabase 클라이언트와 Response 객체
 */
export function createSupabaseMiddlewareClient(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  return { supabase, response };
}

