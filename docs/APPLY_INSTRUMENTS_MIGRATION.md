# Instruments 테이블 마이그레이션 적용 가이드

## 문제
`instruments` 테이블이 존재하지 않아 `/instruments` 페이지에서 에러가 발생합니다.

## 해결 방법

### 방법 1: Supabase Dashboard에서 직접 실행 (권장)

1. Supabase Dashboard에 로그인
2. SQL Editor로 이동
3. 아래 SQL을 복사하여 실행:

```sql
-- Instruments 테이블 생성
-- Supabase 공식 문서 Next.js Quickstart 예제용 테이블

-- instruments 테이블 생성
CREATE TABLE IF NOT EXISTS public.instruments (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name TEXT NOT NULL
);

-- 테이블 소유자 설정
ALTER TABLE public.instruments OWNER TO postgres;

-- Row Level Security (RLS) 비활성화
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
```

### 방법 2: Supabase CLI 사용

로컬 개발 환경에서 Supabase CLI를 사용하는 경우:

```bash
# Supabase 로컬 환경 시작 (이미 실행 중이면 생략)
supabase start

# 마이그레이션 적용
supabase db reset
# 또는
supabase migration up
```

### 방법 3: 프로덕션 환경

프로덕션 환경에서는 Supabase Dashboard의 SQL Editor를 사용하거나, GitHub Actions를 통해 자동 배포하는 것을 권장합니다.

## 확인

마이그레이션 적용 후:

1. Supabase Dashboard의 Table Editor에서 `instruments` 테이블이 생성되었는지 확인
2. `/instruments` 페이지에 접속하여 데이터가 표시되는지 확인
3. 샘플 데이터 (violin, viola, cello)가 3개 있는지 확인

## 참고

- 이 테이블은 Supabase 공식 문서 예제용입니다
- 프로덕션에서는 RLS를 활성화하는 것을 권장합니다
- 개발 단계에서는 RLS가 비활성화되어 있습니다

