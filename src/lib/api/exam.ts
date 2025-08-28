// lib/api/exam.service.ts

import { apiFetch } from "@/lib/api/client";
import {
  Section,
  Chapter,
  CreateExamPayload,
  QuestionType,
} from "@/app/[locale]/(main)/mcqs/components/exam";

// === Types ===
export interface SectionsResponse {
  status: number;
  message: string;
  data: Section[];
}

export interface ChaptersResponse {
  status: number;
  message: string;
  data: Chapter[];
}

export interface ExamResponse {
  status: number;
  message: string;
  data: any; // Replace with your actual exam response type
}

// === Services ===

/**
 * Fetch sections based on question type
 */
export async function getSections(
  category: QuestionType = "all",
  signal?: AbortSignal
): Promise<Section[] | null> {
  try {
    const res = await apiFetch<SectionsResponse>(
      "/user/get_questions_sections",
      {
        query: { category },
        signal,
      }
    );
    return res?.data ?? null;
  } catch (error) {
    console.error("Failed to fetch sections:", error);
    return null;
  }
}

/**
 * Fetch chapters based on section ID and category
 */
export async function getChapters(
  sectionId: number,
  category: QuestionType = "all",
  signal?: AbortSignal
): Promise<Chapter[] | null> {
  try {
    const res = await apiFetch<ChaptersResponse>(
      "/user/get_questions_chapters",
      {
        query: {
          category,
          section_id: sectionId,
        },
        signal,
      }
    );
    return res?.data ?? null;
  } catch (error) {
    console.error("Failed to fetch chapters:", error);
    return null;
  }
}

/**
 * Create exam with form data
 */
export async function createExam(
  data: CreateExamPayload,
  signal?: AbortSignal
): Promise<any | null> {
  try {
    // Create FormData for multipart/form-data
    const formData = new FormData();

    // Add all form fields to FormData
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });

    const res = await apiFetch<ExamResponse>("/user/exams", {
      method: "POST",
      body: formData,
      // Don't set Content-Type header - browser will set it automatically with boundary
      headers: {
        // Remove Accept: application/json for FormData requests
      },
      signal,
    });

    return res?.data ?? null;
  } catch (error) {
    console.error("Failed to create exam:", error);
    return null;
  }
}

// === Exam API Object (for backward compatibility) ===
export const examApi = {
  getSections,
  getChapters,
  createExam,
};

// === Helper Functions ===

/**
 * Get sections for a specific category with error handling
 */
export async function getSectionsByCategory(
  category: QuestionType,
  signal?: AbortSignal
): Promise<Section[]> {
  const sections = await getSections(category, signal);
  return sections ?? [];
}

/**
 * Get chapters for a section with error handling
 */
export async function getChaptersBySection(
  sectionId: number,
  category: QuestionType = "all",
  signal?: AbortSignal
): Promise<Chapter[]> {
  const chapters = await getChapters(sectionId, category, signal);
  return chapters ?? [];
}

/**
 * Create exam with validation
 */
export async function createExamWithValidation(
  data: CreateExamPayload,
  signal?: AbortSignal
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    // Basic validation
    if (!data) {
      return { success: false, error: "Exam data is required" };
    }

    const result = await createExam(data, signal);

    if (result) {
      return { success: true, data: result };
    } else {
      return { success: false, error: "Failed to create exam" };
    }
  } catch (error) {
    console.error("Exam creation validation error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// // lib/api/exam.ts

// import {
//   ApiResponse,
//   Section,
//   Chapter,
//   CreateExamPayload,
//   QuestionType,
// } from "@/app/[locale]/(main)/mcqs/components/exam";
// import { getAuthToken } from "@/lib/cookies"; // 👈 جديد

// const API_BASE_URL =
//   process.env.NEXT_PUBLIC_API_URL || "https://api.daleelfm.com";

// class ApiError extends Error {
//   constructor(message: string, public status: number, public response?: any) {
//     super(message);
//     this.name = "ApiError";
//   }
// }

// const handleApiResponse = async <T>(
//   response: Response
// ): Promise<ApiResponse<T>> => {
//   if (!response.ok) {
//     const errorData = await response.json().catch(() => ({}));
//     throw new ApiError(
//       errorData.message || `HTTP error! status: ${response.status}`,
//       response.status,
//       errorData
//     );
//   }
//   return response.json();
// };

// // 👇 مساعد لإضافة الهيدر Authorization تلقائيًا
// function withAuthHeader(base: HeadersInit = {}): HeadersInit {
//   // getAuthToken بيرجع null تلقائيًا على السيرفر؛ فمش هيضيف الهيدر في RSC
//   const token = getAuthToken();
//   return token ? { ...base, Authorization: `Bearer ${token}` } : base;
// }

// export const examApi = {
//   // Fetch sections based on question type
//   getSections: async (category: QuestionType = "all"): Promise<Section[]> => {
//     const response = await fetch(
//       `${API_BASE_URL}/api/user/get_questions_sections?category=${category}`,
//       {
//         method: "GET",
//         headers: withAuthHeader({
//           "Content-Type": "application/json",
//         }),
//         cache: "no-store",
//       }
//     );

//     const result = await handleApiResponse<Section[]>(response);
//     return result.data;
//   },

//   // Fetch chapters based on section ID and category
//   getChapters: async (
//     sectionId: number,
//     category: QuestionType = "all"
//   ): Promise<Chapter[]> => {
//     const response = await fetch(
//       `${API_BASE_URL}/api/user/get_questions_chapters?category=${category}&section_id=${sectionId}`,
//       {
//         method: "GET",
//         headers: withAuthHeader({
//           "Content-Type": "application/json",
//         }),
//         cache: "no-store",
//       }
//     );

//     const result = await handleApiResponse<Chapter[]>(response);
//     return result.data;
//   },

//   // Create exam
//   createExam: async (data: CreateExamPayload): Promise<any> => {
//     const formData = new FormData();

//     // Add all form fields to FormData
//     Object.entries(data).forEach(([key, value]) => {
//       if (value !== undefined && value !== null) {
//         formData.append(key, value.toString());
//       }
//     });

//     const response = await fetch(`${API_BASE_URL}/user/exams`, {
//       method: "POST",
//       // مَنسبش Content-Type هنا؛ المتصفح هيحدده تلقائيًا (Boundary)
//       headers: withAuthHeader(),
//       body: formData,
//       cache: "no-store",
//     });

//     return handleApiResponse(response);
//   },
// };

// // lib/api/exam.ts

// import {
//   ApiResponse,
//   Section,
//   Chapter,
//   CreateExamPayload,
//   QuestionType,
// } from "@/app/[locale]/(main)/mcqs/components/exam";

// const API_BASE_URL =
//   process.env.NEXT_PUBLIC_API_URL || "https://api.daleelfm.com";

// class ApiError extends Error {
//   constructor(message: string, public status: number, public response?: any) {
//     super(message);
//     this.name = "ApiError";
//   }
// }

// const handleApiResponse = async <T>(
//   response: Response
// ): Promise<ApiResponse<T>> => {
//   if (!response.ok) {
//     const errorData = await response.json().catch(() => ({}));
//     throw new ApiError(
//       errorData.message || `HTTP error! status: ${response.status}`,
//       response.status,
//       errorData
//     );
//   }

//   return response.json();
// };

// export const examApi = {
//   // Fetch sections based on question type
//   getSections: async (category: QuestionType = "all"): Promise<Section[]> => {
//     const response = await fetch(
//       `${API_BASE_URL}/user/get_questions_sections?category=${category}`,
//       {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           // Add authorization headers here if needed
//           // 'Authorization': `Bearer ${token}`
//         },
//       }
//     );

//     const result = await handleApiResponse<Section[]>(response);
//     return result.data;
//   },

//   // Fetch chapters based on section ID and category
//   getChapters: async (
//     sectionId: number,
//     category: QuestionType = "all"
//   ): Promise<Chapter[]> => {
//     const response = await fetch(
//       `${API_BASE_URL}/user/get_questions_chapters?category=${category}&section_id=${sectionId}`,
//       {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           // Add authorization headers here if needed
//           // 'Authorization': `Bearer ${token}`
//         },
//       }
//     );

//     const result = await handleApiResponse<Chapter[]>(response);
//     return result.data;
//   },

//   // Create exam
//   createExam: async (data: CreateExamPayload): Promise<any> => {
//     const formData = new FormData();

//     // Add all form fields to FormData
//     Object.entries(data).forEach(([key, value]) => {
//       if (value !== undefined && value !== null) {
//         formData.append(key, value.toString());
//       }
//     });

//     const response = await fetch(`${API_BASE_URL}/user/exams`, {
//       method: "POST",
//       headers: {
//         // Don't set Content-Type for FormData - browser will set it with boundary
//         // Add authorization headers here if needed
//         // 'Authorization': `Bearer ${token}`
//       },
//       body: formData,
//     });

//     return handleApiResponse(response);
//   },
// };
