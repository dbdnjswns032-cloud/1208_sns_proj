import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { koKR } from "@clerk/localizations";
import { Geist, Geist_Mono } from "next/font/google";

import { Toaster } from "sonner";
import { SyncUserProvider } from "@/components/providers/sync-user-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SaaS 템플릿",
  description: "Next.js + Clerk + Supabase 보일러플레이트",
};

/**
 * Clerk 한국어 로컬라이제이션 설정
 *
 * @clerk/localizations 패키지의 koKR을 사용하여 모든 Clerk 컴포넌트를 한국어로 표시합니다.
 * 커스텀 에러 메시지도 추가할 수 있습니다.
 *
 * @see https://clerk.com/docs/guides/customizing-clerk/localization
 */
const koreanLocalization = {
  ...koKR,
  // 커스텀 에러 메시지 (선택사항)
  unstable__errors: {
    ...koKR.unstable__errors,
    // 허용되지 않은 이메일 도메인 접근 시 메시지
    not_allowed_access:
      "접근이 허용되지 않은 이메일 도메인입니다. 접근을 원하시면 관리자에게 문의해주세요.",
    // 기타 커스텀 에러 메시지 추가 가능
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      localization={koreanLocalization}
      appearance={{
        // Tailwind CSS 4 호환성을 위한 설정
        cssLayerName: "clerk",
      }}
    >
      <html lang="ko">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <SyncUserProvider>
            {children}
            <Toaster position="top-center" richColors />
          </SyncUserProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
