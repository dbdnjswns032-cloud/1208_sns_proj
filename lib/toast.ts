/**
 * @file lib/toast.ts
 * @description Toast 알림 유틸리티 함수
 *
 * sonner 라이브러리를 사용한 Toast 알림
 */

import { toast as sonnerToast } from "sonner";

/**
 * 성공 메시지 Toast
 */
export function toastSuccess(message: string): void {
  sonnerToast.success(message);
}

/**
 * 에러 메시지 Toast
 */
export function toastError(message: string): void {
  sonnerToast.error(message);
}

/**
 * 정보 메시지 Toast
 */
export function toastInfo(message: string): void {
  sonnerToast.info(message);
}

/**
 * 경고 메시지 Toast
 */
export function toastWarning(message: string): void {
  sonnerToast.warning(message);
}

