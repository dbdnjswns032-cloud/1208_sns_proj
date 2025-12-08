import { MetadataRoute } from "next";

/**
 * @file app/manifest.ts
 * @description PWA 매니페스트
 *
 * Progressive Web App 설정을 위한 manifest.json을 생성합니다.
 * 모바일에서 홈 화면에 추가할 수 있도록 설정합니다.
 */

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Mini Instagram",
    short_name: "Mini IG",
    description: "Instagram 스타일 SNS 애플리케이션",
    start_url: "/",
    display: "standalone",
    background_color: "#fafafa",
    theme_color: "#0095f6",
    icons: [
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}

