// hooks/useExamApi.ts - UPDATED with Check Answer API

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ExamResponse,
  QuestionDetails,
  SubmitQuestionResponse,
  SubmitExamResponse,
} from "./exam.types";

// =============================================================================
// NEW: Check Answer Types
// =============================================================================

export interface CheckAnswerResponse {
  data: {
    is_correct: boolean;
    correct_answer: string;
  };
  status: number;
  message: string;
}

// =============================================================================
// QUERIES
// =============================================================================

export const useExam = (examId: string | null) => {
  return useQuery({
    queryKey: ["exam", examId],
    queryFn: () => apiFetch<ExamResponse>(`/user/exams/${examId}`),
    enabled: !!examId,
    staleTime: 0, // Always refetch to get latest state
    refetchOnWindowFocus: true,
  });
};

export const useQuestion = (questionId: string | null) => {
  return useQuery({
    queryKey: ["question", questionId],
    queryFn: () =>
      apiFetch<{ data: QuestionDetails }>(
        `/user/get_exam_question/${questionId}`
      ),
    enabled: !!questionId,
    staleTime: 5 * 60 * 1000, // 5 minutes (questions don't change)
  });
};

// =============================================================================
// MUTATIONS
// =============================================================================

export const useSubmitQuestion = () => {
  return useMutation({
    mutationFn: async (payload: {
      exam_id: string;
      question_id: string;
      answer_id: string;
    }) => {
      const formData = new FormData();
      formData.append("exam_id", payload.exam_id);
      formData.append("question_id", payload.question_id);
      formData.append("answer_id", payload.answer_id);

      return apiFetch<SubmitQuestionResponse>("/user/submit_question", {
        method: "POST",
        body: formData,
      });
    },
  });
};

// =============================================================================
// NEW: Check Answer Mutation
// =============================================================================

export const useCheckAnswer = () => {
  return useMutation({
    mutationFn: async (payload: { question_id: string; answer_id: string }) => {
      const formData = new FormData();
      formData.append("answer_id", payload.answer_id);

      return apiFetch<CheckAnswerResponse>(
        `/user/check_is_answer_correct/${payload.answer_id}`,
        {
          method: "POST",
          body: formData,
        }
      );
    },
  });
};

export const useSubmitExam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      exam_id: string;
      questions: Array<{
        question_id: string;
        answer_id: string;
      }>;
      mergedLessons?: boolean;
    }) => {
      const formData = new FormData();
      formData.append("exam_id", payload.exam_id);

      payload.questions.forEach((q, index) => {
        formData.append(`questions[${index}][question_id]`, q.question_id);
        formData.append(`questions[${index}][answer_id]`, q.answer_id);
      });

      if (payload.mergedLessons) {
        formData.append("mergedLessons", "true");
      }

      return apiFetch<SubmitExamResponse>("/user/submit_exam", {
        method: "POST",
        body: formData,
      });
    },
    onSuccess: (data) => {
      // Invalidate exam queries after submission
      queryClient.invalidateQueries({ queryKey: ["exam"] });
    },
  });
};

export const useFlagQuestion = () => {
  return useMutation({
    mutationFn: async (payload: {
      exam_id: string;
      question_id: string;
      flag: boolean;
    }) => {
      const formData = new FormData();
      formData.append("exam_id", payload.exam_id);
      formData.append("question_id", payload.question_id);
      formData.append("flag", payload.flag ? "1" : "0");

      // Note: This API endpoint is assumed - you might need to check your actual API
      return apiFetch("/user/flag_question", {
        method: "POST",
        body: formData,
      });
    },
  });
};

export const usePauseExam = () => {
  return useMutation({
    mutationFn: async (payload: {
      exam_id: string;
      current_question_id: string;
      remaining_time: number;
    }) => {
      const formData = new FormData();
      formData.append("exam_id", payload.exam_id);
      formData.append("current_question_id", payload.current_question_id);
      formData.append("remaining_time", payload.remaining_time.toString());

      // Note: This API endpoint is assumed - check your actual API
      return apiFetch("/user/pause_exam", {
        method: "POST",
        body: formData,
      });
    },
  });
};

// =============================================================================
// CUSTOM HOOKS FOR EXAM LOGIC
// =============================================================================

export const useExamNavigation = () => {
  const submitQuestionMutation = useSubmitQuestion();
  const queryClient = useQueryClient();

  const submitAndNavigate = async (
    examId: string,
    questionId: string,
    answerId: string,
    nextQuestionId?: string
  ) => {
    try {
      // Submit current question
      const response = await submitQuestionMutation.mutateAsync({
        exam_id: examId,
        question_id: questionId,
        answer_id: answerId,
      });

      // Prefetch next question if provided
      if (nextQuestionId) {
        queryClient.prefetchQuery({
          queryKey: ["question", nextQuestionId],
          queryFn: () =>
            apiFetch<{ data: QuestionDetails }>(
              `/user/get_exam_question/${nextQuestionId}`
            ),
        });
      }

      return response;
    } catch (error) {
      throw error;
    }
  };

  return {
    submitAndNavigate,
    isSubmitting: submitQuestionMutation.isPending,
    error: submitQuestionMutation.error,
  };
};

// =============================================================================
// NEW: Tutor Mode Logic Hook
// =============================================================================

export const useTutorMode = () => {
  const checkAnswerMutation = useCheckAnswer();

  const checkAnswer = async (questionId: string, answerId: string) => {
    try {
      const response = await checkAnswerMutation.mutateAsync({
        question_id: questionId,
        answer_id: answerId,
      });

      return {
        isCorrect: response.data.is_correct,
        correctAnswer: response.data.correct_answer,
      };
    } catch (error) {
      console.error("Failed to check answer:", error);
      throw error;
    }
  };

  return {
    checkAnswer,
    isChecking: checkAnswerMutation.isPending,
    checkError: checkAnswerMutation.error,
  };
};

export const useExamTimer = (
  initialTime: number,
  isActive: boolean,
  onTimeUp: () => void
) => {
  const [remainingTime, setRemainingTime] = useState(initialTime);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive && remainingTime > 0) {
      intervalRef.current = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 1) {
            onTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, remainingTime, onTimeUp]);

  useEffect(() => {
    setRemainingTime(initialTime);
  }, [initialTime]);

  const pauseTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const resumeTimer = () => {
    // Timer will restart automatically due to isActive dependency
  };

  return {
    remainingTime,
    pauseTimer,
    resumeTimer,
    setRemainingTime,
  };
};

// =============================================================================
// UTILITY HOOKS
// =============================================================================

import { useEffect, useRef, useState } from "react";
import { apiFetch } from "@/lib/api/client";

export const useAutoSubmit = (
  remainingTime: number,
  hasAnswer: boolean,
  onAutoSubmit: () => void
) => {
  useEffect(() => {
    if (remainingTime === 0) {
      onAutoSubmit();
    }
  }, [remainingTime, onAutoSubmit]);
};

export const useExamPersistence = () => {
  const saveExamState = (examId: string, state: any) => {
    try {
      localStorage.setItem(
        `exam_${examId}`,
        JSON.stringify({
          ...state,
          timestamp: Date.now(),
        })
      );
    } catch (error) {
      console.warn("Failed to save exam state:", error);
    }
  };

  const loadExamState = (examId: string) => {
    try {
      const saved = localStorage.getItem(`exam_${examId}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Check if saved state is not too old (e.g., 24 hours)
        const isValid = Date.now() - parsed.timestamp < 24 * 60 * 60 * 1000;
        return isValid ? parsed : null;
      }
    } catch (error) {
      console.warn("Failed to load exam state:", error);
    }
    return null;
  };

  const clearExamState = (examId: string) => {
    try {
      localStorage.removeItem(`exam_${examId}`);
    } catch (error) {
      console.warn("Failed to clear exam state:", error);
    }
  };

  return {
    saveExamState,
    loadExamState,
    clearExamState,
  };
};

// =============================================================================
// EXAM LIST TYPES & HOOKS - Add these to your existing useExamApi.ts
// =============================================================================

export interface ExamListItem {
  id: string;
  name: string;
  questions_number: string;
  mode: "test" | "tutor";
  question_type: "all" | "unused" | "incorrect";
  time_mode: "untimed" | "timed" | "timed90";
  is_opened: "0" | "1";
  status: "Finished" | "Resume";
  flag_count: string;
  finish_date: string | null;
  score: number;
  attempted: string;
  correct: string;
  is_retake: "0" | "1";
  remaining: string | null;
  created_at: string;
}

export interface ExamListResponse {
  data: ExamListItem[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
    path: string;
    per_page: number;
    to: number;
    total: number;
  };
  status: number;
  message: string;
  states: {
    questions: {
      used: number;
      available: number;
    };
    week_chart: {
      values: (string | null)[];
      days: string[];
    };
  };
}

export interface ExamListParams {
  page?: number;
  per_page?: number;
  search?: string;
}

// =============================================================================
// NEW QUERIES FOR EXAM LIST
// =============================================================================

export const useExamsList = (params: ExamListParams = {}) => {
  return useQuery({
    queryKey: ["exams", "list", params],
    queryFn: () => {
      const queryParams: Record<
        string,
        string | number | boolean | null | undefined
      > = {};

      if (params.page && params.page > 1) {
        queryParams.page = params.page;
      }

      if (params.per_page) {
        queryParams.per_page = params.per_page;
      }

      if (params.search && params.search.trim()) {
        queryParams.search = params.search.trim();
      }

      return apiFetch<ExamListResponse>("/user/exams", {
        query: queryParams,
      });
    },
    staleTime: 30 * 1000, // 30 seconds
    refetchOnWindowFocus: false,
  });
};

// =============================================================================
// KEYBOARD SHORTCUTS
// =============================================================================

export const useExamKeyboardShortcuts = (
  onNext: () => void,
  onPrevious: () => void,
  onFlag: () => void,
  onSubmit: () => void,
  disabled = false
) => {
  useEffect(() => {
    if (disabled) return;

    const handleKeyPress = (event: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in input/textarea
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement
      ) {
        return;
      }

      switch (event.key) {
        case "ArrowRight":
        case "n":
        case "N":
          event.preventDefault();
          onNext();
          break;
        case "ArrowLeft":
        case "p":
        case "P":
          event.preventDefault();
          onPrevious();
          break;
        case "f":
        case "F":
          event.preventDefault();
          onFlag();
          break;
        case "Enter":
          if (event.ctrlKey || event.metaKey) {
            event.preventDefault();
            onSubmit();
          }
          break;
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [onNext, onPrevious, onFlag, onSubmit, disabled]);
};
