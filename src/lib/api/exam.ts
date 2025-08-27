// lib/api/exam.ts

import {
  ApiResponse,
  Section,
  Chapter,
  CreateExamPayload,
  QuestionType,
} from "@/app/[locale]/(main)/mcqs/components/exam";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://api.daleelfm.com";

class ApiError extends Error {
  constructor(message: string, public status: number, public response?: any) {
    super(message);
    this.name = "ApiError";
  }
}

const handleApiResponse = async <T>(
  response: Response
): Promise<ApiResponse<T>> => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      errorData.message || `HTTP error! status: ${response.status}`,
      response.status,
      errorData
    );
  }

  return response.json();
};

export const examApi = {
  // Fetch sections based on question type
  getSections: async (category: QuestionType = "all"): Promise<Section[]> => {
    const response = await fetch(
      `${API_BASE_URL}/user/get_questions_sections?category=${category}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Add authorization headers here if needed
          // 'Authorization': `Bearer ${token}`
        },
      }
    );

    const result = await handleApiResponse<Section[]>(response);
    return result.data;
  },

  // Fetch chapters based on section ID and category
  getChapters: async (
    sectionId: number,
    category: QuestionType = "all"
  ): Promise<Chapter[]> => {
    const response = await fetch(
      `${API_BASE_URL}/user/get_questions_chapters?category=${category}&section_id=${sectionId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Add authorization headers here if needed
          // 'Authorization': `Bearer ${token}`
        },
      }
    );

    const result = await handleApiResponse<Chapter[]>(response);
    return result.data;
  },

  // Create exam
  createExam: async (data: CreateExamPayload): Promise<any> => {
    const formData = new FormData();

    // Add all form fields to FormData
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });

    const response = await fetch(`${API_BASE_URL}/user/exams`, {
      method: "POST",
      headers: {
        // Don't set Content-Type for FormData - browser will set it with boundary
        // Add authorization headers here if needed
        // 'Authorization': `Bearer ${token}`
      },
      body: formData,
    });

    return handleApiResponse(response);
  },
};
