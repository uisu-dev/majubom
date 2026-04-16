"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import StudentSelector from "@/components/StudentSelector";
import type { Student } from "@/lib/types";

export default function CounselingPage() {
  const [teacher, setTeacher] = useState("");
  const [selectedStudents, setSelectedStudents] = useState<Student[]>([]);
  const [mode, setMode] = useState("일반");
  const [c1, setC1] = useState("");
  const [c2, setC2] = useState("");
  const [c3, setC3] = useState("");
  const [c4, setC4] = useState("");
  const [c5, setC5] = useState("");
  const [saving, setSaving] = useState(false);

  const isRestorative = mode === "회복적";

  const handleSubmit = async () => {
    if (!selectedStudents.length) return alert("학생을 선택해 주세요.");
    if (!teacher.trim()) return alert("상담교사를 입력해 주세요.");

    setSaving(true);
    const studentNames = selectedStudents
      .map((s) => `${s.grade}학년 ${s.class}반 ${s.name}`)
      .join(", ");

    const { error } = await supabase.from("counseling_logs").insert({
      teacher,
      student_names: studentNames,
      mode,
      c1, c2, c3, c4, c5,
    });

    setSaving(false);
    if (error) {
      alert("저장 실패: " + error.message);
    } else {
      alert("저장되었습니다.");
      resetForm();
    }
  };

  const resetForm = () => {
    setC1(""); setC2(""); setC3(""); setC4(""); setC5("");
    setSelectedStudents([]);
  };

  const printPledge = () => {
    if (!c4.trim()) return alert("합의 내용이 비어 있습니다.");
    const studentNames = selectedStudents
      .map((s) => `${s.grade}학년 ${s.class}반 ${s.name}`)
      .join(", ");
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`<html><body style="padding:50px;border:5px double black;font-family:sans-serif;">
      <h1 style="text-align:center;text-decoration:underline;">회복을 위한 약속</h1>
      <p>지도교사: ${teacher}</p>
      <p>학생: ${studentNames}</p><hr>
      <h3>우리의 약속 및 실천 사항</h3>
      <div style="min-height:300px;border:1px solid #ccc;padding:25px;background:#fafafa;white-space:pre-wrap;">${c4}</div>
      <p style="text-align:center;margin-top:50px;">위 내용을 성실히 이행할 것을 서약합니다.</p>
      <p style="text-align:right;">${new Date().toLocaleDateString()}</p>
      <div style="display:flex;justify-content:space-around;margin-top:60px;">
        <div>학생 (서명) : __________</div><div>교사 : (인)</div>
      </div>
      <script>window.print();<\/script></body></html>`);
    win.document.close();
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-blue-600 mb-6 pb-3 border-b-2 border-blue-50">
          마주봄 - 상담 일지 작성
        </h2>

        <div className="mb-5">
          <label className="block font-bold text-blue-600 mb-2 text-sm">상담교사</label>
          <input
            type="text"
            value={teacher}
            onChange={(e) => setTeacher(e.target.value)}
            placeholder="선생님 성함 입력"
            className="w-full px-3 py-3 border border-gray-300 rounded-lg text-sm"
          />
        </div>

        <div className="mb-5">
          <label className="block font-bold text-blue-600 mb-2 text-sm">학생 선택</label>
          <StudentSelector
            selected={selectedStudents}
            onSelect={setSelectedStudents}
          />
        </div>

        <div className="mb-5">
          <label className="block font-bold text-blue-600 mb-2 text-sm">상담 모드</label>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            className="w-full px-3 py-3 border border-gray-300 rounded-lg text-sm"
          >
            <option value="일반">일반 상담</option>
            <option value="회복적">회복적 상담</option>
          </select>
        </div>

        <div className="mb-5">
          <p className="text-xs text-gray-400 italic mb-1">
            {isRestorative
              ? "힌트: 이번 상황에서 어떤 일이 있었는지 이야기해볼까요?"
              : "상담 내용을 자유롭게 입력하세요."}
          </p>
          <label className="block font-bold text-blue-600 mb-2 text-sm">
            {isRestorative ? "1. 사건 요약" : "상담 내용"}
          </label>
          <textarea
            value={c1}
            onChange={(e) => setC1(e.target.value)}
            className="w-full px-3 py-3 border border-gray-300 rounded-lg text-sm min-h-[100px]"
          />
        </div>

        {isRestorative && (
          <>
            <div className="mb-5">
              <p className="text-xs text-gray-400 italic mb-1">
                힌트: 그 일이 당신과 다른 사람에게 어떤 영향을 주었나요? 지금 감정은?
              </p>
              <label className="block font-bold text-blue-600 mb-2 text-sm">
                2. 관련된 사람들의 감정과 생각
              </label>
              <textarea
                value={c2}
                onChange={(e) => setC2(e.target.value)}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg text-sm min-h-[100px]"
              />
            </div>
            <div className="mb-5">
              <p className="text-xs text-gray-400 italic mb-1">
                힌트: 앞으로 이 관계를 어떻게 회복하고 싶나요?
              </p>
              <label className="block font-bold text-blue-600 mb-2 text-sm">
                3. 피해 회복 및 관계 회복 방안 논의
              </label>
              <textarea
                value={c3}
                onChange={(e) => setC3(e.target.value)}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg text-sm min-h-[100px]"
              />
            </div>
            <div className="mb-5">
              <p className="text-xs text-gray-400 italic mb-1">
                힌트: 그 회복을 위해 어떤 약속을 할 수 있나요?
              </p>
              <label className="block font-bold text-blue-600 mb-2 text-sm">
                4. 합의 내용 및 실천 약속
              </label>
              <textarea
                value={c4}
                onChange={(e) => setC4(e.target.value)}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg text-sm min-h-[100px]"
              />
            </div>
            <div className="mb-5">
              <p className="text-xs text-gray-400 italic mb-1">
                힌트: 상담자 종합 의견 및 향후 지도 계획
              </p>
              <label className="block font-bold text-blue-600 mb-2 text-sm">
                5. 상담자 의견 및 지도 계획
              </label>
              <textarea
                value={c5}
                onChange={(e) => setC5(e.target.value)}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg text-sm min-h-[100px]"
              />
            </div>
          </>
        )}

        <button
          onClick={handleSubmit}
          disabled={saving}
          className="w-full bg-blue-600 text-white py-4 rounded-lg font-bold hover:bg-blue-700 transition disabled:opacity-50"
        >
          {saving ? "저장 중..." : "상담 일지 저장하기"}
        </button>

        {isRestorative && (
          <button
            onClick={printPledge}
            className="w-full bg-green-600 text-white py-3 rounded-lg font-bold mt-3 hover:bg-green-700 transition"
          >
            회복을 위한 서약서 출력
          </button>
        )}
      </div>
    </div>
  );
}
