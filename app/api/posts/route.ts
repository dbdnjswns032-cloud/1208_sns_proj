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
 *
 * POST: 게시물 생성
 * - 이미지 파일 검증 (최대 5MB, 이미지 파일만)
 * - Supabase Storage 업로드 (posts 버킷)
 * - posts 테이블에 데이터 저장
 * - 인증 검증 (Clerk)
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClerkSupabaseClient } from "@/lib/supabase/server";
import { getServiceRoleClient } from "@/lib/supabase/service-role";
import type { PostWithStatsAndUser } from "@/lib/types";

export async function GET(request: NextRequest) {
  try {
    const supabase = createClerkSupabaseClient();
    const searchParams = request.nextUrl.searchParams;

    // 단일 게시물 조회 (postId 파라미터가 있는 경우)
    const postId = searchParams.get("postId");
    if (postId) {
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
        .eq("post_id", postId)
        .single();

      if (error) {
        console.error("Error fetching post:", error);
        return NextResponse.json(
          { error: "게시물을 불러오는 중 오류가 발생했습니다." },
          { status: 500 }
        );
      }

      if (!data) {
        return NextResponse.json(
          { error: "게시물을 찾을 수 없습니다." },
          { status: 404 }
        );
      }

      // users는 관계 쿼리로 인해 배열일 수 있으므로 첫 번째 요소 사용
      const userData = Array.isArray(data.users) ? data.users[0] : data.users;

      const post: PostWithStatsAndUser = {
        id: data.post_id,
        user_id: data.user_id,
        image_url: data.image_url,
        caption: data.caption,
        created_at: data.created_at,
        updated_at: data.created_at,
        post_id: data.post_id,
        likes_count: data.likes_count || 0,
        comments_count: data.comments_count || 0,
        user: {
          id: userData.id,
          clerk_id: userData.clerk_id,
          name: userData.name,
          created_at: userData.created_at,
        },
      };

      return NextResponse.json({ post });
    }

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

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "로그인이 필요합니다." },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const imageFile = formData.get("image") as File | null;
    const caption = formData.get("caption") as string | null;

    if (!imageFile) {
      return NextResponse.json(
        { error: "이미지 파일을 선택해주세요." },
        { status: 400 }
      );
    }

    // 파일 타입 검증
    if (!imageFile.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "이미지 파일만 업로드할 수 있습니다." },
        { status: 400 }
      );
    }

    // 파일 크기 검증 (5MB)
    if (imageFile.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "파일 크기는 5MB를 초과할 수 없습니다." },
        { status: 400 }
      );
    }

    // 캡션 길이 검증 (2,200자)
    if (caption && caption.length > 2200) {
      return NextResponse.json(
        { error: "캡션은 2,200자를 초과할 수 없습니다." },
        { status: 400 }
      );
    }

    const supabase = createClerkSupabaseClient();
    const serviceRoleSupabase = getServiceRoleClient();

    // 사용자 ID 조회 (clerk_id로 users 테이블에서 찾기)
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("clerk_id", userId)
      .single();

    if (userError || !userData) {
      return NextResponse.json(
        { error: "User not found. Please sync your account first." },
        { status: 404 }
      );
    }

    // 파일 확장자 추출
    const fileExt = imageFile.name.split(".").pop() || "jpg";
    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(7)}.${fileExt}`;

    // Storage 경로: {clerk_user_id}/{post_id}/{filename}
    // 먼저 post를 생성한 후 post_id를 사용하여 파일 업로드
    // 임시로 clerk_user_id만 사용
    const tempFilePath = `${userId}/${fileName}`;

    // Supabase Storage에 이미지 업로드 (Service Role 사용)
    const { data: uploadData, error: uploadError } =
      await serviceRoleSupabase.storage
        .from("posts")
        .upload(tempFilePath, imageFile, {
          cacheControl: "3600",
          upsert: false,
        });

    if (uploadError) {
      console.error("Error uploading image:", uploadError);
      return NextResponse.json(
        { error: "이미지 업로드에 실패했습니다. 잠시 후 다시 시도해주세요." },
        { status: 500 }
      );
    }

    // 업로드된 파일의 공개 URL 가져오기
    const {
      data: { publicUrl },
    } = serviceRoleSupabase.storage
      .from("posts")
      .getPublicUrl(uploadData.path);

    // posts 테이블에 데이터 저장
    const { data: postData, error: postError } = await supabase
      .from("posts")
      .insert({
        user_id: userData.id,
        image_url: publicUrl,
        caption: caption || null,
      })
      .select()
      .single();

    if (postError) {
      console.error("Error creating post:", postError);
      // 업로드된 파일 삭제 (롤백)
      await serviceRoleSupabase.storage
        .from("posts")
        .remove([uploadData.path]);

      return NextResponse.json(
        { error: "게시물 저장에 실패했습니다. 잠시 후 다시 시도해주세요." },
        { status: 500 }
      );
    }

    // 파일 경로를 post_id를 포함하도록 업데이트 (선택사항)
    // 현재는 clerk_user_id만 사용하지만, 나중에 {clerk_user_id}/{post_id}/{filename} 형식으로 변경 가능

    return NextResponse.json({
      success: true,
      post: postData,
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

