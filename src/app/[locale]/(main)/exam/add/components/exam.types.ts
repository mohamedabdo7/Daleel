// types/exam.types.ts - UPDATED with Check Result Types

export type ExamMode = "test" | "tutor";
export type TimeMode = "timed" | "timed90" | "untimed";
export type QuestionStatus =
  | "unanswered"
  | "answered"
  | "correct"
  | "incorrect"
  | "flagged"
  | "skipped"
  | "locked"
  | "checked"; // NEW: For tutor mode after answer check

// NEW: Check Result Interface
export interface QuestionCheckResult {
  isCorrect: boolean;
  correctAnswer: string;
  userAnswer: string;
  isChecked: boolean;
}

// API Response Types
export interface ExamResponse {
  data: {
    id: string;
    name: string;
    mode: ExamMode;
    question_type: string;
    time_mode: TimeMode;
    attempted: number;
    remaining: number;
    questions_number: string;
    flag_count: number;
    start_date?: string;
    finish_date?: string | null;
    score: number;
    correct: number;
    is_retake: boolean | string;
    status: string;
    is_opened: boolean;
    current_question: QuestionDetails;
    questions: QuestionSummary[];
    flagged: QuestionSummary[];
    not_attempted: QuestionSummary[];
  };
  status: number;
  message: string;
}

export interface QuestionDetails {
  id: string;
  desc: string;
  section: {
    id: number;
    title: string;
    slug: string;
  };
  chapter: {
    id: number;
    title: string;
    slug: string;
  };
  is_flagged: boolean;
  explain: string;
  answer_id: string | null;
  remaining?: string;
  correct_answer?: string | null;
  answers: QuestionAnswer[];
}

export interface QuestionSummary {
  id: string;
  desc: string;
  section: {
    id: number;
    title: string;
    slug: string;
  };
  chapter: {
    id: number;
    title: string;
    slug: string;
  };
  explain: string;
  answer_id: string | null;
  is_flagged: boolean;
}

export interface QuestionAnswer {
  id: string;
  answer: string;
}

export interface SubmitQuestionResponse {
  data: QuestionDetails;
  status: number;
  message: string;
}

export interface SubmitExamResponse {
  data: {
    id: string;
    name: string;
    mode: ExamMode;
    question_type: string;
    time_mode: TimeMode;
    attempted: number;
    questions_number: string;
    flag_count: string;
    start_date: string;
    finish_date: string;
    score: number;
    correct: number;
    chapters: Array<{
      id: number;
      title: string;
      questions_count: string;
    }>;
    is_retake: string;
    remaining: number;
  };
  status: number;
  message: string;
}

// Internal State Types
export interface ExamState {
  // Exam Info
  examId: string | null;
  examData: ExamResponse["data"] | null;

  // Current Question
  currentQuestionIndex: number;
  currentQuestion: QuestionDetails | null;

  // Questions Management
  questionsIds: string[];
  questionsStatus: Record<string, QuestionStatus>;
  questionsAnswers: Record<string, string>; // question_id -> answer_id

  // NEW: Check Results for Tutor Mode
  questionsCheckResults: Record<string, QuestionCheckResult>;

  // Timer
  timePerQuestion: number; // in seconds
  remainingTime: number;
  isTimerActive: boolean;

  // UI State
  isLoading: boolean;
  isSubmitting: boolean;
  isChecking: boolean; // NEW: For check answer loading state
  error: string | null;

  // Exam Controls
  isPaused: boolean;
  isFinished: boolean;
}

// Timer Configuration
export const TIMER_CONFIG: Record<TimeMode, number> = {
  timed: 60, // 60 seconds
  timed90: 90, // 90 seconds
  untimed: 0, // No timer
};

// Question Status Colors for UI - UPDATED
export const STATUS_STYLES: Record<QuestionStatus, string> = {
  unanswered: "bg-gray-100 border-gray-300 text-gray-600",
  answered: "bg-blue-100 border-blue-300 text-blue-700",
  correct: "bg-green-100 border-green-300 text-green-700",
  incorrect: "bg-red-100 border-red-300 text-red-700",
  flagged: "bg-yellow-100 border-yellow-300 text-yellow-700",
  skipped: "bg-orange-100 border-orange-300 text-orange-600",
  locked: "bg-gray-200 border-gray-400 text-gray-500",
  checked: "bg-blue-50 border-blue-200 text-blue-600", // NEW
};

// // types/exam.types.ts

// export type ExamMode = "test" | "tutor";
// export type TimeMode = "timed" | "timed90" | "untimed";
// export type QuestionStatus =
//   | "unanswered"
//   | "answered"
//   | "correct"
//   | "incorrect"
//   | "flagged"
//   | "skipped"
//   | "locked";

// // API Response Types
// export interface ExamResponse {
//   data: {
//     id: string;
//     name: string;
//     mode: ExamMode;
//     question_type: string;
//     time_mode: TimeMode;
//     attempted: number;
//     remaining: number;
//     questions_number: string;
//     flag_count: number;
//     start_date?: string;
//     finish_date?: string | null;
//     score: number;
//     correct: number;
//     is_retake: boolean | string;
//     status: string;
//     is_opened: boolean;
//     current_question: QuestionDetails;
//     questions: QuestionSummary[];
//     flagged: QuestionSummary[];
//     not_attempted: QuestionSummary[];
//   };
//   status: number;
//   message: string;
// }

// export interface QuestionDetails {
//   id: string;
//   desc: string;
//   section: {
//     id: number;
//     title: string;
//     slug: string;
//   };
//   chapter: {
//     id: number;
//     title: string;
//     slug: string;
//   };
//   is_flagged: boolean;
//   explain: string;
//   answer_id: string | null;
//   remaining?: string;
//   correct_answer?: string | null;
//   answers: QuestionAnswer[];
// }

// export interface QuestionSummary {
//   id: string;
//   desc: string;
//   section: {
//     id: number;
//     title: string;
//     slug: string;
//   };
//   chapter: {
//     id: number;
//     title: string;
//     slug: string;
//   };
//   explain: string;
//   answer_id: string | null;
//   is_flagged: boolean;
// }

// export interface QuestionAnswer {
//   id: string;
//   answer: string;
// }

// export interface SubmitQuestionResponse {
//   data: QuestionDetails;
//   status: number;
//   message: string;
// }

// export interface SubmitExamResponse {
//   data: {
//     id: string;
//     name: string;
//     mode: ExamMode;
//     question_type: string;
//     time_mode: TimeMode;
//     attempted: number;
//     questions_number: string;
//     flag_count: string;
//     start_date: string;
//     finish_date: string;
//     score: number;
//     correct: number;
//     chapters: Array<{
//       id: number;
//       title: string;
//       questions_count: string;
//     }>;
//     is_retake: string;
//     remaining: number;
//   };
//   status: number;
//   message: string;
// }

// // Internal State Types
// export interface ExamState {
//   // Exam Info
//   examId: string | null;
//   examData: ExamResponse["data"] | null;

//   // Current Question
//   currentQuestionIndex: number;
//   currentQuestion: QuestionDetails | null;

//   // Questions Management
//   questionsIds: string[];
//   questionsStatus: Record<string, QuestionStatus>;
//   questionsAnswers: Record<string, string>; // question_id -> answer_id

//   // Timer
//   timePerQuestion: number; // in seconds
//   remainingTime: number;
//   isTimerActive: boolean;

//   // UI State
//   isLoading: boolean;
//   isSubmitting: boolean;
//   error: string | null;

//   // Exam Controls
//   isPaused: boolean;
//   isFinished: boolean;
// }

// // Timer Configuration
// export const TIMER_CONFIG: Record<TimeMode, number> = {
//   timed: 60, // 60 seconds
//   timed90: 90, // 90 seconds
//   untimed: 0, // No timer
// };

// // Question Status Colors for UI
// export const STATUS_STYLES: Record<QuestionStatus, string> = {
//   unanswered: "bg-gray-100 border-gray-300 text-gray-600",
//   answered: "bg-blue-100 border-blue-300 text-blue-700",
//   correct: "bg-green-100 border-green-300 text-green-700",
//   incorrect: "bg-red-100 border-red-300 text-red-700",
//   flagged: "bg-yellow-100 border-yellow-300 text-yellow-700",
//   skipped: "bg-orange-100 border-orange-300 text-orange-600",
//   locked: "bg-gray-200 border-gray-400 text-gray-500",
// };
