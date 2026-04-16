"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import type { StudentStats } from "@/lib/types";

export default function StatsPage() {
  const [stats, setStats] = useState<StudentStats[]>([]);
  const [gradeFilter, setGradeFilter] = useState("all");
  const [classFilter, setClassFilter] = useState("all");
  const [nameFilter, setNameFilter] = useState("");
  const [loading, setLoading] = useState(true);

  const loadStats = useCallback(async () => {
    setLoading(true);
    const { data: students } = await supabase
      .from("students").select("*").order("grade").order("class").order("number");
    const { data: reflections } = await supabase
      .from("reflections").select("student_id");

    const countMap: Record<number, number> = {};
    reflections?.forEach((r: { student_id: number }) => {
      countMap[r.student_id] = (countMap[r.student_id] || 0) + 1;
    });

    const result: StudentStats[] = (students || []).map((s) => ({
      ...s, count: countMap[s.id] || 0,
    }));
    setStats(result);
    setLoading(false);
  }, []);

  useEffect(() => { loadStats(); }, [loadStats]);

  const filtered = stats.filter((s) => {
    if (gradeFilter !== "all" && String(s.grade) !== gradeFilter) return false;
    if (classFilter !== "all" && String(s.class) !== classFilter) return false;
    if (nameFilter && !s.name.includes(nameFilter)) return false;
    return true;
  });

  const filterClass = "flex-1 px-3 py-2.5 border border-border rounded-[8px] text-[14px] bg-surface-card text-text-primary min-h-[44px]";

  return (
    <div className="max-w-xl mx-auto px-6 py-8 space-y-6">
      <div className="bg-surface-card rounded-[12px] shadow-card p-6">
        <h2 className="text-[18px] font-bold text-text-primary mb-6 pb-3 border-b border-border">
          통계 현황
        </h2>

        <div className="mb-4">
          <label className="block text-[13px] font-semibold text-text-secondary mb-2">
            필터 검색
          </label>
          <div className="flex gap-2 mb-2">
            <select value={gradeFilter} onChange={(e) => setGradeFilter(e.target.value)} className={filterClass}>
              <option value="all">전체 학년</option>
              <option value="1">1학년</option>
              <option value="2">2학년</option>
              <option value="3">3학년</option>
            </select>
            <select value={classFilter} onChange={(e) => setClassFilter(e.target.value)} className={filterClass}>
              <option value="all">전체 반</option>
              {Array.from({ length: 15 }, (_, i) => (
                <option key={i + 1} value={String(i + 1)}>{i + 1}반</option>
              ))}
            </select>
          </div>
          <input
            type="text"
            placeholder="이름 검색..."
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
            className="w-full px-3 py-2.5 border border-border rounded-[8px] text-[14px] bg-surface-card text-text-primary placeholder:text-text-disabled min-h-[44px]"
          />
        </div>

        {loading ? (
          <div className="text-center py-8 text-brand text-[14px] font-bold">
            통계 데이터를 분석 중...
          </div>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="bg-surface-subtle text-text-tertiary p-3 text-[12px] font-semibold text-center uppercase border-b border-border">학반</th>
                <th className="bg-surface-subtle text-text-tertiary p-3 text-[12px] font-semibold text-center uppercase border-b border-border">이름</th>
                <th className="bg-surface-subtle text-text-tertiary p-3 text-[12px] font-semibold text-center uppercase border-b border-border">제출수</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center py-8 text-text-disabled text-[13px]">
                    검색 결과가 없습니다.
                  </td>
                </tr>
              ) : (
                filtered.map((s) => (
                  <tr key={s.id} className="border-b border-border hover:bg-surface-subtle transition-colors">
                    <td className="p-3 text-[13px] text-text-secondary text-center">
                      {s.grade}-{s.class} ({s.number}번)
                    </td>
                    <td className="p-3 text-[14px] text-text-primary text-center font-medium">{s.name}</td>
                    <td className={`p-3 text-[14px] text-center font-medium ${
                      s.count >= 3 ? "text-destructive font-bold" : s.count === 0 ? "text-text-disabled" : "text-text-primary"
                    }`}>
                      {s.count}건
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
