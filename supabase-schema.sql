-- =============================================
-- 마주봄 통합 시스템 Supabase 스키마
-- =============================================

-- 1. 학생 테이블
CREATE TABLE students (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  grade SMALLINT NOT NULL,        -- 학년 (1,2,3)
  class SMALLINT NOT NULL,        -- 반 (1~15)
  number SMALLINT NOT NULL,       -- 번호
  name TEXT NOT NULL,
  student_id TEXT UNIQUE,         -- 학번 (예: "10101")
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_students_grade_class ON students(grade, class);

-- 2. 상담 기록 테이블
CREATE TABLE counseling_logs (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  teacher TEXT NOT NULL,
  student_names TEXT NOT NULL,    -- 쉼표 구분 학생 표시
  mode TEXT NOT NULL DEFAULT '일반',  -- '일반' or '회복적'
  c1 TEXT DEFAULT '',             -- 상담내용/사건요약
  c2 TEXT DEFAULT '',             -- 감정과 생각
  c3 TEXT DEFAULT '',             -- 회복 방안
  c4 TEXT DEFAULT '',             -- 합의/약속
  c5 TEXT DEFAULT '',             -- 상담자 의견
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. 성찰문 파일 기록
CREATE TABLE reflections (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  student_id BIGINT REFERENCES students(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,        -- Supabase Storage 경로
  file_url TEXT,                  -- 공개 URL
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_reflections_student ON reflections(student_id);

-- 4. 지도 기록
CREATE TABLE guidance_notes (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  student_id BIGINT REFERENCES students(id) ON DELETE CASCADE,
  student_name TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_guidance_student ON guidance_notes(student_id);

-- 5. Supabase Storage 버킷 (SQL로 생성 불가 - 대시보드에서 생성)
-- 버킷 이름: reflections
-- 공개 접근: true

-- 6. RLS (Row Level Security) - 필요 시 활성화
-- 현재는 비활성화 상태로 시작 (교사용 내부 시스템)
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE counseling_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE reflections ENABLE ROW LEVEL SECURITY;
ALTER TABLE guidance_notes ENABLE ROW LEVEL SECURITY;

-- 모든 접근 허용 정책 (내부 시스템용)
CREATE POLICY "Allow all" ON students FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON counseling_logs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON reflections FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON guidance_notes FOR ALL USING (true) WITH CHECK (true);
