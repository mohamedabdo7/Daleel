// lib/validations/exam.ts

import * as z from "zod";

export const createExamSchema = z
  .object({
    name: z
      .string()
      .min(1, "Exam name is required")
      .max(255, "Exam name must be less than 255 characters"),

    mode: z.enum(["test", "tutor"] as const, {
      required_error: "Exam mode is required",
    }),

    questions_number: z
      .number({
        required_error: "Number of questions is required",
        invalid_type_error: "Must be a valid number",
      })
      .min(1, "Must have at least 1 question")
      .int("Must be a whole number"),

    time_mode: z.enum(["timed_1min", "timed_90sec", "untimed"] as const, {
      required_error: "Time mode is required",
    }),

    question_type: z.enum(["all", "incorrect", "flagged", "unused"] as const, {
      required_error: "Question type is required",
    }),

    section_id: z
      .number({
        invalid_type_error: "Must be a valid section",
      })
      .optional(),

    chapters_type: z.enum(["all", "specific"] as const, {
      required_error: "Chapter type is required",
    }),

    chapters: z.array(z.number()).default([]).optional(),
  })
  .superRefine((data, ctx) => {
    // Section is required for certain question types
    if (
      ["incorrect", "flagged", "unused"].includes(data.question_type) &&
      !data.section_id
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Section selection is required for this question type",
        path: ["section_id"],
      });
    }

    // Chapters are required when chapters_type is 'specific'
    if (
      data.chapters_type === "specific" &&
      (!data.chapters || data.chapters.length === 0)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "At least one chapter must be selected",
        path: ["chapters"],
      });
    }
  });

export type CreateExamFormValues = z.infer<typeof createExamSchema>;
