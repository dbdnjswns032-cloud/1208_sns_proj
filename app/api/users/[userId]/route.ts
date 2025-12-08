/**
 * @file app/api/users/[userId]/route.ts
 * @description 사용자 정보 API 라우트
 *
 * GET: 사용자 정보 조회
 * - userId 파라미터는 clerk_id를 사용
 * - user_stats 뷰를 활용하여 통계 정보 포함
 * - UserWithStats 타입 반환
 */

import { NextRequest, NextResponse } from "next/server";
import { createClerkSupabaseClient } from "@/lib/supabase/server";
import type { UserWithStats } from "@/lib/types";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const supabase = createClerkSupabaseClient();

    // user_stats 뷰에서 사용자 정보 조회 (clerk_id로 검색)
    const { data, error } = await supabase
      .from("user_stats")
      .select("*")
      .eq("clerk_id", userId)
      .single();

    if (error) {
      console.error("Error fetching user:", error);
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "사용자를 찾을 수 없습니다." },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { error: "사용자 정보를 불러오는 중 오류가 발생했습니다." },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "사용자를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    // UserWithStats 타입으로 변환
    const user: UserWithStats = {
      id: data.user_id,
      clerk_id: data.clerk_id,
      name: data.name,
      created_at: "", // user_stats에는 created_at이 없으므로 빈 문자열
      user_id: data.user_id,
      posts_count: data.posts_count || 0,
      followers_count: data.followers_count || 0,
      following_count: data.following_count || 0,
    };

    // users 테이블에서 created_at 가져오기
    const { data: userData } = await supabase
      .from("users")
      .select("created_at")
      .eq("id", data.user_id)
      .single();

    if (userData) {
      user.created_at = userData.created_at;
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요." },
      { status: 500 }
    );
  }
}

