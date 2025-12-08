# 배포 가이드

## Vercel 배포

### 1. Vercel 프로젝트 생성

1. [Vercel Dashboard](https://vercel.com/dashboard)에 접속하여 로그인
2. **"Add New..."** → **"Project"** 클릭
3. GitHub/GitLab/Bitbucket 저장소 연결 또는 직접 배포

### 2. 환경 변수 설정

Vercel Dashboard → 프로젝트 → **Settings** → **Environment Variables**에서 다음 변수들을 추가:

#### 필수 환경 변수

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=YOUR_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY=YOUR_CLERK_SECRET_KEY
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_STORAGE_BUCKET=uploads

# Site URL (프로덕션 도메인)
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

#### 환경별 설정

- **Production**: 프로덕션 환경 변수
- **Preview**: 프리뷰 환경 변수 (선택사항)
- **Development**: 개발 환경 변수 (선택사항)

### 3. Clerk 프로덕션 설정

1. [Clerk Dashboard](https://dashboard.clerk.com/) → **Domains**
2. 프로덕션 도메인 추가 (예: `your-domain.com`)
3. DNS 설정에 CNAME 레코드 추가 (Clerk에서 제공하는 값)
4. **Production** 환경에서 프로덕션 키 사용:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Clerk Dashboard에서 Production 키 복사
   - `CLERK_SECRET_KEY`: Clerk Dashboard에서 Production Secret 키 복사

### 4. Supabase 프로덕션 설정

1. Supabase 프로젝트는 개발/프로덕션 동일하게 사용 가능
2. 또는 별도의 프로덕션 프로젝트 생성 권장
3. 프로덕션 프로젝트의 URL과 키를 환경 변수에 설정

### 5. 빌드 설정

Vercel은 Next.js를 자동으로 감지하므로 추가 설정이 필요 없습니다.

**빌드 명령어**: `pnpm build` (자동 감지)  
**출력 디렉토리**: `.next` (자동 감지)  
**설치 명령어**: `pnpm install` (자동 감지)

### 6. 배포 확인

1. **"Deploy"** 클릭하여 배포 시작
2. 빌드 로그 확인
3. 배포 완료 후 제공되는 URL로 접속하여 테스트

### 7. 커스텀 도메인 설정 (선택사항)

1. Vercel Dashboard → 프로젝트 → **Settings** → **Domains**
2. **"Add Domain"** 클릭
3. 도메인 입력 및 DNS 설정
4. SSL 인증서 자동 발급 (Let's Encrypt)

## 프로덕션 빌드 테스트

### 로컬에서 프로덕션 빌드 테스트

```bash
# 프로덕션 빌드
pnpm build

# 프로덕션 서버 실행
pnpm start
```

### 빌드 확인 사항

- [ ] 빌드 에러 없음
- [ ] 타입 에러 없음
- [ ] 환경 변수 정상 로드
- [ ] 정적 파일 생성 확인
- [ ] API 라우트 정상 작동

## 환경 변수 체크리스트

배포 전 다음 환경 변수가 모두 설정되어 있는지 확인:

- [ ] `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- [ ] `CLERK_SECRET_KEY`
- [ ] `NEXT_PUBLIC_CLERK_SIGN_IN_URL`
- [ ] `NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL`
- [ ] `NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `NEXT_PUBLIC_STORAGE_BUCKET`
- [ ] `NEXT_PUBLIC_SITE_URL` (프로덕션 도메인)

## 트러블슈팅

### 빌드 실패

1. 빌드 로그 확인
2. 타입 에러 확인: `pnpm build` 로컬에서 실행
3. 환경 변수 누락 확인

### 런타임 에러

1. Vercel 함수 로그 확인
2. 브라우저 콘솔 에러 확인
3. 환경 변수 값 확인 (Vercel Dashboard)

### 인증 문제

1. Clerk 도메인 설정 확인
2. Clerk 프로덕션 키 사용 확인
3. 리다이렉트 URL 설정 확인

## 추가 리소스

- [Vercel 문서](https://vercel.com/docs)
- [Next.js 배포 가이드](https://nextjs.org/docs/deployment)
- [Clerk 프로덕션 가이드](https://clerk.com/docs/deployments/overview)
- [Supabase 프로덕션 가이드](https://supabase.com/docs/guides/platform/going-to-prod)
