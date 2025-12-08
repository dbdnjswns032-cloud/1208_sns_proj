/**
 * @file components/providers/network-status-provider.tsx
 * @description 네트워크 상태를 전역으로 관리하는 Provider
 *
 * 기능:
 * - 오프라인 상태 감지 및 사용자 알림
 * - 온라인 상태 복구 시 알림
 */

"use client";

import { useEffect } from "react";
import { useNetworkStatus } from "@/hooks/use-network-status";
import { toastError, toastSuccess } from "@/lib/toast";

export function NetworkStatusProvider({ children }: { children: React.ReactNode }) {
  const { isOnline, isOffline } = useNetworkStatus();

  useEffect(() => {
    if (isOffline) {
      toastError("인터넷 연결이 끊어졌습니다. 네트워크 상태를 확인해주세요.");
    } else if (isOnline) {
      // 온라인 상태로 복구되었을 때만 알림 (초기 로드 시 제외)
      // 이전 상태를 추적하기 위해 sessionStorage 사용
      const wasOffline = sessionStorage.getItem("wasOffline") === "true";
      if (wasOffline) {
        toastSuccess("인터넷 연결이 복구되었습니다.");
        sessionStorage.removeItem("wasOffline");
      }
    }
  }, [isOnline, isOffline]);

  useEffect(() => {
    if (isOffline) {
      sessionStorage.setItem("wasOffline", "true");
    }
  }, [isOffline]);

  return <>{children}</>;
}

