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
import { PostFeed } from "@/components/post/PostFeed";
import type { PostWithStatsAndUser } from "@/lib/types";

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
      console.error("Error fetching initial posts:", {
        message: error?.message,
        details: error?.details,
        hint: error?.hint,
        code: error?.code,
        stringified: JSON.stringify(error, null, 2),
      });
      return [];
    }

    const postsWithStats: PostWithStatsAndUser[] = await Promise.all(
      (data || []).map(async (post: any) => {
        const { count: likesCount } = await supabase
          .from("likes")
          .select("*", { count: "exact", head: true })
          .eq("post_id", post.id);

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
