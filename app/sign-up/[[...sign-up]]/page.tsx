/**
 * @file app/sign-up/[[...sign-up]]/page.tsx
 * @description Clerk 회원가입 페이지
 *
 * Clerk의 SignUp 컴포넌트를 사용한 커스텀 회원가입 페이지입니다.
 * 한국어 로컬라이제이션이 자동으로 적용됩니다 (app/layout.tsx에서 설정).
 *
 * @see https://clerk.com/docs/guides/customizing-clerk/localization
 */

import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <SignUp
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "shadow-lg",
            formButtonPrimary: "bg-blue-500 hover:bg-blue-600",
            footerActionLink: "text-blue-500 hover:text-blue-600",
          },
        }}
        routing="path"
        path="/sign-up"
        redirectUrl="/"
        signInUrl="/sign-in"
      />
    </div>
  );
}

