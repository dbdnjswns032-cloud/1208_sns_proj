/**
 * @file lib/retry.ts
 * @description 재시도 로직 유틸리티 함수
 *
 * 지수 백오프(exponential backoff)를 사용한 재시도 로직
 * 네트워크 에러나 일시적인 서버 에러에 대해 자동 재시도
 */

/**
 * 재시도 옵션
 */
export interface RetryOptions {
  /** 최대 재시도 횟수 (기본값: 3) */
  maxRetries?: number;
  /** 초기 대기 시간 (ms, 기본값: 1000) */
  initialDelay?: number;
  /** 최대 대기 시간 (ms, 기본값: 10000) */
  maxDelay?: number;
  /** 지수 백오프 배수 (기본값: 2) */
  multiplier?: number;
  /** 재시도할 에러 조건 함수 */
  shouldRetry?: (error: unknown) => boolean;
}

/**
 * 기본 재시도 조건: 네트워크 에러 또는 5xx 서버 에러
 */
function defaultShouldRetry(error: unknown): boolean {
  // 네트워크 에러
  if (error instanceof TypeError && error.message.includes("fetch")) {
    return true;
  }

  // Response 객체의 경우
  if (error instanceof Response) {
    return error.status >= 500 && error.status < 600;
  }

  // 일반 에러
  if (error instanceof Error) {
    return error.message.includes("network") || error.message.includes("Network");
  }

  return false;
}

/**
 * 지수 백오프를 사용한 대기 시간 계산
 */
function calculateDelay(
  attempt: number,
  initialDelay: number,
  maxDelay: number,
  multiplier: number
): number {
  const delay = initialDelay * Math.pow(multiplier, attempt);
  return Math.min(delay, maxDelay);
}

/**
 * 재시도 로직이 포함된 함수 실행
 *
 * @param fn 실행할 함수 (Promise 반환)
 * @param options 재시도 옵션
 * @returns 함수 실행 결과
 */
export async function retry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxRetries = 3,
    initialDelay = 1000,
    maxDelay = 10000,
    multiplier = 2,
    shouldRetry = defaultShouldRetry,
  } = options;

  let lastError: unknown;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // 재시도하지 않을 에러인 경우 즉시 throw
      if (!shouldRetry(error)) {
        throw error;
      }

      // 마지막 시도인 경우 throw
      if (attempt === maxRetries) {
        throw error;
      }

      // 대기 시간 계산 및 대기
      const delay = calculateDelay(attempt, initialDelay, maxDelay, multiplier);
      await new Promise((resolve) => setTimeout(resolve, delay));

      // 개발 모드에서 재시도 로그
      if (process.env.NODE_ENV === "development") {
        console.warn(`[retry] Attempt ${attempt + 1} failed, retrying in ${delay}ms...`, error);
      }
    }
  }

  // 이 코드는 실행되지 않아야 하지만 TypeScript를 위해 필요
  throw lastError;
}

/**
 * fetch 요청에 재시도 로직 적용
 *
 * @param url 요청 URL
 * @param options fetch 옵션
 * @param retryOptions 재시도 옵션
 * @returns Response 객체
 */
export async function fetchWithRetry(
  url: string,
  options?: RequestInit,
  retryOptions?: RetryOptions
): Promise<Response> {
  return retry(
    async () => {
      const response = await fetch(url, options);

      // 5xx 서버 에러인 경우 throw하여 재시도
      if (response.status >= 500 && response.status < 600) {
        throw response;
      }

      return response;
    },
    retryOptions
  );
}

