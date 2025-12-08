import { MetadataRoute } from "next";

/**
 * @file app/sitemap.ts
 * @description 사이트맵 생성
 *
 * 검색 엔진에 사이트 구조를 알려주는 sitemap.xml을 동적으로 생성합니다.
 * 주요 페이지들을 포함합니다.
 */

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://your-domain.com";

  // 정적 페이지들
  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
  ];

  // 동적 페이지는 필요시 데이터베이스에서 가져와서 추가할 수 있습니다.
  // 예: 프로필 페이지, 게시물 페이지 등

  return routes;
}

