"use client";

import { useState } from "react";
import StudentSelector from "@/components/StudentSelector";
import type { Student } from "@/lib/types";

export default function ReflectionUploadPage() {
  const [selectedStudents, setSelectedStudents] = useState<Student[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleUpload = async () => {
    if (!selectedStudents.length) return alert("학생을 선택해 주세요.");
    if (!file) return alert("파일을 선택해 주세요.");

    setUploading(true);
    setMessage("");

    const student = selectedStudents[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("studentId", String(student.id));
    formData.append("studentName", student.name);

    try {
      const res = await fetch("/api/reflections", {
        method: "POST",
        body: formData,
      });
      const result = await res.json();
      setMessage(result.message);
      if (result.success) {
        setFile(null);
        setSelectedStudents([]);
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        if (fileInput) fileInput.value = "";
      }
    } catch {
      setMessage("업로드 중 오류가 발생했습니다.");
    }
    setUploading(false);
  };

  return (
    <div className="max-w-xl mx-auto px-6 py-8 space-y-6">
      <div className="bg-surface-card rounded-[12px] shadow-card p-6">
        <h2 className="text-[18px] font-bold text-text-primary mb-6 pb-3 border-b border-border">
          성찰문 등록
        </h2>

        <div className="mb-5">
          <label className="block text-[13px] font-semibold text-text-secondary mb-2">
            1. 학생 선택
          </label>
          <StudentSelector
            multiple={false}
            selected={selectedStudents}
            onSelect={setSelectedStudents}
          />
        </div>

        <div className="mb-5">
          <label className="block text-[13px] font-semibold text-text-secondary mb-2">
            2. 성찰문 파일
          </label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full px-3 py-2.5 border border-border rounded-[8px] text-[14px] bg-surface-card text-text-primary min-h-[44px]"
          />
          <p className="text-[12px] text-text-disabled mt-1">
            * 파일명은 원본 그대로 저장됩니다.
          </p>
        </div>

        <button
          onClick={handleUpload}
          disabled={uploading}
          className="w-full bg-brand text-white py-3.5 rounded-[8px] text-[14px] font-bold hover:bg-brand-hover transition disabled:opacity-50 min-h-[44px]"
        >
          {uploading ? "업로드 중..." : "등록하기"}
        </button>

        {message && (
          <div
            className={`mt-4 p-3 rounded-[8px] text-center text-[13px] font-bold ${
              message.includes("완료")
                ? "bg-success-tint text-success"
                : "bg-destructive-tint text-destructive"
            }`}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
