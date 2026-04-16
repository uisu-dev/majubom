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
    if (!students.length) {
      setLoaded(false);
      return;
    }

    const student = students[0];
    setLoading(true);

    const [filesRes, notesRes] = await Promise.all([
      supabase
        .from("reflections")
        .select("*")
        .eq("student_id", student.id)
        .order("created_at", { ascending: false }),
      supabase
        .from("guidance_notes")
        .select("*")
        .eq("student_id", student.id)
        .order("created_at", { ascending: false }),
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

    if (error) {
      alert("저장 실패: " + error.message);
    } else {
      setNoteInput("");
      loadDetails(selectedStudents);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-blue-600 mb-6 pb-3 border-b-2 border-blue-50">
          조회 및 지도
        </h2>

        <div className="mb-5">
          <label className="block font-bold text-blue-600 mb-2 text-sm">
            학생 조회
          </label>
          <StudentSelector
            multiple={false}
            selected={selectedStudents}
            onSelect={loadDetails}
          />
        </div>

        {loading && (
          <div className="text-center py-4 text-blue-600 font-bold">
            불러오는 중...
          </div>
        )}

        {loaded && !loading && (
          <>
            {/* 제출 내역 */}
            <div className="mt-6">
              <h3 className="text-base font-bold mb-3 pb-2 border-b-2 border-gray-200">
                제출 내역
              </h3>
              {files.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-4">내역 없음</p>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {files.map((f) => (
                    <li key={f.id} className="flex items-center justify-between py-3">
                      <div>
                        <span className="text-xs text-gray-400">
                          {new Date(f.created_at).toLocaleString("ko-KR")}
                        </span>
                        <br />
                        <a
                          href={f.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-bold text-sm text-gray-900 hover:text-blue-600"
                        >
                          {f.file_name}
                        </a>
                      </div>
                      <button
                        onClick={() => handleDelete(f)}
                        className="px-2 py-1 text-xs border border-red-300 text-red-600 rounded hover:bg-red-50"
                      >
                        삭제
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* 지도 일지 */}
            <div className="mt-8 pt-5 border-t-2 border-gray-100">
              <h3 className="text-base font-bold mb-3">지도 일지</h3>
              <div className="flex gap-2 mb-3">
                <textarea
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  placeholder="지도 내용 입력..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none h-16"
                />
                <button
                  onClick={saveNote}
                  className="px-4 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 shrink-0"
                >
                  저장
                </button>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 max-h-40 overflow-y-auto">
                {notes.length === 0 ? (
                  <p className="text-gray-400 text-sm text-center">기록 없음</p>
                ) : (
                  notes.map((n) => (
                    <div
                      key={n.id}
                      className="border-b border-gray-200 py-2 text-sm last:border-0"
                    >
                      <span className="text-blue-600 font-bold">
                        [{new Date(n.created_at).toLocaleString("ko-KR")}]
                      </span>{" "}
                      {n.content}
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
