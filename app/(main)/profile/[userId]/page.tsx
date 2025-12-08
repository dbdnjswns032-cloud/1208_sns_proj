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
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { PostGrid } from "@/components/profile/PostGrid";
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

    // 해당 사용자의 게시물 조회
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
      .eq("user_id", userData.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching user posts:", error);
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
    <div className="w-full">
      <ProfileHeader
        user={user}
        isOwnProfile={isOwnProfile}
        initialIsFollowing={isFollowing}
      />
      <div className="mt-8">
        <PostGrid posts={posts} />
      </div>
    </div>
  );
}

