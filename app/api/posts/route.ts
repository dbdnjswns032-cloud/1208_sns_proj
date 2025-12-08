/**
 * @file app/api/posts/route.ts
 * @description 게시물 API 라우트
 *
 * GET: 게시물 목록 조회
 * - 시간 역순 정렬
 * - 페이지네이션 지원 (limit, offset)
 * - userId 파라미터 지원 (프로필 페이지용)
 * - post_stats 뷰를 사용하여 좋아요 수, 댓글 수 포함
 * - 작성자 정보 포함
 */

import { NextRequest, NextResponse } from "next/server";
import { createClerkSupabaseClient } from "@/lib/supabase/server";
import type { PostWithStatsAndUser } from "@/lib/types";

export async function GET(request: NextRequest) {
  try {
    const supabase = createClerkSupabaseClient();
    const searchParams = request.nextUrl.searchParams;

    // 쿼리 파라미터 파싱
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const offset = parseInt(searchParams.get("offset") || "0", 10);
    const userId = searchParams.get("userId"); // 프로필 페이지용

    // 기본 쿼리: post_stats 뷰에서 데이터 가져오기
    let query = supabase
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
      .range(offset, offset + limit - 1);

    // userId가 제공된 경우 필터링 (프로필 페이지용)
    if (userId) {
      query = query.eq("user_id", userId);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching posts:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // 데이터 변환: PostWithStatsAndUser 타입으로 변환
    const posts: PostWithStatsAndUser[] = (data || []).map((item: any) => ({
      id: item.post_id,
      user_id: item.user_id,
      image_url: item.image_url,
      caption: item.caption,
      created_at: item.created_at,
      updated_at: item.created_at, // post_stats에는 updated_at이 없으므로 created_at 사용
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

    return NextResponse.json({ posts, hasMore: posts.length === limit });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

