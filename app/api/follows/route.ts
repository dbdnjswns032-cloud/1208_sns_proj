/**
 * @file app/api/follows/route.ts
 * @description 팔로우 API 라우트
 *
 * POST: 팔로우 추가
 * DELETE: 팔로우 제거
 * 인증 검증 (Clerk)
 * 자기 자신 팔로우 방지
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClerkSupabaseClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { followingId } = body;

    if (!followingId) {
      return NextResponse.json(
        { error: "followingId is required" },
        { status: 400 }
      );
    }

    // 자기 자신 팔로우 방지
    if (clerkUserId === followingId) {
      return NextResponse.json(
        { error: "You cannot follow yourself" },
        { status: 400 }
      );
    }

    const supabase = createClerkSupabaseClient();

    // 현재 사용자 ID 조회 (clerk_id로 users 테이블에서 찾기)
    const { data: followerData, error: followerError } = await supabase
      .from("users")
      .select("id")
      .eq("clerk_id", clerkUserId)
      .single();

    if (followerError || !followerData) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // 팔로우할 사용자 ID 조회
    const { data: followingData, error: followingError } = await supabase
      .from("users")
      .select("id")
      .eq("clerk_id", followingId)
      .single();

    if (followingError || !followingData) {
      return NextResponse.json(
        { error: "User to follow not found" },
        { status: 404 }
      );
    }

    // 팔로우 관계 추가
    const { data, error } = await supabase
      .from("follows")
      .insert({
        follower_id: followerData.id,
        following_id: followingData.id,
      })
      .select()
      .single();

    if (error) {
      // 중복 팔로우 에러 처리 (UNIQUE 제약 조건)
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "Already following this user" },
          { status: 409 }
        );
      }
      console.error("Error adding follow:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, follow: data }, { status: 201 });
  } catch (error) {
    console.error("Unexpected error in POST /api/follows:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const followingId = searchParams.get("followingId");

    if (!followingId) {
      return NextResponse.json(
        { error: "followingId is required" },
        { status: 400 }
      );
    }

    const supabase = createClerkSupabaseClient();

    // 현재 사용자 ID 조회
    const { data: followerData, error: followerError } = await supabase
      .from("users")
      .select("id")
      .eq("clerk_id", clerkUserId)
      .single();

    if (followerError || !followerData) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // 팔로우할 사용자 ID 조회
    const { data: followingData, error: followingError } = await supabase
      .from("users")
      .select("id")
      .eq("clerk_id", followingId)
      .single();

    if (followingError || !followingData) {
      return NextResponse.json(
        { error: "User to unfollow not found" },
        { status: 404 }
      );
    }

    // 팔로우 관계 삭제
    const { error } = await supabase
      .from("follows")
      .delete()
      .eq("follower_id", followerData.id)
      .eq("following_id", followingData.id);

    if (error) {
      console.error("Error removing follow:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Unexpected error in DELETE /api/follows:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

