/**
 * @file app/tasks/page.tsx
 * @description Clerk + Supabase 통합 예제 페이지 (문서의 tasks 예제 기반)
 *
 * 이 페이지는 Clerk와 Supabase의 네이티브 통합을 보여주는 예제입니다.
 * 문서: https://clerk.com/docs/guides/development/integrations/databases/supabase
 *
 * 주요 기능:
 * 1. Clerk로 인증된 사용자의 tasks 조회
 * 2. 새 task 생성
 * 3. RLS 정책을 통한 사용자별 데이터 접근 제어
 *
 * 핵심 구현 로직:
 * - useClerkSupabaseClient()를 사용하여 Clerk 토큰이 포함된 Supabase 클라이언트 생성
 * - useSession()과 useUser()를 사용하여 Clerk 세션 및 사용자 정보 가져오기
 * - Supabase의 RLS 정책이 auth.jwt()->>'sub'로 Clerk user ID 확인
 *
 * @dependencies
 * - @clerk/nextjs: Clerk 인증
 * - @supabase/supabase-js: Supabase 클라이언트
 * - lib/supabase/clerk-client: Clerk + Supabase 통합 클라이언트
 */

"use client";

import { useEffect, useState } from "react";
import { useSession, useUser } from "@clerk/nextjs";
import { useClerkSupabaseClient } from "@/lib/supabase/clerk-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

interface Task {
  id: number;
  name: string;
  user_id: string;
  created_at?: string;
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // useUser() hook은 Clerk가 로드된 사용자 데이터를 보장
  const { user, isLoaded: userLoaded } = useUser();

  // useSession() hook은 Clerk 세션 객체를 가져옴
  // 세션 객체는 Clerk 세션 토큰을 가져오는 데 사용됨
  const { session, isLoaded: sessionLoaded } = useSession();

  // Clerk 세션 토큰을 포함한 Supabase 클라이언트 생성
  const supabase = useClerkSupabaseClient();

  const isLoaded = userLoaded && sessionLoaded;

  // 사용자 데이터가 로드된 후 tasks 가져오기
  useEffect(() => {
    if (!isLoaded || !user) return;

    async function loadTasks() {
      try {
        setLoading(true);
        const { data, error } = await supabase.from("tasks").select();

        if (error) {
          console.error("Error loading tasks:", error);
          return;
        }

        setTasks(data || []);
      } catch (err) {
        console.error("Unexpected error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadTasks();
  }, [user, isLoaded, supabase]);

  async function createTask(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!name.trim() || !user) return;

    try {
      setSubmitting(true);

      // tasks 테이블에 새 task 삽입
      // user_id는 RLS 정책에 의해 자동으로 설정됨 (default auth.jwt()->>'sub')
      const { error } = await supabase.from("tasks").insert({
        name: name.trim(),
      });

      if (error) {
        console.error("Error creating task:", error);
        alert(`작업 생성 실패: ${error.message}`);
        return;
      }

      // 성공 시 폼 초기화 및 페이지 새로고침
      setName("");
      window.location.reload();
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("예상치 못한 오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>로딩 중...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <h1 className="text-2xl font-bold">로그인이 필요합니다</h1>
        <p className="text-gray-600">
          작업을 관리하려면 먼저 로그인해주세요.
        </p>
        <Link href="/">
          <Button>홈으로 돌아가기</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="mb-8">
        <Link
          href="/"
          className="text-blue-600 hover:underline mb-4 inline-block"
        >
          ← 홈으로 돌아가기
        </Link>
        <h1 className="text-4xl font-bold mb-2">Tasks</h1>
        <p className="text-gray-600">
          Clerk + Supabase 통합 예제: 사용자별 작업 관리
        </p>
      </div>

      {loading && <p>로딩 중...</p>}

      {!loading && tasks.length > 0 && (
        <div className="mb-8 space-y-2">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="p-4 border rounded-lg bg-white hover:bg-gray-50"
            >
              <p className="font-medium">{task.name}</p>
              {task.created_at && (
                <p className="text-sm text-gray-500 mt-1">
                  {new Date(task.created_at).toLocaleString("ko-KR")}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {!loading && tasks.length === 0 && (
        <div className="mb-8 p-8 text-center border rounded-lg bg-gray-50">
          <p className="text-gray-600">작업이 없습니다.</p>
        </div>
      )}

      <form onSubmit={createTask} className="space-y-4">
        <div className="flex gap-2">
          <Input
            autoFocus
            type="text"
            name="name"
            placeholder="새 작업 입력"
            onChange={(e) => setName(e.target.value)}
            value={name}
            disabled={submitting}
            className="flex-1"
          />
          <Button type="submit" disabled={submitting || !name.trim()}>
            {submitting ? "추가 중..." : "추가"}
          </Button>
        </div>
      </form>

      {/* 설명 섹션 */}
      <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-bold mb-2">💡 이 예제의 작동 원리</h3>
        <ul className="text-sm text-blue-900 space-y-1 list-disc list-inside">
          <li>
            <strong>useUser()</strong>: Clerk가 로드된 사용자 데이터 확인
          </li>
          <li>
            <strong>useSession()</strong>: Clerk 세션 객체 가져오기 (토큰 포함)
          </li>
          <li>
            <strong>useClerkSupabaseClient()</strong>: Clerk 세션 토큰을
            Supabase 요청에 자동 포함
          </li>
          <li>
            <strong>RLS 정책</strong>: auth.jwt()→&gt;&apos;sub&apos;로 Clerk
            user ID 확인하여 사용자별 데이터 접근 제어
          </li>
          <li>
            <strong>자동 user_id 설정</strong>: tasks 테이블의 user_id 컬럼이
            default auth.jwt()→&gt;&apos;sub&apos;로 자동 설정됨
          </li>
        </ul>
      </div>
    </div>
  );
}

