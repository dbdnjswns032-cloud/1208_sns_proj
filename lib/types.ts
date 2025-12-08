/**
 * @file lib/types.ts
 * @description Instagram Clone SNS 프로젝트의 TypeScript 타입 정의
 *
 * Supabase 데이터베이스 스키마를 기반으로 한 타입 정의입니다.
 * 모든 타입은 supabase/migrations/db.sql의 테이블 구조와 일치합니다.
 *
 * @see supabase/migrations/db.sql
 */

/**
 * 사용자 정보
 * Clerk 인증과 연동되는 사용자 정보를 저장하는 테이블
 */
export interface User {
  id: string; // UUID
  clerk_id: string; // Clerk User ID (Unique)
  name: string;
  created_at: string; // ISO 8601 timestamp
}

/**
 * 게시물
 * 사용자가 업로드한 이미지와 캡션을 저장하는 테이블
 */
export interface Post {
  id: string; // UUID
  user_id: string; // UUID, references users(id)
  image_url: string; // Supabase Storage URL
  caption: string | null; // 최대 2,200자 (애플리케이션에서 검증)
  created_at: string; // ISO 8601 timestamp
  updated_at: string; // ISO 8601 timestamp
}

/**
 * 좋아요
 * 사용자가 게시물에 좋아요를 누른 정보를 저장하는 테이블
 */
export interface Like {
  id: string; // UUID
  post_id: string; // UUID, references posts(id)
  user_id: string; // UUID, references users(id)
  created_at: string; // ISO 8601 timestamp
}

/**
 * 댓글
 * 사용자가 게시물에 작성한 댓글을 저장하는 테이블
 */
export interface Comment {
  id: string; // UUID
  post_id: string; // UUID, references posts(id)
  user_id: string; // UUID, references users(id)
  content: string;
  created_at: string; // ISO 8601 timestamp
  updated_at: string; // ISO 8601 timestamp
}

/**
 * 팔로우
 * 사용자 간 팔로우 관계를 저장하는 테이블
 */
export interface Follow {
  id: string; // UUID
  follower_id: string; // UUID, references users(id) - 팔로우하는 사람
  following_id: string; // UUID, references users(id) - 팔로우받는 사람
  created_at: string; // ISO 8601 timestamp
}

/**
 * 게시물 통계 뷰
 * 게시물의 좋아요 수와 댓글 수를 포함하는 뷰
 * @see supabase/migrations/db.sql - post_stats view
 */
export interface PostStats {
  post_id: string; // UUID
  user_id: string; // UUID
  image_url: string;
  caption: string | null;
  created_at: string; // ISO 8601 timestamp
  likes_count: number; // 좋아요 수
  comments_count: number; // 댓글 수
}

/**
 * 사용자 통계 뷰
 * 사용자의 게시물 수, 팔로워 수, 팔로잉 수를 포함하는 뷰
 * @see supabase/migrations/db.sql - user_stats view
 */
export interface UserStats {
  user_id: string; // UUID
  clerk_id: string;
  name: string;
  posts_count: number; // 게시물 수
  followers_count: number; // 팔로워 수 (나를 팔로우하는 사람들)
  following_count: number; // 팔로잉 수 (내가 팔로우하는 사람들)
}

/**
 * 사용자 정보와 통계를 함께 포함하는 확장 타입
 * 프로필 페이지 등에서 사용
 */
export interface UserWithStats extends User, UserStats {}

/**
 * 게시물과 통계를 함께 포함하는 확장 타입
 * 피드 페이지 등에서 사용
 */
export interface PostWithStats extends Post, PostStats {}

/**
 * 게시물과 작성자 정보를 함께 포함하는 확장 타입
 * PostCard 컴포넌트 등에서 사용
 */
export interface PostWithUser extends Post {
  user: User;
}

/**
 * 게시물, 통계, 작성자 정보를 모두 포함하는 확장 타입
 * 상세 페이지 등에서 사용
 */
export interface PostWithStatsAndUser extends PostWithStats {
  user: User;
}

/**
 * 댓글과 작성자 정보를 함께 포함하는 확장 타입
 * 댓글 목록에서 사용
 */
export interface CommentWithUser extends Comment {
  user: User;
}

