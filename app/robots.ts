import { MetadataRoute } from "next";

/**
 * @file app/robots.ts
 * @description 검색 엔진 크롤러 설정
 *
 * robots.txt 파일을 동적으로 생성합니다.
 * 프로덕션 환경에서는 모든 크롤러를 허용하고,
 * 개발 환경에서는 크롤링을 제한할 수 있습니다.
 */

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://your-domain.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/", // API 라우트는 크롤링 제외
          "/sign-in", // 인증 페이지는 크롤링 제외
          "/sign-up", // 인증 페이지는 크롤링 제외
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

