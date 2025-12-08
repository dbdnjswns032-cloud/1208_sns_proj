/**
 * @file components/post/CreatePostModal.tsx
 * @description 게시물 작성 모달 컴포넌트
 *
 * 기능:
 * - Dialog 컴포넌트 사용
 * - 이미지 미리보기 UI
 * - 텍스트 입력 필드 (최대 2,200자)
 * - 파일 선택 버튼
 * - 업로드 버튼
 */

"use client";

import { useState, useRef } from "react";
import { X, Upload, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { toastError, toastSuccess } from "@/lib/toast";

interface CreatePostModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreatePostModal({ open, onOpenChange }: CreatePostModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useUser();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 파일 타입 검증
    if (!file.type.startsWith("image/")) {
      toastError("이미지 파일만 업로드할 수 있습니다.");
      return;
    }

    // 파일 크기 검증 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toastError("파일 크기는 5MB를 초과할 수 없습니다.");
      return;
    }

    setSelectedFile(file);

    // 미리보기 URL 생성
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile || !user) {
      toastError("이미지를 선택하고 로그인해주세요.");
      return;
    }

    if (caption.length > 2200) {
      toastError("캡션은 2,200자를 초과할 수 없습니다.");
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);
      formData.append("caption", caption);

      // XMLHttpRequest를 사용하여 진행률 추적
      const xhr = new XMLHttpRequest();

      const responseData = await new Promise<{ success: boolean; error?: string; post?: any }>((resolve, reject) => {
        xhr.upload.addEventListener("progress", (e) => {
          if (e.lengthComputable) {
            const percentComplete = Math.round((e.loaded / e.total) * 100);
            setUploadProgress(percentComplete);
          }
        });

        xhr.addEventListener("load", () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const data = JSON.parse(xhr.responseText);
              resolve(data);
            } catch {
              resolve({ success: true });
            }
          } else {
            try {
              const error = JSON.parse(xhr.responseText);
              reject(new Error(error.error || "게시물 업로드에 실패했습니다."));
            } catch {
              reject(new Error("게시물 업로드에 실패했습니다."));
            }
          }
        });

        xhr.addEventListener("error", () => {
          reject(new Error("네트워크 오류가 발생했습니다."));
        });

        xhr.open("POST", "/api/posts");
        xhr.send(formData);
      });

      if (!responseData.success) {
        throw new Error(responseData.error || "게시물 업로드에 실패했습니다.");
      }

      setUploadProgress(100);

      // 성공 시 모달 닫기 및 상태 초기화
      toastSuccess("게시물이 업로드되었습니다.");
      onOpenChange(false);
      setSelectedFile(null);
      setPreviewUrl(null);
      setCaption("");

      // 페이지 새로고침 (피드 업데이트)
      window.location.reload();
    } catch (error) {
      console.error("Error uploading post:", error);
      toastError(error instanceof Error ? error.message : "게시물 업로드에 실패했습니다.");
    } finally {
      setUploading(false);
      // 성공 시에만 진행률 초기화 (에러 시에는 마지막 진행률 유지)
      if (uploadProgress === 100) {
        setTimeout(() => setUploadProgress(0), 500);
      }
    }
  };

  const handleClose = () => {
    if (!uploading) {
      onOpenChange(false);
      // 모달 닫을 때 상태 초기화 (취소 시)
      if (!uploading) {
        setSelectedFile(null);
        setPreviewUrl(null);
        setCaption("");
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] p-0">
        <DialogHeader className="px-6 py-4 border-b border-[var(--instagram-border)]">
          <DialogTitle className="text-instagram-base font-instagram-semibold text-[var(--instagram-text-primary)]">
            새 게시물 만들기
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col">
          {/* 이미지 선택 영역 */}
          {!previewUrl ? (
            <div className="flex flex-col items-center justify-center p-12 min-h-[400px]">
              <Upload className="w-16 h-16 text-[var(--instagram-text-secondary)] mb-4" />
              <p className="text-instagram-base font-instagram-semibold text-[var(--instagram-text-primary)] mb-2">
                사진을 여기에 끌어다 놓으세요
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileSelect}
                className="hidden"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="bg-[var(--instagram-blue)] hover:bg-[var(--instagram-blue)]/90 text-white"
              >
                컴퓨터에서 선택
              </Button>
              <p className="text-instagram-xs text-[var(--instagram-text-secondary)] mt-4">
                JPEG, PNG, WEBP 파일만 지원됩니다 (최대 5MB)
              </p>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row">
              {/* 이미지 미리보기 */}
              <div className="relative w-full md:w-1/2 aspect-square bg-[var(--instagram-background)]">
                <Image
                  src={previewUrl}
                  alt="미리보기"
                  fill
                  className="object-contain"
                />
                <button
                  onClick={() => {
                    setSelectedFile(null);
                    setPreviewUrl(null);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = "";
                    }
                  }}
                  className="absolute top-2 right-2 p-1 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
                  aria-label="이미지 제거"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>

              {/* 캡션 입력 영역 */}
              <div className="w-full md:w-1/2 flex flex-col">
                {/* 사용자 정보 */}
                <div className="flex items-center gap-3 p-4 border-b border-[var(--instagram-border)]">
                  <div className="w-8 h-8 rounded-full bg-[var(--instagram-border)] flex items-center justify-center">
                    {user?.firstName?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <span className="text-instagram-sm font-instagram-semibold text-[var(--instagram-text-primary)]">
                    {user?.firstName || user?.username || "사용자"}
                  </span>
                </div>

                {/* 캡션 입력 */}
                <div className="flex-1 p-4">
                  <Textarea
                    placeholder="문구 입력..."
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    maxLength={2200}
                    className="min-h-[200px] resize-none border-0 focus-visible:ring-0 text-instagram-sm"
                    style={{
                      fontFamily: "inherit",
                    }}
                  />
                  <div className="text-right mt-2">
                    <span
                      className={cn(
                        "text-instagram-xs",
                        caption.length > 2200
                          ? "text-[var(--instagram-like)]"
                          : "text-[var(--instagram-text-secondary)]"
                      )}
                    >
                      {caption.length}/2,200
                    </span>
                  </div>
                </div>

                {/* 업로드 버튼 및 진행률 */}
                <div className="p-4 border-t border-[var(--instagram-border)] space-y-2">
                  {uploading && (
                    <div className="w-full bg-[var(--instagram-border)] rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-[var(--instagram-blue)] transition-all duration-300 ease-out"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  )}
                  <Button
                    onClick={handleUpload}
                    disabled={uploading || !selectedFile}
                    className="w-full bg-[var(--instagram-blue)] hover:bg-[var(--instagram-blue)]/90 text-white disabled:opacity-50 min-h-[44px]"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        업로드 중... {uploadProgress}%
                      </>
                    ) : (
                      "공유하기"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}


