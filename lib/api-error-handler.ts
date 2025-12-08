/**
 * @file lib/api-error-handler.ts
 * @description API 에러 처리 유틸리티 함수
 *
 * HTTP 상태 코드별 사용자 친화적 메시지 매핑 및 에러 처리
 */

/**
 * HTTP 상태 코드별 사용자 친화적 에러 메시지
 */
const ERROR_MESSAGES: Record<number, string> = {
  400: "잘못된 요청입니다. 입력한 정보를 확인해주세요.",
  401: "로그인이 필요합니다. 다시 로그인해주세요.",
  403: "접근 권한이 없습니다.",
  404: "요청한 리소스를 찾을 수 없습니다.",
  409: "이미 존재하는 데이터입니다.",
  413: "파일 크기가 너무 큽니다.",
  422: "입력한 정보가 올바르지 않습니다.",
  429: "너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요.",
  500: "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
  502: "서버에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.",
  503: "서비스를 일시적으로 사용할 수 없습니다. 잠시 후 다시 시도해주세요.",
  504: "요청 시간이 초과되었습니다. 잠시 후 다시 시도해주세요.",
};

/**
 * 네트워크 에러인지 확인
 */
function isNetworkError(error: unknown): boolean {
  if (error instanceof TypeError) {
    return (
      error.message.includes("fetch") ||
      error.message.includes("network") ||
      error.message.includes("Failed to fetch")
    );
  }
  return false;
}

/**
 * 타임아웃 에러인지 확인
 */
function isTimeoutError(error: unknown): boolean {
  if (error instanceof Error) {
    return (
      error.message.includes("timeout") ||
      error.message.includes("aborted") ||
      error.name === "AbortError"
    );
  }
  return false;
}

/**
 * JSON 파싱 에러인지 확인
 */
function isJSONParseError(error: unknown): boolean {
  if (error instanceof SyntaxError) {
    return error.message.includes("JSON");
  }
  return false;
}

/**
 * API 에러를 사용자 친화적 메시지로 변환
 */
export function getErrorMessage(
  error: unknown,
  defaultMessage: string = "오류가 발생했습니다. 잠시 후 다시 시도해주세요."
): string {
  // 네트워크 에러
  if (isNetworkError(error)) {
    return "네트워크 연결을 확인해주세요. 인터넷 연결이 불안정할 수 있습니다.";
  }

  // 타임아웃 에러
  if (isTimeoutError(error)) {
    return "요청 시간이 초과되었습니다. 네트워크 상태를 확인하고 다시 시도해주세요.";
  }

  // JSON 파싱 에러
  if (isJSONParseError(error)) {
    return "서버 응답을 처리하는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
  }

  // Error 객체인 경우
  if (error instanceof Error) {
    // 이미 사용자 친화적인 메시지인 경우 그대로 반환
    if (error.message && !error.message.includes("Error:") && !error.message.includes("at")) {
      return error.message;
    }
  }

  return defaultMessage;
}

/**
 * HTTP 응답에서 에러 메시지 추출
 */
export async function extractErrorMessage(
  response: Response
): Promise<string> {
  const status = response.status;

  // 상태 코드별 기본 메시지
  const statusMessage = ERROR_MESSAGES[status] || `오류가 발생했습니다. (${status})`;

  try {
    // 응답 본문에서 에러 메시지 추출 시도
    const data = await response.json();
    if (data.error && typeof data.error === "string") {
      return data.error;
    }
    if (data.message && typeof data.message === "string") {
      return data.message;
    }
  } catch {
    // JSON 파싱 실패 시 상태 코드 메시지 반환
  }

  return statusMessage;
}

/**
 * fetch 요청 래퍼 (타임아웃 및 에러 처리 포함)
 */
export async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeout: number = 10000 // 10초 기본 타임아웃
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("요청 시간이 초과되었습니다.");
    }
    throw error;
  }
}

/**
 * API 호출 헬퍼 함수 (에러 처리 포함)
 */
export async function apiCall<T = unknown>(
  url: string,
  options: RequestInit = {},
  timeout: number = 10000
): Promise<T> {
  try {
    const response = await fetchWithTimeout(url, options, timeout);

    if (!response.ok) {
      const errorMessage = await extractErrorMessage(response);
      throw new Error(errorMessage);
    }

    // 빈 응답 처리
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      return {} as T;
    }

    return await response.json();
  } catch (error) {
    // 이미 Error 객체이고 메시지가 있는 경우 그대로 throw
    if (error instanceof Error) {
      throw error;
    }

    // 그 외의 경우 사용자 친화적 메시지로 변환
    throw new Error(getErrorMessage(error));
  }
}

