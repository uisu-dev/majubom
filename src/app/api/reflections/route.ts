import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("file") as File;
  const studentId = formData.get("studentId") as string;
  const studentName = formData.get("studentName") as string;

  if (!file || !studentId) {
    return NextResponse.json(
      { success: false, message: "필수 항목이 누락되었습니다." },
      { status: 400 }
    );
  }

  const timestamp = Date.now();
  const filePath = `reflections/${studentId}/${timestamp}_${file.name}`;

  const { error: uploadError } = await supabase.storage
    .from("reflections")
    .upload(filePath, file);

  if (uploadError) {
    return NextResponse.json(
      { success: false, message: "파일 업로드 실패: " + uploadError.message },
      { status: 500 }
    );
  }

  const { data: urlData } = supabase.storage
    .from("reflections")
    .getPublicUrl(filePath);

  const { error: dbError } = await supabase.from("reflections").insert({
    student_id: Number(studentId),
    file_name: file.name,
    file_path: filePath,
    file_url: urlData.publicUrl,
  });

  if (dbError) {
    return NextResponse.json(
      { success: false, message: "DB 저장 실패: " + dbError.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    message: `${studentName} 학생 성찰문 등록 완료!`,
  });
}
