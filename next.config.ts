import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: "img.clerk.com" },
      { 
        hostname: "*.supabase.co",
        protocol: "https",
      },
    ],
  },
  experimental: {
    // Next.js 15에서 Server Component와 Client Component 간 import 문제 해결
    serverComponentsExternalPackages: [],
  },
};

export default nextConfig;
