import { createBrowserClient } from "@supabase/ssr";

/**
 * Supabase Browser Client (공식 문서 모범 사례)
 *
 * Client Component에서 사용하는 Supabase 클라이언트
 * - @supabase/ssr의 createBrowserClient 사용
 * - 자동으로 document.cookie 처리
 * - 브라우저 환경에서 세션 관리
 *
 * @example
 * ```tsx
 * 'use client';
 *
 * import { createClient } from '@/lib/supabase/client';
 *
 * export default function MyComponent() {
 *   const supabase = createClient();
 *   const { data } = await supabase.from('table').select('*');
 *   return <div>...</div>;
 * }
 * ```
 *
 * @see https://supabase.com/docs/guides/getting-started/quickstarts/nextjs
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
