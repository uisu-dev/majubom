import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  const { id, filePath } = await request.json();

  await supabase.storage.from("reflections").remove([filePath]);

  const { error } = await supabase.from("reflections").delete().eq("id", id);

  if (error) {
    return NextResponse.json(
      { success: false, message: "삭제 실패: " + error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, message: "파일이 삭제되었습니다." });
}
