// lib/utils/exam.ts

import { Chapter, Section, TimeMode, ExamMode, QuestionType } from "./exam";

/**
 * Calculate total questions from selected chapters
 */
export const calculateTotalQuestions = (
  chapters: Chapter[],
  selectedChapterIds: number[]
): number => {
  return chapters
    .filter((chapter) => selectedChapterIds.includes(chapter.id))
    .reduce((total, chapter) => total + chapter.questions_count, 0);
};

/**
 * Format time mode display text
 */
export const formatTimeMode = (timeMode: TimeMode): string => {
  const timeMap: Record<TimeMode, string> = {
    timed_1min: "1 minute per question",
    timed_90sec: "90 seconds per question",
    untimed: "No time limit",
  };
  return timeMap[timeMode];
};

/**
 * Format exam mode display text
 */
export const formatExamMode = (mode: ExamMode): string => {
  const modeMap: Record<ExamMode, string> = {
    test: "Test Mode",
    tutor: "Tutor Mode",
  };
  return modeMap[mode];
};

/**
 * Format question type display text
 */
export const formatQuestionType = (type: QuestionType): string => {
  const typeMap: Record<QuestionType, string> = {
    all: "All Questions",
    incorrect: "Incorrect Questions",
    flagged: "Flagged Questions",
    unused: "Unused Questions",
  };
  return typeMap[type];
};

/**
 * Check if section selection is required for question type
 */
export const requiresSectionSelection = (
  questionType: QuestionType
): boolean => {
  return ["incorrect", "flagged", "unused"].includes(questionType);
};

/**
 * Validate questions number against available questions
 */
export const validateQuestionsNumber = (
  requested: number,
  available: number
): { isValid: boolean; message?: string } => {
  if (requested < 1) {
    return { isValid: false, message: "At least 1 question is required" };
  }

  if (available === 0) {
    return {
      isValid: false,
      message: "No questions available for selected criteria",
    };
  }

  if (requested > available) {
    return {
      isValid: false,
      message: `Maximum ${available} questions available for selected criteria`,
    };
  }

  return { isValid: true };
};

/**
 * Generate exam summary for confirmation
 */
export const generateExamSummary = (data: {
  name: string;
  mode: ExamMode;
  questionsNumber: number;
  timeMode: TimeMode;
  questionType: QuestionType;
  section?: Section;
  selectedChapters?: Chapter[];
  chaptersType: "all" | "specific";
}): string[] => {
  const summary: string[] = [
    `Exam Name: ${data.name}`,
    `Mode: ${formatExamMode(data.mode)}`,
    `Questions: ${data.questionsNumber}`,
    `Time: ${formatTimeMode(data.timeMode)}`,
    `Question Type: ${formatQuestionType(data.questionType)}`,
  ];

  if (data.section) {
    summary.push(`Section: ${data.section.title}`);
  }

  if (data.chaptersType === "specific" && data.selectedChapters) {
    summary.push(`Chapters: ${data.selectedChapters.length} selected`);
  } else if (data.chaptersType === "all") {
    summary.push("Chapters: All chapters");
  }

  return summary;
};

/**
 * Debounce function for search/filter operations
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(null, args), wait);
  };
};

/**
 * Format error message for display
 */
export const formatErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  if (typeof error === "object" && error !== null) {
    const errorObj = error as any;

    // Handle API error format
    if (errorObj.message) {
      return errorObj.message;
    }

    // Handle validation errors
    if (errorObj.errors && Array.isArray(errorObj.errors)) {
      return errorObj.errors.join(", ");
    }
  }

  return "An unexpected error occurred";
};
