/**
 * @file lib/toast.ts
 * @description Toast 알림 유틸리티 함수
 *
 * sonner를 사용한 Toast 알림 함수들을 export합니다.
 * 컴포넌트에서 직접 import하여 사용할 수 있습니다.
 */

import { toast as sonnerToast } from "sonner";

/**
 * 성공 메시지 표시
 */
export function toastSuccess(message: string) {
  sonnerToast.success(message);
}

/**
 * 에러 메시지 표시
 */
export function toastError(message: string) {
  sonnerToast.error(message);
}

/**
 * 정보 메시지 표시
 */
export function toastInfo(message: string) {
  sonnerToast.info(message);
}

/**
 * 경고 메시지 표시
 */
export function toastWarning(message: string) {
  sonnerToast.warning(message);
}

/**
 * 기본 Toast 함수 (sonner의 toast 함수 직접 export)
 */
export { sonnerToast as toast };

