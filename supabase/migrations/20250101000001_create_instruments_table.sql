-- Instruments 테이블 생성
-- Supabase 공식 문서 Next.js Quickstart 예제용 테이블
-- 문서: https://supabase.com/docs/guides/getting-started/quickstarts/nextjs

-- instruments 테이블 생성
CREATE TABLE IF NOT EXISTS public.instruments (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name TEXT NOT NULL
);

-- 테이블 소유자 설정
ALTER TABLE public.instruments OWNER TO postgres;

-- Row Level Security (RLS) 비활성화
-- 개발 단계에서는 RLS를 끄고, 프로덕션에서는 활성화하는 것을 권장합니다
ALTER TABLE public.instruments DISABLE ROW LEVEL SECURITY;

-- 권한 부여
GRANT ALL ON TABLE public.instruments TO anon;
GRANT ALL ON TABLE public.instruments TO authenticated;
GRANT ALL ON TABLE public.instruments TO service_role;

-- 샘플 데이터 삽입
INSERT INTO public.instruments (name)
VALUES
    ('violin'),
    ('viola'),
    ('cello')
ON CONFLICT DO NOTHING;

-- 인덱스 추가 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_instruments_name ON public.instruments(name);

-- 주석 추가
COMMENT ON TABLE public.instruments IS 'Supabase 공식 문서 Next.js Quickstart 예제용 테이블';
COMMENT ON COLUMN public.instruments.name IS '악기 이름';

-- 프로덕션 환경을 위한 RLS 정책 예제 (주석 처리)
-- 공개 읽기 전용 테이블의 경우:
-- 
-- ALTER TABLE public.instruments ENABLE ROW LEVEL SECURITY;
-- 
-- CREATE POLICY "public can read instruments"
-- ON public.instruments
-- FOR SELECT
-- TO anon
-- USING (true);

