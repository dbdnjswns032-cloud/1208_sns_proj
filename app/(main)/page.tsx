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

    // 초기 10개 게시물 가져오기
    const { data, error } = await supabase
      .from("post_stats")
      .select(
        `
        post_id,
        user_id,
        image_url,
        caption,
        created_at,
        likes_count,
        comments_count,
        users!post_stats_user_id_fkey (
          id,
          clerk_id,
          name,
          created_at
        )
      `
      )
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) {
      console.error("Error fetching initial posts:", error);
      return [];
    }

    // 데이터 변환: PostWithStatsAndUser 타입으로 변환
    const posts: PostWithStatsAndUser[] = (data || []).map((item: any) => ({
      id: item.post_id,
      user_id: item.user_id,
      image_url: item.image_url,
      caption: item.caption,
      created_at: item.created_at,
      updated_at: item.created_at,
      post_id: item.post_id,
      likes_count: item.likes_count || 0,
      comments_count: item.comments_count || 0,
      user: {
        id: item.users.id,
        clerk_id: item.users.clerk_id,
        name: item.users.name,
        created_at: item.users.created_at,
      },
    }));

    return posts;
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

