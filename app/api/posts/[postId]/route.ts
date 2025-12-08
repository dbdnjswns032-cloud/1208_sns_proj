/**
 * @file app/api/posts/[postId]/route.ts
 * @description 게시물 삭제 API 라우트
 *
 * DELETE: 게시물 삭제
 * - 본인 게시물만 삭제 가능 (인증 검증)
 * - Supabase Storage에서 이미지 삭제
 * - posts 테이블에서 게시물 삭제 (CASCADE로 likes, comments 자동 삭제)
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClerkSupabaseClient } from "@/lib/supabase/server";
import { getServiceRoleClient } from "@/lib/supabase/service-role";

/**
 * Supabase Storage 공개 URL에서 Storage 경로 추출
 * 예: https://[project].supabase.co/storage/v1/object/public/posts/{clerk_id}/{filename}
 * -> {clerk_id}/{filename}
 */
function extractStoragePath(imageUrl: string): string | null {
  try {
    const url = new URL(imageUrl);
    // /storage/v1/object/public/posts/{path} 형식에서 경로 추출
    const match = url.pathname.match(/\/storage\/v1\/object\/public\/posts\/(.+)/);
    if (match && match[1]) {
      return match[1];
    }
    return null;
  } catch (error) {
    console.error("Error extracting storage path:", error);
    return null;
  }
}

interface RouteParams {
  params: Promise<{ postId: string }>;
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { postId } = await params;

    if (!postId) {
      return NextResponse.json(
        { error: "Post ID is required" },
        { status: 400 }
      );
    }

    const supabase = createClerkSupabaseClient();
    const serviceRoleSupabase = getServiceRoleClient();

    // 현재 사용자 ID 조회
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("clerk_id", clerkUserId)
      .single();

    if (userError || !userData) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // 게시물 조회 및 소유자 확인
    const { data: postData, error: postError } = await supabase
      .from("posts")
      .select("id, user_id, image_url")
      .eq("id", postId)
      .single();

    if (postError || !postData) {
      return NextResponse.json(
        { error: "Post not found" },
        { status: 404 }
      );
    }

    // 본인 게시물인지 확인
    if (postData.user_id !== userData.id) {
      return NextResponse.json(
        { error: "Forbidden: You can only delete your own posts" },
        { status: 403 }
      );
    }

    // Storage 경로 추출
    const storagePath = extractStoragePath(postData.image_url);
    
    // Supabase Storage에서 이미지 삭제 (Service Role 사용)
    if (storagePath) {
      const { error: storageError } = await serviceRoleSupabase.storage
        .from("posts")
        .remove([storagePath]);

      if (storageError) {
        // Storage 삭제 실패는 경고만 표시하고 DB 삭제는 진행
        console.warn("Failed to delete image from storage:", storageError);
        // 계속 진행 (DB 삭제는 수행)
      }
    } else {
      console.warn("Could not extract storage path from image URL:", postData.image_url);
      // 경로 추출 실패해도 DB 삭제는 진행
    }

    // posts 테이블에서 게시물 삭제 (CASCADE로 likes, comments도 자동 삭제)
    const { error: deleteError } = await supabase
      .from("posts")
      .delete()
      .eq("id", postId);

    if (deleteError) {
      console.error("Error deleting post:", deleteError);
      return NextResponse.json(
        { error: deleteError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Unexpected error in DELETE /api/posts/[postId]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

