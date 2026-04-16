export interface Student {
  id: number;
  grade: number;
  class: number;
  number: number;
  name: string;
  student_id: string;
}

export interface CounselingLog {
  id: number;
  teacher: string;
  student_names: string;
  mode: string;
  c1: string;
  c2: string;
  c3: string;
  c4: string;
  c5: string;
  created_at: string;
  updated_at: string;
}

export interface Reflection {
  id: number;
  student_id: number;
  file_name: string;
  file_path: string;
  file_url: string;
  created_at: string;
}

export interface GuidanceNote {
  id: number;
  student_id: number;
  student_name: string;
  content: string;
  created_at: string;
}

export interface StudentStats {
  id: number;
  grade: number;
  class: number;
  number: number;
  name: string;
  student_id: string;
  count: number;
}
