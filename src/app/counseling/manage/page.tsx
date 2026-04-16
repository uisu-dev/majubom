"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import type { CounselingLog } from "@/lib/types";

export default function ManagePage() {
  const [logs, setLogs] = useState<CounselingLog[]>([]);
  const [gradeFilter, setGradeFilter] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [nameFilter, setNameFilter] = useState("");
  const [viewLog, setViewLog] = useState<CounselingLog | null>(null);

  const loadLogs = useCallback(async () => {
    const { data } = await supabase
      .from("counseling_logs")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setLogs(data as CounselingLog[]);
  }, []);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  const filtered = logs.filter((l) => {
    if (gradeFilter && !l.student_names.includes(gradeFilter + "학년"))
      return false;
    if (classFilter && !l.student_names.includes(classFilter + "반"))
      return false;
    if (nameFilter && !l.student_names.includes(nameFilter)) return false;
    return true;
  });

  const handleDelete = async (id: number) => {
    if (!confirm("삭제할까요?")) return;
    await supabase.from("counseling_logs").delete().eq("id", id);
    loadLogs();
  };

  const printReport = (l: CounselingLog) => {
    const win = window.open("", "_blank");
    if (!win) return;
    const date = new Date(l.created_at).toLocaleString("ko-KR");
    win.document.write(`<html><body style="padding:30px;font-family:sans-serif;line-height:1.6;">
      <h2>상담 기록 보고서</h2><hr>
      <p>일시: ${date} | 교사: ${l.teacher}</p>
      <p>학생: ${l.student_names}</p><hr>
      <div><b>내용:</b><br>${l.c1.replace(/\n/g, "<br>")}</div>
      ${l.mode === "회복적" ? `<div><b>감정:</b> ${l.c2}</div><div><b>약속:</b> ${l.c4}</div>` : ""}
      <script>window.print();<\/script></body></html>`);
    win.document.close();
  };

  const printPledge = (l: CounselingLog) => {
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`<html><body style="padding:50px;border:5px double black;font-family:sans-serif;">
      <h1 style="text-align:center;">회복을 위한 약속</h1>
      <p>교사: ${l.teacher}</p><p>학생: ${l.student_names}</p><hr>
      <h3>우리의 약속</h3>
      <div style="min-height:250px;white-space:pre-wrap;">${l.c4}</div>
      <p style="text-align:center;margin-top:40px;">성실히 이행할 것을 서약합니다.</p>
      <p style="text-align:right;">${new Date().toLocaleDateString()}</p>
      <p style="text-align:right;">학생(서명) __________ / 교사 (인)</p>
      <script>window.print();<\/script></body></html>`);
    win.document.close();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-blue-600 mb-6 pb-3 border-b-2 border-blue-50">
          상담 기록 관리
        </h2>

        <div className="flex gap-2 mb-4">
          <select
            value={gradeFilter}
            onChange={(e) => setGradeFilter(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="">학년</option>
            <option value="1">1학년</option>
            <option value="2">2학년</option>
            <option value="3">3학년</option>
          </select>
          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="">반</option>
            {Array.from({ length: 15 }, (_, i) => (
              <option key={i + 1} value={String(i + 1)}>
                {i + 1}반
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="학생 이름 검색"
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-blue-50 text-blue-600">
                <th className="text-left p-3 text-sm border-b-2 border-gray-200">일시</th>
                <th className="text-left p-3 text-sm border-b-2 border-gray-200">상담교사</th>
                <th className="text-left p-3 text-sm border-b-2 border-gray-200">학생</th>
                <th className="text-left p-3 text-sm border-b-2 border-gray-200">모드</th>
                <th className="text-left p-3 text-sm border-b-2 border-gray-200">관리</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-400">
                    데이터 없음
                  </td>
                </tr>
              ) : (
                filtered.map((l) => (
                  <tr key={l.id} className="border-b border-gray-100">
                    <td className="p-3 text-xs">
                      {new Date(l.created_at).toLocaleString("ko-KR")}
                    </td>
                    <td className="p-3 text-sm">{l.teacher}</td>
                    <td className="p-3 text-sm">{l.student_names}</td>
                    <td className="p-3 text-sm">{l.mode}</td>
                    <td className="p-3">
                      <div className="flex gap-1">
                        <button
                          onClick={() => setViewLog(l)}
                          className="px-2 py-1 text-xs border border-gray-300 rounded bg-white hover:bg-gray-50"
                        >
                          조회
                        </button>
                        <button
                          onClick={() => printReport(l)}
                          className="px-2 py-1 text-xs border border-gray-300 rounded bg-white hover:bg-gray-50"
                        >
                          출력
                        </button>
                        <button
                          onClick={() => handleDelete(l.id)}
                          className="px-2 py-1 text-xs border border-red-200 rounded bg-white text-red-600 hover:bg-red-50"
                        >
                          삭제
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 상세 조회 모달 */}
      {viewLog && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[80vh] overflow-y-auto p-6">
            <h3 className="text-lg font-bold text-blue-600 mb-4">상담 상세 조회</h3>
            <div className="bg-gray-50 p-3 rounded-lg mb-3 border border-gray-200">
              <b>학생:</b> {viewLog.student_names}
            </div>
            <div className="bg-gray-50 p-3 rounded-lg mb-3 border border-gray-200">
              <b>{viewLog.mode === "회복적" ? "1. 사건 요약" : "상담 내용"}:</b>
              <p className="mt-1 whitespace-pre-wrap">{viewLog.c1}</p>
            </div>
            {viewLog.mode === "회복적" && (
              <>
                <div className="bg-gray-50 p-3 rounded-lg mb-3 border border-gray-200">
                  <b>2. 감정과 생각:</b>
                  <p className="mt-1 whitespace-pre-wrap">{viewLog.c2}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg mb-3 border border-gray-200">
                  <b>3. 회복 방안:</b>
                  <p className="mt-1 whitespace-pre-wrap">{viewLog.c3}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg mb-3 border border-gray-200">
                  <b>4. 합의/약속:</b>
                  <p className="mt-1 whitespace-pre-wrap">{viewLog.c4}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg mb-3 border border-gray-200">
                  <b>5. 상담자 의견:</b>
                  <p className="mt-1 whitespace-pre-wrap">{viewLog.c5}</p>
                </div>
                <button
                  onClick={() => printPledge(viewLog)}
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-bold mb-2 hover:bg-green-700"
                >
                  서약서 출력
                </button>
              </>
            )}
            <button
              onClick={() => setViewLog(null)}
              className="w-full border border-gray-300 py-3 rounded-lg font-medium hover:bg-gray-50"
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
