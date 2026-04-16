"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { Student } from "@/lib/types";

interface Props {
  multiple?: boolean;
  selected: Student[];
  onSelect: (students: Student[]) => void;
}

export default function StudentSelector({ multiple = true, selected, onSelect }: Props) {
  const [students, setStudents] = useState<Student[]>([]);
  const [grade, setGrade] = useState("");
  const [cls, setCls] = useState("");
  const [nameSearch, setNameSearch] = useState("");

  useEffect(() => {
    supabase
      .from("students")
      .select("*")
      .order("grade")
      .order("class")
      .order("number")
      .then(({ data }) => {
        if (data) setStudents(data as Student[]);
      });
  }, []);

  const filtered = students.filter((s) => {
    if (grade && String(s.grade) !== grade) return false;
    if (cls && String(s.class) !== cls) return false;
    if (nameSearch && !s.name.includes(nameSearch)) return false;
    if (!grade && !cls && !nameSearch) return false;
    return true;
  });

  const toggleStudent = (student: Student) => {
    if (!multiple) {
      onSelect([student]);
      return;
    }
    const exists = selected.find((s) => s.id === student.id);
    if (exists) {
      onSelect(selected.filter((s) => s.id !== student.id));
    } else {
      onSelect([...selected, student]);
    }
  };

  return (
    <div>
      <div className="flex gap-2 mb-2">
        <select
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
          className="flex-1 px-3 py-2.5 border border-border rounded-[8px] text-[14px] bg-surface-card text-text-primary min-h-[44px]"
        >
          <option value="">학년</option>
          <option value="1">1학년</option>
          <option value="2">2학년</option>
          <option value="3">3학년</option>
        </select>
        <select
          value={cls}
          onChange={(e) => setCls(e.target.value)}
          className="flex-1 px-3 py-2.5 border border-border rounded-[8px] text-[14px] bg-surface-card text-text-primary min-h-[44px]"
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
          placeholder="이름 검색"
          value={nameSearch}
          onChange={(e) => setNameSearch(e.target.value)}
          className="flex-1 px-3 py-2.5 border border-border rounded-[8px] text-[14px] bg-surface-card text-text-primary placeholder:text-text-disabled min-h-[44px]"
        />
      </div>

      <div className="h-48 overflow-y-auto border border-border rounded-[8px] bg-surface-card">
        {filtered.length === 0 ? (
          <div className="text-text-disabled text-center mt-16 text-[13px]">
            학년/반을 선택하거나 이름을 검색하세요.
          </div>
        ) : (
          filtered.map((s) => {
            const isChecked = selected.some((sel) => sel.id === s.id);
            return (
              <label
                key={s.id}
                className="flex items-center px-4 py-2.5 border-b border-border cursor-pointer hover:bg-surface-subtle min-h-[44px]"
              >
                <input
                  type={multiple ? "checkbox" : "radio"}
                  checked={isChecked}
                  onChange={() => toggleStudent(s)}
                  className="w-4 h-4 mr-4 shrink-0 accent-[var(--brand)]"
                />
                <span className="w-24 text-[13px] font-medium text-text-tertiary shrink-0">
                  {s.grade}-{s.class} {s.number}번
                </span>
                <span className="text-[14px] text-text-primary">{s.name}</span>
              </label>
            );
          })
        )}
      </div>

      {selected.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {selected.map((s) => (
            <span
              key={s.id}
              className="inline-flex items-center gap-1 bg-brand-tint text-brand text-[11px] font-medium px-2.5 py-1 rounded-full"
            >
              {s.grade}-{s.class} {s.name}
              <button
                onClick={() => onSelect(selected.filter((x) => x.id !== s.id))}
                className="hover:opacity-70 ml-0.5"
              >
                &times;
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
