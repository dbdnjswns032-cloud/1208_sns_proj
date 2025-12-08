-- Tasks 테이블 생성
-- Clerk + Supabase 통합 예제를 위한 테이블
-- 문서: https://clerk.com/docs/guides/development/integrations/databases/supabase

-- tasks 테이블 생성
-- user_id 컬럼은 default auth.jwt()->>'sub'로 설정되어
-- Clerk user ID가 자동으로 저장됨
CREATE TABLE IF NOT EXISTS public.tasks (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    user_id TEXT NOT NULL DEFAULT (auth.jwt()->>'sub')
);

-- 테이블 소유자 설정
ALTER TABLE public.tasks OWNER TO postgres;

-- Row Level Security (RLS) 비활성화
-- 개발 단계에서는 RLS를 끄고, 프로덕션에서는 활성화하는 것을 권장합니다
-- 참고: 프로젝트 규칙에 따라 개발 중에는 RLS를 비활성화합니다
ALTER TABLE public.tasks DISABLE ROW LEVEL SECURITY;

-- 권한 부여
GRANT ALL ON TABLE public.tasks TO anon;
GRANT ALL ON TABLE public.tasks TO authenticated;
GRANT ALL ON TABLE public.tasks TO service_role;

-- 인덱스 추가 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON public.tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON public.tasks(id DESC);

-- 주석 추가
COMMENT ON TABLE public.tasks IS 'Clerk + Supabase 통합 예제를 위한 tasks 테이블';
COMMENT ON COLUMN public.tasks.user_id IS 'Clerk user ID (auth.jwt()->>''sub'')';
COMMENT ON COLUMN public.tasks.name IS '작업 이름';

-- 프로덕션 환경을 위한 RLS 정책 예제 (주석 처리)
-- 개발 중에는 RLS가 비활성화되어 있으므로 아래 정책은 참고용입니다
-- 
-- ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
-- 
-- -- 사용자는 자신의 tasks만 조회할 수 있음
-- CREATE POLICY "User can view their own tasks"
-- ON public.tasks
-- FOR SELECT
-- TO authenticated
-- USING (
--     ((SELECT auth.jwt()->>'sub') = (user_id)::text)
-- );
-- 
-- -- 사용자는 자신의 tasks만 생성할 수 있음
-- CREATE POLICY "Users must insert their own tasks"
-- ON public.tasks
-- AS PERMISSIVE
-- FOR INSERT
-- TO authenticated
-- WITH CHECK (
--     ((SELECT auth.jwt()->>'sub') = (user_id)::text)
-- );
-- 
-- -- 사용자는 자신의 tasks만 수정할 수 있음
-- CREATE POLICY "Users can update their own tasks"
-- ON public.tasks
-- FOR UPDATE
-- TO authenticated
-- USING (
--     ((SELECT auth.jwt()->>'sub') = (user_id)::text)
-- )
-- WITH CHECK (
--     ((SELECT auth.jwt()->>'sub') = (user_id)::text)
-- );
-- 
-- -- 사용자는 자신의 tasks만 삭제할 수 있음
-- CREATE POLICY "Users can delete their own tasks"
-- ON public.tasks
-- FOR DELETE
-- TO authenticated
-- USING (
--     ((SELECT auth.jwt()->>'sub') = (user_id)::text)
-- );

