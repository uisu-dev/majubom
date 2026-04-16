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
        // Reset file input
        const fileInput = document.querySelector(
          'input[type="file"]'
        ) as HTMLInputElement;
        if (fileInput) fileInput.value = "";
      }
    } catch {
      setMessage("업로드 중 오류가 발생했습니다.");
    }
    setUploading(false);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-blue-600 mb-6 pb-3 border-b-2 border-blue-50">
          성찰문 등록
        </h2>

        <div className="mb-5">
          <label className="block font-bold text-blue-600 mb-2 text-sm">
            1. 학생 선택
          </label>
          <StudentSelector
            multiple={false}
            selected={selectedStudents}
            onSelect={setSelectedStudents}
          />
        </div>

        <div className="mb-5">
          <label className="block font-bold text-blue-600 mb-2 text-sm">
            2. 성찰문 파일
          </label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
          />
          <p className="text-xs text-gray-400 mt-1">
            * 파일명은 원본 그대로 저장됩니다.
          </p>
        </div>

        <button
          onClick={handleUpload}
          disabled={uploading}
          className="w-full bg-blue-600 text-white py-4 rounded-lg font-bold hover:bg-blue-700 transition disabled:opacity-50"
        >
          {uploading ? "업로드 중..." : "등록하기"}
        </button>

        {message && (
          <div
            className={`mt-4 p-3 rounded-lg text-center font-bold text-sm ${
              message.includes("완료")
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
