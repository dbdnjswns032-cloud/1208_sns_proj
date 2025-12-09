/**
 * @file lib/api-error-handler.ts
 * @description API 에러 처리 유틸리티 함수
 *
 * HTTP 상태 코드별 사용자 친화적 메시지 매핑
 * 네트워크 에러 감지 및 처리
 * 에러 발생 시 해결 방법 제시
 */

import { toastError } from "./toast";

/**
 * HTTP 상태 코드별 에러 메시지 및 해결 방법
 */
interface ErrorInfo {
  message: string;
  solution?: string;
}

const ERROR_MESSAGES: Record<number, ErrorInfo> = {
  400: {
    message: "잘못된 요청입니다.",
    solution: "입력한 정보를 확인해주세요.",
  },
  401: {
    message: "로그인이 필요합니다.",
    solution: "다시 로그인해주세요.",
  },
  403: {
    message: "권한이 없습니다.",
    solution: "이 작업을 수행할 권한이 없습니다.",
  },
  404: {
    message: "요청한 리소스를 찾을 수 없습니다.",
    solution: "페이지를 새로고침하거나 다시 시도해주세요.",
  },
  409: {
    message: "이미 존재하는 데이터입니다.",
    solution: "중복된 요청입니다. 잠시 후 다시 시도해주세요.",
  },
  429: {
    message: "요청이 너무 많습니다.",
    solution: "잠시 후 다시 시도해주세요.",
  },
  500: {
    message: "서버 오류가 발생했습니다.",
    solution: "잠시 후 다시 시도해주세요. 문제가 지속되면 관리자에게 문의해주세요.",
  },
  502: {
    message: "서버에 연결할 수 없습니다.",
    solution: "인터넷 연결을 확인하고 잠시 후 다시 시도해주세요.",
  },
  503: {
    message: "서비스를 일시적으로 사용할 수 없습니다.",
    solution: "잠시 후 다시 시도해주세요.",
  },
};

/**
 * 네트워크 에러 정보
 */
const NETWORK_ERROR: ErrorInfo = {
  message: "네트워크 연결에 실패했습니다.",
  solution: "인터넷 연결을 확인해주세요.",
};

/**
 * 타임아웃 에러 정보
 */
const TIMEOUT_ERROR: ErrorInfo = {
  message: "요청 시간이 초과되었습니다.",
  solution: "인터넷 연결을 확인하고 다시 시도해주세요.",
};

/**
 * 알 수 없는 에러 정보
 */
const UNKNOWN_ERROR: ErrorInfo = {
  message: "알 수 없는 오류가 발생했습니다.",
  solution: "페이지를 새로고침하거나 잠시 후 다시 시도해주세요.",
};

/**
 * 에러에서 사용자 친화적 메시지 추출
 *
 * @param error 에러 객체
 * @returns 에러 정보 (메시지 및 해결 방법)
 */
export function getErrorMessage(error: unknown): ErrorInfo {
  // Response 객체인 경우
  if (error instanceof Response) {
    const status = error.status;
    return ERROR_MESSAGES[status] || {
      message: `서버 오류가 발생했습니다. (${status})`,
      solution: "잠시 후 다시 시도해주세요.",
    };
  }

  // 네트워크 에러
  if (error instanceof TypeError) {
    if (error.message.includes("fetch") || error.message.includes("network")) {
      return NETWORK_ERROR;
    }
    if (error.message.includes("timeout")) {
      return TIMEOUT_ERROR;
    }
  }

  // 일반 Error 객체
  if (error instanceof Error) {
    // 네트워크 관련 에러
    if (error.message.includes("network") || error.message.includes("Network")) {
      return NETWORK_ERROR;
    }
    // 타임아웃 에러
    if (error.message.includes("timeout") || error.message.includes("Timeout")) {
      return TIMEOUT_ERROR;
    }
    // 기타 에러
    return {
      message: error.message || UNKNOWN_ERROR.message,
      solution: UNKNOWN_ERROR.solution,
    };
  }

  // 알 수 없는 에러
  return UNKNOWN_ERROR;
}

/**
 * 에러를 사용자에게 표시 (Toast 사용)
 *
 * @param error 에러 객체
 * @param showSolution 해결 방법 표시 여부 (기본값: true)
 */
export function handleApiError(error: unknown, showSolution = true): void {
  const errorInfo = getErrorMessage(error);

  if (showSolution && errorInfo.solution) {
    toastError(`${errorInfo.message} ${errorInfo.solution}`);
  } else {
    toastError(errorInfo.message);
  }
}

/**
 * 타임아웃이 포함된 fetch 함수
 *
 * @param url 요청 URL
 * @param options fetch 옵션
 * @param timeout 타임아웃 시간 (ms, 기본값: 10000)
 * @returns Response 객체
 */
export async function fetchWithTimeout(
  url: string,
  options?: RequestInit,
  timeout = 10000
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
      throw new Error("Request timeout");
    }
    throw error;
  }
}

/**
 * API 호출 헬퍼 함수 (에러 처리 포함)
 *
 * @param url 요청 URL
 * @param options fetch 옵션
 * @param timeout 타임아웃 시간 (ms)
 * @returns JSON 응답 데이터
 */
export async function apiCall<T = unknown>(
  url: string,
  options?: RequestInit,
  timeout = 10000
): Promise<T> {
  try {
    const response = await fetchWithTimeout(url, options, timeout);

    // JSON 파싱 시도
    let data: T;
    try {
      data = await response.json();
    } catch (parseError) {
      // JSON 파싱 실패 시 빈 객체 반환
      if (response.ok) {
        return {} as T;
      }
      throw response;
    }

    // 에러 응답인 경우
    if (!response.ok) {
      throw response;
    }

    return data;
  } catch (error) {
    // 에러 처리 및 재throw
    handleApiError(error);
    throw error;
  }
}

