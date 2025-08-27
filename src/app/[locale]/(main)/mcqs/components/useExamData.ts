// hooks/useExamData.ts

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { examApi } from "@/lib/api/exam";
import { CreateExamPayload, QuestionType } from "./exam";
import { CreateExamFormValues } from "./validation-exam";

// Query Keys
export const examQueryKeys = {
  sections: (category: QuestionType) => ["sections", category] as const,
  chapters: (sectionId: number, category: QuestionType) =>
    ["chapters", sectionId, category] as const,
};

// Hook to fetch sections
export const useSections = (category: QuestionType) => {
  return useQuery({
    queryKey: examQueryKeys.sections(category),
    queryFn: () => examApi.getSections(category),
    enabled: !!category,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook to fetch chapters
export const useChapters = (
  sectionId: number | undefined,
  category: QuestionType
) => {
  return useQuery({
    queryKey: examQueryKeys.chapters(sectionId!, category),
    queryFn: () => examApi.getChapters(sectionId!, category),
    enabled: !!sectionId && !!category,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Hook to create exam
export const useCreateExam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateExamPayload) => examApi.createExam(data),
    onSuccess: () => {
      // Invalidate and refetch any exam-related queries if needed
      // queryClient.invalidateQueries(['exams']);
    },
    onError: (error) => {
      console.error("Failed to create exam:", error);
    },
  });
};

// Utility function to transform form data to API payload
export const transformFormDataToPayload = (
  data: CreateExamFormValues
): CreateExamPayload => {
  const payload: any = {
    name: data.name,
    mode: data.mode,
    questions_number: data.questions_number,
    time_mode: data.time_mode,
    question_type: data.question_type,
    chapters_type: data.chapters_type,
  };

  // Add section_id if present
  if (data.section_id) {
    payload.section_id = data.section_id;
  }

  // Transform chapters array to indexed format
  if (data.chapters && data.chapters.length > 0) {
    data.chapters.forEach((chapterId, index) => {
      payload[`chapters[${index}]`] = chapterId;
    });
  }

  return payload as CreateExamPayload;
};
