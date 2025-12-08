/**
 * @file hooks/use-network-status.ts
 * @description 네트워크 연결 상태를 감지하는 커스텀 훅
 *
 * 기능:
 * - 온라인/오프라인 상태 감지
 * - 네트워크 상태 변경 시 콜백 실행
 */

"use client";

import { useState, useEffect } from "react";

interface UseNetworkStatusReturn {
  isOnline: boolean;
  isOffline: boolean;
}

/**
 * 네트워크 연결 상태를 감지하는 훅
 */
export function useNetworkStatus(): UseNetworkStatusReturn {
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof window !== "undefined" ? navigator.onLine : true
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return {
    isOnline,
    isOffline: !isOnline,
  };
}

