/**
 * @file app/(main)/profile/[userId]/page.tsx
 * @description 프로필 페이지
 *
 * 기능:
 * - 동적 라우트: /profile/[userId] (userId는 clerk_id)
 * - 사용자 정보 및 통계 표시
 * - 게시물 그리드 표시
 * - 본인 프로필 여부 확인
 */

import { auth } from "@clerk/nextjs/server";
import { createClerkSupabaseClient } from "@/lib/supabase/server";
import { ProfilePageClient } from "@/components/profile/ProfilePageClient";
import type { UserWithStats, PostWithStatsAndUser } from "@/lib/types";

interface ProfilePageProps {
  params: Promise<{ userId: string }>;
}

async function getUserData(userId: string): Promise<UserWithStats | null> {
  try {
    const supabase = createClerkSupabaseClient();

    // user_stats 뷰에서 사용자 정보 조회 (clerk_id로 검색)
    const { data, error } = await supabase
      .from("user_stats")
      .select("*")
      .eq("clerk_id", userId)
      .single();

    if (error || !data) {
      return null;
    }

    // users 테이블에서 created_at 가져오기
    const { data: userData } = await supabase
      .from("users")
      .select("created_at")
      .eq("id", data.user_id)
      .single();

    // UserWithStats 타입으로 변환
    const user: UserWithStats = {
      id: data.user_id,
      clerk_id: data.clerk_id,
      name: data.name,
      created_at: userData?.created_at || "",
      user_id: data.user_id,
      posts_count: data.posts_count || 0,
      followers_count: data.followers_count || 0,
      following_count: data.following_count || 0,
    };

    return user;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
}

async function getFollowStatus(
  currentUserId: string | null,
  profileUserId: string
): Promise<boolean> {
  // 본인 프로필이거나 로그인하지 않은 경우 false 반환
  if (!currentUserId || currentUserId === profileUserId) {
    return false;
  }

  try {
    const supabase = createClerkSupabaseClient();

    // 현재 사용자의 Supabase User ID 조회
    const { data: currentUserData } = await supabase
      .from("users")
      .select("id")
      .eq("clerk_id", currentUserId)
      .single();

    if (!currentUserData) {
      return false;
    }

    // 프로필 사용자의 Supabase User ID 조회
    const { data: profileUserData } = await supabase
      .from("users")
      .select("id")
      .eq("clerk_id", profileUserId)
      .single();

    if (!profileUserData) {
      return false;
    }

    // 팔로우 관계 확인
    const { data: followData } = await supabase
      .from("follows")
      .select("id")
      .eq("follower_id", currentUserData.id)
      .eq("following_id", profileUserData.id)
      .single();

    return !!followData;
  } catch (error) {
    console.error("Error checking follow status:", error);
    return false;
  }
}

async function getUserPosts(userId: string): Promise<PostWithStatsAndUser[]> {
  try {
    const supabase = createClerkSupabaseClient();

    // user_id를 먼저 조회
    const { data: userData } = await supabase
      .from("users")
      .select("id")
      .eq("clerk_id", userId)
      .single();

    if (!userData) {
      return [];
    }

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
      `
      )
      .eq("user_id", userData.id)
      .order("created_at", { ascending: false });

    if (error) {
      // 상세한 에러 로깅
      console.error("Error fetching user posts:", {
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
      })
    );

    return postsWithStats;
  } catch (error) {
    console.error("Unexpected error:", error);
    return [];
  }
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { userId } = await params;
  const { userId: currentUserId } = await auth();

  // 사용자 정보 조회
  const user = await getUserData(userId);

  if (!user) {
    return (
      <div className="w-full py-12 text-center">
        <p className="text-instagram-base text-[var(--instagram-text-secondary)]">
          사용자를 찾을 수 없습니다.
        </p>
      </div>
    );
  }

  // 게시물 조회
  const posts = await getUserPosts(userId);

  // 본인 프로필 여부 확인
  const isOwnProfile = currentUserId === userId;

  // 팔로우 상태 확인
  const isFollowing = await getFollowStatus(currentUserId, userId);

  return (
    <ProfilePageClient
      user={user}
      isOwnProfile={isOwnProfile}
      initialIsFollowing={isFollowing}
      initialPosts={posts}
    />
  );
}

