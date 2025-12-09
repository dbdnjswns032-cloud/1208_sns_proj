/**
 * @file app/sign-in/[[...sign-in]]/page.tsx
 * @description Clerk 로그인 페이지
 *
 * Clerk의 SignIn 컴포넌트를 사용한 커스텀 로그인 페이지입니다.
 * 한국어 로컬라이제이션이 자동으로 적용됩니다 (app/layout.tsx에서 설정).
 *
 * @see https://clerk.com/docs/guides/customizing-clerk/localization
 */

import { SignIn } from "@clerk/nextjs";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect_url?: string }>;
}) {
  // 쿼리 파라미터에서 리다이렉트 URL 가져오기
  const params = await searchParams;
  const redirectUrl = params.redirect_url || "/";

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <SignIn
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "shadow-lg",
          },
        }}
        routing="path"
        path="/sign-in"
        redirectUrl={redirectUrl}
        signUpUrl="/sign-up"
      />
    </div>
  );
}

