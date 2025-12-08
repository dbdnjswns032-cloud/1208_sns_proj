import {
  SignedOut,
  SignInButton,
  SignUpButton,
  SignedIn,
  UserButton,
} from "@clerk/nextjs";
import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <header className="flex justify-between items-center p-4 gap-4 h-16 max-w-7xl mx-auto">
      <Link href="/" className="text-2xl font-bold">
        SaaS Template
      </Link>
      <div className="flex gap-4 items-center">
        <SignedOut>
          {/* 로그인 버튼 - /sign-in 페이지로 리다이렉트 */}
          <SignInButton mode="redirect">
            <Button variant="outline">로그인</Button>
          </SignInButton>
          {/* 회원가입 버튼 - /sign-up 페이지로 리다이렉트 */}
          <SignUpButton mode="redirect">
            <Button>회원가입</Button>
          </SignUpButton>
        </SignedOut>
        <SignedIn>
          {/* 사용자 프로필 버튼 - 한국어 로컬라이제이션 적용됨 */}
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: "w-10 h-10",
              },
            }}
          />
        </SignedIn>
      </div>
    </header>
  );
};

export default Navbar;
