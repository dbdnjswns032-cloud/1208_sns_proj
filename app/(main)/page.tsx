/**
 * @file app/(main)/page.tsx
 * @description 홈 피드 페이지
 *
 * Instagram 스타일 홈 피드:
 * - PostFeed 컴포넌트 통합
 * - 배경색 #FAFAFA 설정 (레이아웃에서 처리)
 * - 초기 게시물 로드 (Server Component)
 */

import { createClerkSupabaseClient } from "@/lib/supabase/server";
import dynamic from "next/dynamic";
import type { PostWithStatsAndUser } from "@/lib/types";

// PostFeed를 클라이언트 사이드에서만 로드 (빌드 에러 방지)
const PostFeed = dynamic(
  () => import("@/components/post/PostFeed").then((mod) => ({ default: mod.PostFeed })),
  {
    ssr: false,
    loading: () => (
      <div className="w-full py-12 text-center">
        <p className="text-[var(--instagram-text-secondary)]">로딩 중...</p>
      </div>
    ),
  }
);

async function getInitialPosts(): Promise<PostWithStatsAndUser[]> {
  try {
    const supabase = createClerkSupabaseClient();

    // posts 테이블에서 직접 가져오고 users와 JOIN
    const { data, error } = await supabase
      .from("posts")
      .select(
        `
        id,
        user_id,
        image_url,
        caption,
        created_at,
        updated_at,
        users!posts_user_id_fkey (
          id,
          clerk_id,
          name,
          created_at
        )
      `,
      )
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) {
      // 상세한 에러 로깅
      console.error("Error fetching initial posts:", {
        message: error?.message,
        details: error?.details,
        hint: error?.hint,
        code: error?.code,
        stringified: JSON.stringify(error, null, 2),
      });
      return [];
    }

    // 각 게시물에 대해 좋아요 수와 댓글 수를 별도로 조회
    const postsWithStats: PostWithStatsAndUser[] = await Promise.all(
      (data || []).map(async (post: any) => {
        // 좋아요 수 조회
        const { count: likesCount } = await supabase
          .from("likes")
          .select("*", { count: "exact", head: true })
          .eq("post_id", post.id);

        // 댓글 수 조회
        const { count: commentsCount } = await supabase
          .from("comments")
          .select("*", { count: "exact", head: true })
          .eq("post_id", post.id);

        return {
          id: post.id,
          user_id: post.user_id,
          image_url: post.image_url,
          caption: post.caption,
          created_at: post.created_at,
          updated_at: post.updated_at,
          post_id: post.id,
          likes_count: likesCount || 0,
          comments_count: commentsCount || 0,
          user: {
            id: post.users.id,
            clerk_id: post.users.clerk_id,
            name: post.users.name,
            created_at: post.users.created_at,
          },
        };
      }),
    );

    console.log(`[HomePage] Loaded ${postsWithStats.length} initial posts`);
    return postsWithStats;
  } catch (error) {
    console.error("Unexpected error:", error);
    return [];
  }
}

export default async function HomePage() {
  const initialPosts = await getInitialPosts();

  return (
    <div className="w-full">
      <PostFeed initialPosts={initialPosts} />
    </div>
  );
}
