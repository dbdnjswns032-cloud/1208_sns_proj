-- ============================================
-- Supabase Storage: posts 버킷 생성 및 정책 설정
-- ============================================
-- 마이그레이션 파일: 20251208142146_create_posts_storage_bucket.sql
--
-- 이 마이그레이션은 다음을 생성합니다:
-- 1. posts Storage 버킷 (공개 읽기)
-- 2. 업로드 정책 (인증된 사용자만)
-- 3. 삭제/업데이트 정책 (본인 게시물만)
-- ============================================
-- Note: Clerk 인증을 사용하므로 auth.jwt()->>'sub'로 사용자 확인
-- ============================================

-- ============================================
-- 1. posts 버킷 생성
-- ============================================
-- 버킷이 이미 존재하면 업데이트, 없으면 생성
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'posts',
  'posts',
  true,  -- 공개 읽기 (이미지 URL 직접 접근 가능)
  5242880,  -- 5MB 제한 (5 * 1024 * 1024)
  ARRAY['image/jpeg', 'image/png', 'image/webp']  -- 이미지 파일만 허용
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp'];

-- ============================================
-- 2. RLS 정책 설정
-- ============================================

-- INSERT: 인증된 사용자만 업로드 가능
-- 경로 구조: {user_id}/{post_id}/{filename}
-- auth.jwt()->>'sub'는 Clerk user ID를 반환
CREATE POLICY "Authenticated users can upload posts"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'posts' AND
  (storage.foldername(name))[1] = (SELECT auth.jwt()->>'sub')
);

-- SELECT: 공개 읽기 (버킷이 public이므로 모든 사용자가 읽기 가능)
-- 추가 정책은 필요 없지만, 명시적으로 설정
CREATE POLICY "Anyone can view posts"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'posts');

-- DELETE: 본인 게시물만 삭제 가능
-- 경로의 첫 번째 폴더가 사용자 ID와 일치해야 함
CREATE POLICY "Users can delete own posts"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'posts' AND
  (storage.foldername(name))[1] = (SELECT auth.jwt()->>'sub')
);

-- UPDATE: 본인 게시물만 업데이트 가능
CREATE POLICY "Users can update own posts"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'posts' AND
  (storage.foldername(name))[1] = (SELECT auth.jwt()->>'sub')
)
WITH CHECK (
  bucket_id = 'posts' AND
  (storage.foldername(name))[1] = (SELECT auth.jwt()->>'sub')
);

