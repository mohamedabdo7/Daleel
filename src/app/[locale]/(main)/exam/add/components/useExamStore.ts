// stores/useExamStore.ts - DEBUG AND FIXED VERSION

import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import {
  ExamState,
  QuestionStatus,
  ExamResponse,
  QuestionDetails,
  TIMER_CONFIG,
} from "./exam.types";

interface ExamActions {
  // Exam Initialization
  initializeExam: (examData: ExamResponse["data"]) => void;
  resetExam: () => void;

  // Question Navigation
  setCurrentQuestion: (question: QuestionDetails) => void;
  navigateToQuestion: (index: number) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;

  // Answer Management
  selectAnswer: (answerId: string) => void;
  flagQuestion: (questionId?: string) => void;
  markQuestionAsSubmitted: (questionId: string, isCorrect?: boolean) => void;

  // Timer Management
  startTimer: () => void;
  pauseTimer: () => void;
  stopTimer: () => void;
  updateRemainingTime: (time: number) => void;
  resetTimer: () => void;

  // Exam Controls
  pauseExam: () => void;
  resumeExam: () => void;
  finishExam: () => void;

  // UI State
  setLoading: (loading: boolean) => void;
  setSubmitting: (submitting: boolean) => void;
  setError: (error: string | null) => void;
}

const initialState: ExamState = {
  examId: null,
  examData: null,
  currentQuestionIndex: 0,
  currentQuestion: null,
  questionsIds: [],
  questionsStatus: {},
  questionsAnswers: {},
  timePerQuestion: 0,
  remainingTime: 0,
  isTimerActive: false,
  isLoading: false,
  isSubmitting: false,
  error: null,
  isPaused: false,
  isFinished: false,
};

export const useExamStore = create<ExamState & ExamActions>()(
  subscribeWithSelector((set, get) => ({
    ...initialState,

    initializeExam: (examData) => {
      console.log("🟢 [STORE] Initializing exam store with:", {
        id: examData.id,
        mode: examData.mode,
        time_mode: examData.time_mode,
        questions_count: examData.questions?.length,
        current_question_id: examData.current_question?.id,
      });

      const timePerQuestion = TIMER_CONFIG[examData.time_mode] || 0;

      // Extract question IDs from the questions array
      const questionsIds = examData.questions?.map((q) => q.id) || [];

      console.log("🟢 [STORE] Questions IDs:", questionsIds);

      // Initialize questions status - START FRESH
      const questionsStatus: Record<string, QuestionStatus> = {};
      const questionsAnswers: Record<string, string> = {};

      questionsIds.forEach((id) => {
        const question = examData.questions?.find((q) => q.id === id);

        // Initialize as unanswered by default
        questionsStatus[id] = "unanswered";

        // Only set as answered if there's actually a saved answer
        if (question?.answer_id) {
          console.log(
            `🟡 [STORE] Found saved answer for ${id}:`,
            question.answer_id
          );
          questionsAnswers[id] = question.answer_id;
          questionsStatus[id] = "answered";
        }

        // Handle flagged questions
        if (question?.is_flagged) {
          console.log(`🟡 [STORE] Found flagged question:`, id);
          questionsStatus[id] =
            questionsStatus[id] === "answered" ? "answered" : "flagged";
        }
      });

      console.log("🟢 [STORE] Initial status:", questionsStatus);
      console.log("🟢 [STORE] Initial answers:", questionsAnswers);

      // Find current question index
      const currentQuestionIndex = questionsIds.indexOf(
        examData.current_question?.id || questionsIds[0]
      );

      console.log("🟢 [STORE] Current question index:", currentQuestionIndex);

      set({
        examId: examData.id,
        examData,
        questionsIds,
        questionsStatus,
        questionsAnswers,
        currentQuestion: examData.current_question,
        currentQuestionIndex: Math.max(0, currentQuestionIndex),
        timePerQuestion,
        remainingTime:
          parseInt(
            examData.current_question?.remaining || examData.remaining || ""
          ) || timePerQuestion,
        isTimerActive: false, // Will be started explicitly
        isLoading: false,
        error: null,
        isPaused: false,
        isFinished: false,
      });
    },

    resetExam: () => {
      console.log("🔴 [STORE] Resetting exam store");
      set(initialState);
    },

    setCurrentQuestion: (question) => {
      console.log("🟢 [STORE] Setting current question:", {
        id: question.id,
        desc_preview: question.desc?.substring(0, 50) + "...",
        answer_id: question.answer_id,
        remaining: question.remaining,
      });

      const { questionsIds } = get();
      const questionIndex = questionsIds.indexOf(question.id);

      set({
        currentQuestion: question,
        currentQuestionIndex:
          questionIndex >= 0 ? questionIndex : get().currentQuestionIndex,
      });
    },

    navigateToQuestion: (index) => {
      const { questionsIds } = get();

      if (index < 0 || index >= questionsIds.length) {
        console.warn("🟡 [STORE] Invalid question index:", index);
        return;
      }

      console.log(
        "🟢 [STORE] Navigating to question index:",
        index,
        "ID:",
        questionsIds[index]
      );

      set({
        currentQuestionIndex: index,
      });
    },

    nextQuestion: () => {
      const { currentQuestionIndex, questionsIds } = get();
      console.log("🟢 [STORE] Next question from index:", currentQuestionIndex);

      if (currentQuestionIndex < questionsIds.length - 1) {
        get().navigateToQuestion(currentQuestionIndex + 1);
      } else {
        console.log("🟡 [STORE] Already at last question");
      }
    },

    previousQuestion: () => {
      const { currentQuestionIndex } = get();
      console.log(
        "🟢 [STORE] Previous question from index:",
        currentQuestionIndex
      );

      if (currentQuestionIndex > 0) {
        get().navigateToQuestion(currentQuestionIndex - 1);
      } else {
        console.log("🟡 [STORE] Already at first question");
      }
    },

    // FIXED: Ensure answerId is always a string
    selectAnswer: (answerId) => {
      const { currentQuestion } = get();
      if (!currentQuestion) {
        console.warn("🔴 [STORE] No current question to select answer for");
        return;
      }

      // IMPORTANT: Convert to string to avoid [object Object] issue
      const cleanAnswerId = String(answerId);

      console.log("🟢 [STORE] Selecting answer:", {
        questionId: currentQuestion.id,
        answerId: cleanAnswerId,
        answerType: typeof cleanAnswerId,
        originalAnswerId: answerId,
        originalType: typeof answerId,
      });

      set((state) => ({
        questionsAnswers: {
          ...state.questionsAnswers,
          [currentQuestion.id]: cleanAnswerId,
        },
        questionsStatus: {
          ...state.questionsStatus,
          [currentQuestion.id]: "answered",
        },
      }));
    },

    flagQuestion: (questionId) => {
      const { currentQuestion } = get();
      const targetQuestionId = questionId || currentQuestion?.id;

      if (!targetQuestionId) {
        console.warn("🔴 [STORE] No question ID to flag");
        return;
      }

      console.log("🟢 [STORE] Toggling flag for question:", targetQuestionId);

      set((state) => {
        const currentStatus = state.questionsStatus[targetQuestionId];
        const isFlagged = currentStatus === "flagged";
        const hasAnswer = !!state.questionsAnswers[targetQuestionId];

        let newStatus: QuestionStatus;
        if (isFlagged) {
          // Unflagging - go back to previous status
          newStatus = hasAnswer ? "answered" : "unanswered";
        } else {
          // Flagging
          newStatus = "flagged";
        }

        console.log("🟡 [STORE] Flag status change:", {
          questionId: targetQuestionId,
          oldStatus: currentStatus,
          newStatus,
          hasAnswer,
        });

        return {
          questionsStatus: {
            ...state.questionsStatus,
            [targetQuestionId]: newStatus,
          },
        };
      });
    },

    markQuestionAsSubmitted: (questionId, isCorrect) => {
      const { examData } = get();

      console.log("🟢 [STORE] Marking question as submitted:", {
        questionId,
        isCorrect,
        examMode: examData?.mode,
      });

      set((state) => {
        // Prevent changing status if already processed
        const currentStatus = state.questionsStatus[questionId];
        if (
          ["locked", "correct", "incorrect", "skipped"].includes(currentStatus)
        ) {
          console.log(
            "🟡 [STORE] Question already processed, status:",
            currentStatus
          );
          return state;
        }

        let newStatus: QuestionStatus = "answered";

        if (examData?.mode === "tutor" && typeof isCorrect === "boolean") {
          newStatus = isCorrect ? "correct" : "incorrect";
        } else if (examData?.mode === "test") {
          // In test mode, mark as locked after submit
          newStatus = "locked";
        } else if (!state.questionsAnswers[questionId]) {
          // No answer provided - mark as skipped
          newStatus = "skipped";
        }

        console.log("🟡 [STORE] Status change:", {
          questionId,
          oldStatus: currentStatus,
          newStatus,
        });

        return {
          questionsStatus: {
            ...state.questionsStatus,
            [questionId]: newStatus,
          },
        };
      });
    },

    startTimer: () => {
      console.log("🟢 [STORE] Starting timer");
      set({ isTimerActive: true });
    },

    pauseTimer: () => {
      console.log("🟡 [STORE] Pausing timer");
      set({ isTimerActive: false });
    },

    stopTimer: () => {
      console.log("🔴 [STORE] Stopping timer");
      set({ isTimerActive: false });
    },

    updateRemainingTime: (time) => {
      const newTime = Math.max(0, time);
      set({ remainingTime: newTime });

      // Log only when time hits specific milestones to reduce noise
      if (newTime === 0 || newTime % 10 === 0 || newTime <= 10) {
        console.log("🟡 [STORE] Timer update:", newTime);
      }

      // Don't auto-submit here - let the component handle it
      if (newTime <= 0) {
        set({ isTimerActive: false });
      }
    },

    resetTimer: () => {
      const { timePerQuestion } = get();
      console.log("🟢 [STORE] Resetting timer to:", timePerQuestion);
      set({
        remainingTime: timePerQuestion,
        isTimerActive: timePerQuestion > 0 && !get().isPaused,
      });
    },

    pauseExam: () => {
      console.log("🟡 [STORE] Pausing exam");
      set({ isPaused: true, isTimerActive: false });
    },

    resumeExam: () => {
      console.log("🟢 [STORE] Resuming exam");
      const { timePerQuestion } = get();
      set({
        isPaused: false,
        isTimerActive: timePerQuestion > 0,
      });
    },

    finishExam: () => {
      console.log("🔴 [STORE] Finishing exam");
      set({
        isFinished: true,
        isTimerActive: false,
        isPaused: true,
      });
    },

    setLoading: (loading) => {
      console.log("🟡 [STORE] Loading:", loading);
      set({ isLoading: loading });
    },

    setSubmitting: (submitting) => {
      console.log("🟡 [STORE] Submitting:", submitting);
      set({ isSubmitting: submitting });
    },

    setError: (error) => {
      if (error) {
        console.error("🔴 [STORE] Error:", error);
      }
      set({ error });
    },
  }))
);

// Enhanced selectors with debugging
export const useExamSelectors = () => {
  const store = useExamStore();

  // Add debug logging for current question status
  const currentQuestionStatus = store.currentQuestion
    ? store.questionsStatus[store.currentQuestion.id] || "unanswered"
    : "unanswered";

  const currentAnswer = store.currentQuestion
    ? store.questionsAnswers[store.currentQuestion.id]
    : undefined;

  // Debug log when status or answer changes
  if (store.currentQuestion) {
    console.log("🔍 [SELECTORS] Current question state:", {
      id: store.currentQuestion.id,
      status: currentQuestionStatus,
      answer: currentAnswer,
      answerType: typeof currentAnswer,
    });
  }

  return {
    // Basic info
    examData: store.examData,
    currentQuestion: store.currentQuestion,
    currentIndex: store.currentQuestionIndex,

    // Progress
    totalQuestions: store.questionsIds.length,
    answeredCount: Object.values(store.questionsStatus).filter((s) =>
      ["answered", "correct", "incorrect", "locked"].includes(s)
    ).length,
    flaggedCount: Object.values(store.questionsStatus).filter(
      (s) => s === "flagged"
    ).length,

    // Timer
    remainingTime: store.remainingTime,
    isTimerActive: store.isTimerActive,

    // Navigation
    canGoNext: store.currentQuestionIndex < store.questionsIds.length - 1,
    canGoPrevious: store.currentQuestionIndex > 0,

    // Current question state
    currentQuestionStatus,
    currentAnswer,

    // UI state
    isLoading: store.isLoading,
    isSubmitting: store.isSubmitting,
    error: store.error,
    isPaused: store.isPaused,
    isFinished: store.isFinished,
  };
};
