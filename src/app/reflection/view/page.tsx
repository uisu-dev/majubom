"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import StudentSelector from "@/components/StudentSelector";
import type { Student, Reflection, GuidanceNote } from "@/lib/types";

export default function ReflectionViewPage() {
  const [selectedStudents, setSelectedStudents] = useState<Student[]>([]);
  const [files, setFiles] = useState<Reflection[]>([]);
  const [notes, setNotes] = useState<GuidanceNote[]>([]);
  const [noteInput, setNoteInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const loadDetails = async (students: Student[]) => {
    setSelectedStudents(students);
    if (!students.length) { setLoaded(false); return; }

    const student = students[0];
    setLoading(true);

    const [filesRes, notesRes] = await Promise.all([
      supabase.from("reflections").select("*").eq("student_id", student.id).order("created_at", { ascending: false }),
      supabase.from("guidance_notes").select("*").eq("student_id", student.id).order("created_at", { ascending: false }),
    ]);

    setFiles((filesRes.data || []) as Reflection[]);
    setNotes((notesRes.data || []) as GuidanceNote[]);
    setLoading(false);
    setLoaded(true);
  };

  const handleDelete = async (reflection: Reflection) => {
    if (!confirm("삭제하시겠습니까?")) return;
    const res = await fetch("/api/reflections/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: reflection.id, filePath: reflection.file_path }),
    });
    const result = await res.json();
    alert(result.message);
    if (result.success) loadDetails(selectedStudents);
  };

  const saveNote = async () => {
    if (!noteInput.trim() || !selectedStudents.length) return alert("내용 입력 필요");
    const student = selectedStudents[0];
    const { error } = await supabase.from("guidance_notes").insert({
      student_id: student.id,
      student_name: student.name,
      content: noteInput,
    });
    if (error) { alert("저장 실패: " + error.message); }
    else { setNoteInput(""); loadDetails(selectedStudents); }
  };

  return (
    <div className="max-w-xl mx-auto px-6 py-8 space-y-6">
      <div className="bg-surface-card rounded-[12px] shadow-card p-6">
        <h2 className="text-[18px] font-bold text-text-primary mb-6 pb-3 border-b border-border">
          조회 및 지도
        </h2>

        <div className="mb-5">
          <label className="block text-[13px] font-semibold text-text-secondary mb-2">
            학생 조회
          </label>
          <StudentSelector multiple={false} selected={selectedStudents} onSelect={loadDetails} />
        </div>

        {loading && (
          <div className="text-center py-4 text-brand text-[14px] font-bold">불러오는 중...</div>
        )}

        {loaded && !loading && (
          <>
            {/* 제출 내역 */}
            <div className="mt-6">
              <h3 className="text-[15px] font-bold text-text-primary mb-3 pb-2 border-b border-border">
                제출 내역
              </h3>
              {files.length === 0 ? (
                <p className="text-text-disabled text-[13px] text-center py-4">내역 없음</p>
              ) : (
                <ul className="divide-y divide-border">
                  {files.map((f) => (
                    <li key={f.id} className="flex items-center justify-between py-3">
                      <div>
                        <span className="text-[11px] text-text-disabled">
                          {new Date(f.created_at).toLocaleString("ko-KR")}
                        </span>
                        <br />
                        <a
                          href={f.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[14px] font-bold text-text-primary hover:text-brand transition-colors"
                        >
                          {f.file_name}
                        </a>
                      </div>
                      <button
                        onClick={() => handleDelete(f)}
                        className="px-2.5 py-1.5 text-[12px] font-medium border border-destructive-tint text-destructive rounded-[4px] hover:bg-destructive-tint min-h-[32px]"
                      >
                        삭제
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* 지도 일지 */}
            <div className="mt-8 pt-5 border-t border-border">
              <h3 className="text-[15px] font-bold text-text-primary mb-3">지도 일지</h3>
              <div className="flex gap-2 mb-3">
                <textarea
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  placeholder="지도 내용 입력..."
                  className="flex-1 px-3 py-2.5 border border-border rounded-[8px] text-[14px] bg-surface-card text-text-primary placeholder:text-text-disabled resize-none h-16"
                />
                <button
                  onClick={saveNote}
                  className="px-4 bg-success text-white rounded-[8px] text-[13px] font-bold hover:opacity-90 shrink-0 min-h-[44px]"
                >
                  저장
                </button>
              </div>
              <div className="bg-surface-subtle rounded-[8px] p-3 max-h-40 overflow-y-auto">
                {notes.length === 0 ? (
                  <p className="text-text-disabled text-[13px] text-center">기록 없음</p>
                ) : (
                  notes.map((n) => (
                    <div key={n.id} className="border-b border-border py-2 text-[13px] last:border-0">
                      <span className="text-brand font-bold">
                        [{new Date(n.created_at).toLocaleString("ko-KR")}]
                      </span>{" "}
                      <span className="text-text-primary">{n.content}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
