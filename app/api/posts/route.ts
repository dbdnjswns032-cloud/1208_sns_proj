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
        `
        )
        .eq("id", postId)
        .single();

      if (error) {
        console.error("Error fetching post:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      if (!data) {
        return NextResponse.json(
          { error: "Post not found" },
          { status: 404 }
        );
      }

      // 좋아요 수와 댓글 수 조회
      const { count: likesCount } = await supabase
        .from("likes")
        .select("*", { count: "exact", head: true })
        .eq("post_id", data.id);

      const { count: commentsCount } = await supabase
        .from("comments")
        .select("*", { count: "exact", head: true })
        .eq("post_id", data.id);

      const post: PostWithStatsAndUser = {
        id: data.id,
        user_id: data.user_id,
        image_url: data.image_url,
        caption: data.caption,
        created_at: data.created_at,
        updated_at: data.updated_at,
        post_id: data.id,
        likes_count: likesCount || 0,
        comments_count: commentsCount || 0,
        user: {
          id: data.users.id,
          clerk_id: data.users.clerk_id,
          name: data.users.name,
          created_at: data.users.created_at,
        },
      };

      return NextResponse.json({ post });
    }

    // 쿼리 파라미터 파싱
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const offset = parseInt(searchParams.get("offset") || "0", 10);
    const userId = searchParams.get("userId"); // 프로필 페이지용

    // posts 테이블에서 직접 가져오기
    let query = supabase
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
      `
      )
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    // userId가 제공된 경우 필터링 (프로필 페이지용)
    if (userId) {
      // userId는 clerk_id이므로 먼저 Supabase user_id로 변환
      const { data: userData } = await supabase
        .from("users")
        .select("id")
        .eq("clerk_id", userId)
        .single();

      if (userData) {
        query = query.eq("user_id", userData.id);
      }
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching posts:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // 각 게시물에 대해 좋아요 수와 댓글 수를 별도로 조회
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
      })
    );

    return NextResponse.json({ posts: postsWithStats, hasMore: postsWithStats.length === limit });
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const imageFile = formData.get("image") as File | null;
    const caption = formData.get("caption") as string | null;

    if (!imageFile) {
      return NextResponse.json(
        { error: "Image file is required" },
        { status: 400 }
      );
    }

    // 파일 타입 검증
    if (!imageFile.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Only image files are allowed" },
        { status: 400 }
      );
    }

    // 파일 크기 검증 (5MB)
    if (imageFile.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size must be less than 5MB" },
        { status: 400 }
      );
    }

    // 캡션 길이 검증 (2,200자)
    if (caption && caption.length > 2200) {
      return NextResponse.json(
        { error: "Caption must be less than 2,200 characters" },
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
        { error: uploadError.message },
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
        { error: postError.message },
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

