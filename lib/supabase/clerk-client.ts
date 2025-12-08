"use client";

import { createClient } from "@supabase/supabase-js";
import { useSession } from "@clerk/nextjs";
import { useMemo } from "react";

/**
 * Clerk + Supabase 네이티브 통합 클라이언트 (Client Component용)
 *
 * 2025년 4월부터 권장되는 방식:
 * - JWT 템플릿 불필요
 * - Clerk 세션 토큰을 Supabase에 전달하여 인증
 * - useSession()과 useUser()를 사용하여 Clerk 세션 토큰 가져오기
 * - React Hook으로 제공되어 Client Component에서 사용
 *
 * @example
 * ```tsx
 * 'use client';
 *
 * import { useClerkSupabaseClient } from '@/lib/supabase/clerk-client';
 * import { useUser } from '@clerk/nextjs';
 *
 * export default function MyComponent() {
 *   const { user } = useUser();
 *   const supabase = useClerkSupabaseClient();
 *
 *   useEffect(() => {
 *     if (!user) return;
 *
 *     async function fetchData() {
 *       const { data } = await supabase.from('table').select('*');
 *       return data;
 *     }
 *
 *     fetchData();
 *   }, [user, supabase]);
 *
 *   return <div>...</div>;
 * }
 * ```
 */
export function useClerkSupabaseClient() {
  const { session } = useSession();

  const supabase = useMemo(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    return createClient(supabaseUrl, supabaseKey, {
      async accessToken() {
        // useSession() hook을 사용하여 Clerk 세션 토큰 가져오기
        // 문서의 모범 사례에 따라 session?.getToken() 사용
        return (await session?.getToken()) ?? null;
      },
    });
  }, [session]);

  return supabase;
}
