// types/exam.ts

export interface Section {
  id: number;
  title: string;
  slug: string;
  questions_count: number;
}

export interface Chapter {
  id: number;
  title: string;
  slug: string;
  questions_count: number;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

export type ExamMode = "test" | "tutor";

export type TimeMode = "timed_1min" | "timed_90sec" | "untimed";

export type QuestionType = "all" | "incorrect" | "flagged" | "unused";

export type ChapterType = "all" | "specific";

export interface CreateExamFormData {
  name: string;
  mode: ExamMode;
  questions_number: number;
  time_mode: TimeMode;
  question_type: QuestionType;
  section_id?: number;
  chapters_type: ChapterType;
  chapters: number[];
}

export interface CreateExamPayload
  extends Omit<CreateExamFormData, "chapters"> {
  [key: `chapters[${number}]`]: number;
}

export const EXAM_MODE_OPTIONS = [
  { value: "test" as const, label: "Test" },
  { value: "tutor" as const, label: "Tutor" },
];

export const TIME_MODE_OPTIONS = [
  { value: "timed_1min" as const, label: "Timed (1 min per question)" },
  { value: "timed_90sec" as const, label: "Timed (90 sec per question)" },
  { value: "untimed" as const, label: "Untimed" },
];

export const QUESTION_TYPE_OPTIONS = [
  { value: "all" as const, label: "All" },
  { value: "incorrect" as const, label: "Incorrect" },
  { value: "flagged" as const, label: "Flagged" },
  { value: "unused" as const, label: "Unused" },
];

export const CHAPTER_TYPE_OPTIONS = [
  { value: "all" as const, label: "All Chapters" },
  { value: "specific" as const, label: "Specific Chapters" },
];
