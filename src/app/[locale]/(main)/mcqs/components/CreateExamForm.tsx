import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { toast } from "sonner";

import { ChaptersSelector } from "./ChaptersSelector";

import { CreateExamFormValues, createExamSchema } from "./validation-exam";
import {
  CHAPTER_TYPE_OPTIONS,
  EXAM_MODE_OPTIONS,
  QUESTION_TYPE_OPTIONS,
  QuestionType,
  TIME_MODE_OPTIONS,
} from "./exam";
import {
  transformFormDataToPayload,
  useCreateExam,
  useSections,
} from "./useExamData";
import {
  CustomSelect,
  SelectOption,
} from "@/app/components/common/form/CustomSelect";
import { CustomInput } from "@/app/components/common/form/CustomInput";

export const CreateExamForm: React.FC = () => {
  const router = useRouter();
  const [maxQuestions, setMaxQuestions] = useState(0);

  const form = useForm<CreateExamFormValues>({
    resolver: zodResolver(createExamSchema),
    defaultValues: {
      name: "",
      mode: undefined,
      questions_number: 1,
      time_mode: undefined,
      question_type: undefined,
      section_id: undefined,
      chapters_type: undefined,
      chapters: [],
    },
  });

  const { watch, setValue, resetField } = form;
  const watchedQuestionType = watch("question_type");
  const watchedChaptersType = watch("chapters_type");
  const watchedQuestionsNumber = watch("questions_number");

  // Fetch sections based on question type
  const {
    data: sections = [],
    isLoading: sectionsLoading,
    error: sectionsError,
  } = useSections(watchedQuestionType as QuestionType);

  // Create exam mutation
  const createExamMutation = useCreateExam();

  // Reset dependent fields when question type changes
  useEffect(() => {
    if (watchedQuestionType) {
      resetField("section_id");
      resetField("chapters");
      setMaxQuestions(0);
    }
  }, [watchedQuestionType, resetField]);

  // Reset chapters when chapters_type changes
  useEffect(() => {
    if (watchedChaptersType) {
      resetField("chapters");
      setMaxQuestions(0);
    }
  }, [watchedChaptersType, resetField]);

  // Update questions_number validation based on max available
  useEffect(() => {
    if (maxQuestions > 0 && watchedQuestionsNumber > maxQuestions) {
      setValue("questions_number", maxQuestions);
    }
  }, [maxQuestions, watchedQuestionsNumber, setValue]);

  // Handle form submission
  const onSubmit = async (data: CreateExamFormValues) => {
    try {
      // Validate questions number against max available
      if (maxQuestions > 0 && data.questions_number > maxQuestions) {
        form.setError("questions_number", {
          message: `Maximum ${maxQuestions} questions available`,
        });
        return;
      }

      const payload = transformFormDataToPayload(data);

      // Get the response which should contain the exam ID
      const response = await createExamMutation.mutateAsync(payload);

      toast.success("Exam created successfully!");

      // Navigate to exam page using the exam ID from response
      // Adjust the property name based on your API response structure
      const examId = response.id || response.exam_id || response.data?.id;

      if (examId) {
        router.push(`/en/exam/${examId}`);
      } else {
        console.warn("No exam ID found in response:", response);
        // Fallback: reset form if no ID is available
        form.reset();
        setMaxQuestions(0);
      }
    } catch (error) {
      console.error("Error creating exam:", error);
      toast.error("Failed to create exam. Please try again.");
    }
  };

  // Handle reset
  const handleReset = () => {
    form.reset();
    setMaxQuestions(0);
  };

  const needsSectionSelection = !!watchedQuestionType;

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl  font-bold text-center">
          Create Exam
        </CardTitle>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Row 1: Exam Name and Mode */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormControl>
                      <CustomInput
                        label="Exam Name"
                        placeholder="Enter exam name"
                        error={fieldState.error?.message}
                        disabled={createExamMutation.isPending}
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="mode"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormControl>
                      <CustomSelect
                        label="Exam Mode"
                        placeholder="Select exam mode"
                        options={EXAM_MODE_OPTIONS as SelectOption[]}
                        value={field.value}
                        onValueChange={field.onChange}
                        error={fieldState.error?.message}
                        disabled={createExamMutation.isPending}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* Row 2: Questions Number and Time Mode */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="questions_number"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormControl>
                      <CustomInput
                        type="number"
                        label={`Number of Questions${
                          maxQuestions > 0 ? ` (Max: ${maxQuestions})` : ""
                        }`}
                        placeholder="1"
                        min="1"
                        max={maxQuestions || undefined}
                        error={fieldState.error?.message}
                        disabled={createExamMutation.isPending}
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 1)
                        }
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="time_mode"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormControl>
                      <CustomSelect
                        label="Time Mode"
                        placeholder="Select time mode"
                        options={TIME_MODE_OPTIONS as SelectOption[]}
                        value={field.value}
                        onValueChange={field.onChange}
                        error={fieldState.error?.message}
                        disabled={createExamMutation.isPending}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* Row 3: Question Type and Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="question_type"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormControl>
                      <CustomSelect
                        label="Question Type"
                        placeholder="Select question type"
                        options={QUESTION_TYPE_OPTIONS as SelectOption[]}
                        value={field.value}
                        onValueChange={field.onChange}
                        error={fieldState.error?.message}
                        disabled={createExamMutation.isPending}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {needsSectionSelection && (
                <FormField
                  control={form.control}
                  name="section_id"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      {sectionsLoading ? (
                        <Skeleton className="h-12 w-full" />
                      ) : sectionsError ? (
                        <div className="flex items-center gap-2 text-sm text-destructive">
                          <AlertCircle className="h-4 w-4" />
                          Failed to load sections
                        </div>
                      ) : (
                        <FormControl>
                          <CustomSelect
                            label="Sections"
                            placeholder="Select section"
                            options={sections.map((section) => ({
                              value: section.id.toString(),
                              label: section.title,
                            }))}
                            value={field.value?.toString()}
                            onValueChange={(value) =>
                              field.onChange(parseInt(value))
                            }
                            error={fieldState.error?.message}
                            disabled={createExamMutation.isPending}
                            loading={sectionsLoading}
                          />
                        </FormControl>
                      )}
                    </FormItem>
                  )}
                />
              )}
            </div>

            {/* Row 4: Chapters Type and Chapters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="chapters_type"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormControl>
                      <CustomSelect
                        label="Chapters Type"
                        placeholder="Select chapters type"
                        options={CHAPTER_TYPE_OPTIONS as SelectOption[]}
                        value={field.value}
                        onValueChange={field.onChange}
                        error={fieldState.error?.message}
                        disabled={createExamMutation.isPending}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Placeholder for chapters selector alignment */}
              <div></div>
            </div>

            {/* Chapters Selector */}
            {watchedQuestionType && (
              <ChaptersSelector
                control={form.control}
                onMaxQuestionsChange={setMaxQuestions}
              />
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Button
                type="submit"
                className="flex-1"
                disabled={createExamMutation.isPending}
              >
                {createExamMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Exam...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Create Exam
                  </>
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                disabled={createExamMutation.isPending}
                className="flex-1 sm:flex-initial"
              >
                Reset
              </Button>
            </div>

            {/* Status Messages */}
            {createExamMutation.error && (
              <div className="p-4 bg-destructive/10 border border-destructive rounded-md">
                <div className="flex items-center gap-2 text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  <span className="font-medium">Error creating exam</span>
                </div>
                <p className="text-sm text-destructive/80 mt-1">
                  {createExamMutation.error instanceof Error
                    ? createExamMutation.error.message
                    : "An unexpected error occurred"}
                </p>
              </div>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

// // components/exam/CreateExamForm.tsx

// import React, { useState, useEffect } from "react";
// import { useForm, Controller } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useRouter } from "next/navigation";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Loader2, AlertCircle, CheckCircle } from "lucide-react";
// import { toast } from "sonner";

// import { CustomInput } from "@/app/components/common/form/CustomInput";
// import { CustomSelect } from "@/app/components/common/form/CustomSelect"; // Import your custom select
// import { CustomButton } from "@/app/components/common/form/custom-button";
// import { ChaptersSelector } from "./ChaptersSelector";

// import { CreateExamFormValues, createExamSchema } from "./validation-exam";
// import {
//   CHAPTER_TYPE_OPTIONS,
//   EXAM_MODE_OPTIONS,
//   QUESTION_TYPE_OPTIONS,
//   QuestionType,
//   TIME_MODE_OPTIONS,
// } from "./exam";
// import {
//   transformFormDataToPayload,
//   useCreateExam,
//   useSections,
// } from "./useExamData";

// export const CreateExamForm: React.FC = () => {
//   const router = useRouter();
//   const [maxQuestions, setMaxQuestions] = useState(0);

//   const form = useForm<CreateExamFormValues>({
//     resolver: zodResolver(createExamSchema),
//     defaultValues: {
//       name: "",
//       mode: undefined,
//       questions_number: 1,
//       time_mode: undefined,
//       question_type: undefined,
//       section_id: undefined,
//       chapters_type: undefined,
//       chapters: [],
//     },
//   });

//   const {
//     watch,
//     setValue,
//     resetField,
//     control,
//     formState: { errors },
//   } = form;
//   const watchedQuestionType = watch("question_type");
//   const watchedChaptersType = watch("chapters_type");
//   const watchedQuestionsNumber = watch("questions_number");

//   // Fetch sections based on question type
//   const {
//     data: sections = [],
//     isLoading: sectionsLoading,
//     error: sectionsError,
//   } = useSections(watchedQuestionType as QuestionType);

//   // Create exam mutation
//   const createExamMutation = useCreateExam();

//   // Reset dependent fields when question type changes
//   useEffect(() => {
//     if (watchedQuestionType) {
//       resetField("section_id");
//       resetField("chapters");
//       setMaxQuestions(0);
//     }
//   }, [watchedQuestionType, resetField]);

//   // Reset chapters when chapters_type changes
//   useEffect(() => {
//     if (watchedChaptersType) {
//       resetField("chapters");
//       setMaxQuestions(0);
//     }
//   }, [watchedChaptersType, resetField]);

//   // Update questions_number validation based on max available
//   useEffect(() => {
//     if (maxQuestions > 0 && watchedQuestionsNumber > maxQuestions) {
//       setValue("questions_number", maxQuestions);
//     }
//   }, [maxQuestions, watchedQuestionsNumber, setValue]);

//   // Handle form submission
//   const onSubmit = async (data: CreateExamFormValues) => {
//     try {
//       // Validate questions number against max available
//       if (maxQuestions > 0 && data.questions_number > maxQuestions) {
//         form.setError("questions_number", {
//           message: `Maximum ${maxQuestions} questions available`,
//         });
//         return;
//       }

//       const payload = transformFormDataToPayload(data);

//       // Get the response which should contain the exam ID
//       const response = await createExamMutation.mutateAsync(payload);

//       toast.success("Exam created successfully!");

//       // Navigate to exam page using the exam ID from response
//       const examId = response.id || response.exam_id || response.data?.id;

//       if (examId) {
//         router.push(`/en/exam/${examId}`);
//       } else {
//         console.warn("No exam ID found in response:", response);
//         // Fallback: reset form if no ID is available
//         form.reset();
//         setMaxQuestions(0);
//       }
//     } catch (error) {
//       console.error("Error creating exam:", error);
//       toast.error("Failed to create exam. Please try again.");
//     }
//   };

//   // Handle reset
//   const handleReset = () => {
//     form.reset();
//     setMaxQuestions(0);
//   };

//   const needsSectionSelection = !!watchedQuestionType;

//   // Convert sections to select options
//   const sectionOptions = sections.map((section) => ({
//     value: section.id.toString(),
//     label: section.title,
//   }));

//   return (
//     <div className="w-full max-w-4xl mx-auto p-4">
//       <Card className="bg-white rounded-2xl shadow-xl border border-gray-100">
//         <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-2xl">
//           <CardTitle className="text-2xl font-bold text-center">
//             Create Exam
//           </CardTitle>
//         </CardHeader>

//         <CardContent className="p-8">
//           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//             {/* Row 1: Exam Name and Mode */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <Controller
//                 name="name"
//                 control={control}
//                 render={({ field }) => (
//                   <CustomInput
//                     label="Exam Name"
//                     placeholder="Enter exam name"
//                     error={errors.name?.message}
//                     disabled={createExamMutation.isPending}
//                     {...field}
//                   />
//                 )}
//               />

//               <Controller
//                 name="mode"
//                 control={control}
//                 render={({ field }) => (
//                   <CustomSelect
//                     label="Exam Mode"
//                     placeholder="Select exam mode"
//                     options={EXAM_MODE_OPTIONS}
//                     value={field.value}
//                     onValueChange={field.onChange}
//                     error={errors.mode?.message}
//                     disabled={createExamMutation.isPending}
//                   />
//                 )}
//               />
//             </div>

//             {/* Row 2: Questions Number and Time Mode */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <Controller
//                 name="questions_number"
//                 control={control}
//                 render={({ field }) => (
//                   <CustomInput
//                     label={`Number of Questions${
//                       maxQuestions > 0 ? ` (Max: ${maxQuestions})` : ""
//                     }`}
//                     type="number"
//                     min="1"
//                     max={maxQuestions || undefined}
//                     placeholder="1"
//                     error={errors.questions_number?.message}
//                     disabled={createExamMutation.isPending}
//                     {...field}
//                     onChange={(e) =>
//                       field.onChange(parseInt(e.target.value) || 1)
//                     }
//                   />
//                 )}
//               />

//               <Controller
//                 name="time_mode"
//                 control={control}
//                 render={({ field }) => (
//                   <CustomSelect
//                     label="Time Mode"
//                     placeholder="Select time mode"
//                     options={TIME_MODE_OPTIONS}
//                     value={field.value}
//                     onValueChange={field.onChange}
//                     error={errors.time_mode?.message}
//                     disabled={createExamMutation.isPending}
//                   />
//                 )}
//               />
//             </div>

//             {/* Row 3: Question Type and Sections */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <Controller
//                 name="question_type"
//                 control={control}
//                 render={({ field }) => (
//                   <CustomSelect
//                     label="Question Type"
//                     placeholder="Select question type"
//                     options={QUESTION_TYPE_OPTIONS}
//                     value={field.value}
//                     onValueChange={field.onChange}
//                     error={errors.question_type?.message}
//                     disabled={createExamMutation.isPending}
//                   />
//                 )}
//               />

//               {needsSectionSelection && (
//                 <Controller
//                   name="section_id"
//                   control={control}
//                   render={({ field }) => (
//                     <CustomSelect
//                       label="Sections"
//                       placeholder="Select section"
//                       options={sectionOptions}
//                       value={field.value?.toString()}
//                       onValueChange={(value) => field.onChange(parseInt(value))}
//                       error={errors.section_id?.message}
//                       disabled={createExamMutation.isPending}
//                       loading={sectionsLoading}
//                     />
//                   )}
//                 />
//               )}
//             </div>

//             {/* Row 4: Chapters Type */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <Controller
//                 name="chapters_type"
//                 control={control}
//                 render={({ field }) => (
//                   <CustomSelect
//                     label="Chapters Type"
//                     placeholder="Select chapters type"
//                     options={CHAPTER_TYPE_OPTIONS}
//                     value={field.value}
//                     onValueChange={field.onChange}
//                     error={errors.chapters_type?.message}
//                     disabled={createExamMutation.isPending}
//                   />
//                 )}
//               />

//               {/* Placeholder for alignment */}
//               <div></div>
//             </div>

//             {/* Chapters Selector */}
//             {watchedQuestionType && (
//               <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
//                 <ChaptersSelector
//                   control={control}
//                   onMaxQuestionsChange={setMaxQuestions}
//                 />
//               </div>
//             )}

//             {/* Action Buttons */}
//             <div className="flex flex-col sm:flex-row gap-4 pt-6">
//               <CustomButton
//                 type="submit"
//                 className="flex-1 bg-blue-600 hover:bg-blue-700"
//                 size="lg"
//                 loading={createExamMutation.isPending}
//                 disabled={createExamMutation.isPending}
//               >
//                 {createExamMutation.isPending ? (
//                   "Creating Exam..."
//                 ) : (
//                   <>
//                     <CheckCircle className="mr-2 h-4 w-4" />
//                     Create Exam
//                   </>
//                 )}
//               </CustomButton>

//               <CustomButton
//                 type="button"
//                 variant="outline"
//                 onClick={handleReset}
//                 disabled={createExamMutation.isPending}
//                 className="flex-1 sm:flex-initial"
//                 size="lg"
//               >
//                 Reset
//               </CustomButton>
//             </div>

//             {/* Status Messages */}
//             {createExamMutation.error && (
//               <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
//                 <div className="flex items-center gap-2 text-red-600">
//                   <AlertCircle className="h-4 w-4" />
//                   <span className="font-medium">Error creating exam</span>
//                 </div>
//                 <p className="text-sm text-red-600/80 mt-1">
//                   {createExamMutation.error instanceof Error
//                     ? createExamMutation.error.message
//                     : "An unexpected error occurred"}
//                 </p>
//               </div>
//             )}

//             {/* Section Loading Error */}
//             {sectionsError && needsSectionSelection && (
//               <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
//                 <div className="flex items-center gap-2 text-red-600">
//                   <AlertCircle className="h-4 w-4" />
//                   <span className="font-medium">Failed to load sections</span>
//                 </div>
//                 <p className="text-sm text-red-600/80 mt-1">
//                   Please try refreshing the page or contact support if the
//                   problem persists.
//                 </p>
//               </div>
//             )}
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// components/exam/CreateExamForm.tsx

// import React, { useState, useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useRouter } from "next/navigation";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Button } from "@/components/ui/button";
// import { Skeleton } from "@/components/ui/skeleton";
// import { Loader2, AlertCircle, CheckCircle } from "lucide-react";
// import { toast } from "sonner";

// import { ChaptersSelector } from "./ChaptersSelector";

// import { CreateExamFormValues, createExamSchema } from "./validation-exam";
// import {
//   CHAPTER_TYPE_OPTIONS,
//   EXAM_MODE_OPTIONS,
//   QUESTION_TYPE_OPTIONS,
//   QuestionType,
//   TIME_MODE_OPTIONS,
// } from "./exam";
// import {
//   transformFormDataToPayload,
//   useCreateExam,
//   useSections,
// } from "./useExamData";

// export const CreateExamForm: React.FC = () => {
//   const router = useRouter();
//   const [maxQuestions, setMaxQuestions] = useState(0);

//   const form = useForm<CreateExamFormValues>({
//     resolver: zodResolver(createExamSchema),
//     defaultValues: {
//       name: "",
//       mode: undefined,
//       questions_number: 1,
//       time_mode: undefined,
//       question_type: undefined,
//       section_id: undefined,
//       chapters_type: undefined,
//       chapters: [],
//     },
//   });

//   const { watch, setValue, resetField } = form;
//   const watchedQuestionType = watch("question_type");
//   const watchedChaptersType = watch("chapters_type");
//   const watchedQuestionsNumber = watch("questions_number");

//   // Fetch sections based on question type
//   const {
//     data: sections = [],
//     isLoading: sectionsLoading,
//     error: sectionsError,
//   } = useSections(watchedQuestionType as QuestionType);

//   // Create exam mutation
//   const createExamMutation = useCreateExam();

//   // Reset dependent fields when question type changes
//   useEffect(() => {
//     if (watchedQuestionType) {
//       resetField("section_id");
//       resetField("chapters");
//       setMaxQuestions(0);
//     }
//   }, [watchedQuestionType, resetField]);

//   // Reset chapters when chapters_type changes
//   useEffect(() => {
//     if (watchedChaptersType) {
//       resetField("chapters");
//       setMaxQuestions(0);
//     }
//   }, [watchedChaptersType, resetField]);

//   // Update questions_number validation based on max available
//   useEffect(() => {
//     if (maxQuestions > 0 && watchedQuestionsNumber > maxQuestions) {
//       setValue("questions_number", maxQuestions);
//     }
//   }, [maxQuestions, watchedQuestionsNumber, setValue]);

//   // Handle form submission
//   // const onSubmit = async (data: CreateExamFormValues) => {
//   //   try {
//   //     // Validate questions number against max available
//   //     if (maxQuestions > 0 && data.questions_number > maxQuestions) {
//   //       form.setError("questions_number", {
//   //         message: `Maximum ${maxQuestions} questions available`,
//   //       });
//   //       return;
//   //     }

//   //     const payload = transformFormDataToPayload(data);

//   //     await createExamMutation.mutateAsync(payload);

//   //     toast.success("Exam created successfully!");

//   //     // Navigate to exam page (you can customize this route)
//   //     // router.push(`/exam/${examId}`);

//   //     // For now, just reset the form
//   //     form.reset();
//   //     setMaxQuestions(0);
//   //   } catch (error) {
//   //     console.error("Error creating exam:", error);
//   //     toast.error("Failed to create exam. Please try again.");
//   //   }
//   // };
//   // Handle form submission
//   const onSubmit = async (data: CreateExamFormValues) => {
//     try {
//       // Validate questions number against max available
//       if (maxQuestions > 0 && data.questions_number > maxQuestions) {
//         form.setError("questions_number", {
//           message: `Maximum ${maxQuestions} questions available`,
//         });
//         return;
//       }

//       const payload = transformFormDataToPayload(data);

//       // Get the response which should contain the exam ID
//       const response = await createExamMutation.mutateAsync(payload);

//       toast.success("Exam created successfully!");

//       // Navigate to exam page using the exam ID from response
//       // Adjust the property name based on your API response structure
//       const examId = response.id || response.exam_id || response.data?.id;

//       if (examId) {
//         router.push(`/en/exam/${examId}`);
//       } else {
//         console.warn("No exam ID found in response:", response);
//         // Fallback: reset form if no ID is available
//         form.reset();
//         setMaxQuestions(0);
//       }
//     } catch (error) {
//       console.error("Error creating exam:", error);
//       toast.error("Failed to create exam. Please try again.");
//     }
//   };

//   // Handle reset
//   const handleReset = () => {
//     form.reset();
//     setMaxQuestions(0);
//   };

//   // const needsSectionSelection = ["incorrect", "flagged", "unused"].includes(
//   //   watchedQuestionType || ""
//   // );
//   const needsSectionSelection = !!watchedQuestionType;

//   return (
//     <Card className="w-full max-w-4xl mx-auto">
//       <CardHeader>
//         <CardTitle className="text-2xl font-bold text-center">
//           Create Exam
//         </CardTitle>
//       </CardHeader>

//       <CardContent>
//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//             {/* Row 1: Exam Name and Mode */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <FormField
//                 control={form.control}
//                 name="name"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Exam Name</FormLabel>
//                     <FormControl>
//                       <Input
//                         placeholder="Enter exam name"
//                         {...field}
//                         disabled={createExamMutation.isPending}
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="mode"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Exam Mode</FormLabel>
//                     <Select
//                       onValueChange={field.onChange}
//                       defaultValue={field.value}
//                       disabled={createExamMutation.isPending}
//                     >
//                       <FormControl>
//                         <SelectTrigger>
//                           <SelectValue placeholder="Select exam mode" />
//                         </SelectTrigger>
//                       </FormControl>
//                       <SelectContent>
//                         {EXAM_MODE_OPTIONS.map((option) => (
//                           <SelectItem key={option.value} value={option.value}>
//                             {option.label}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </div>

//             {/* Row 2: Questions Number and Time Mode */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <FormField
//                 control={form.control}
//                 name="questions_number"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>
//                       Number of Questions
//                       {maxQuestions > 0 && (
//                         <span className="text-xs text-muted-foreground ml-2">
//                           (Max: {maxQuestions})
//                         </span>
//                       )}
//                     </FormLabel>
//                     <FormControl>
//                       <Input
//                         type="number"
//                         min="1"
//                         max={maxQuestions || undefined}
//                         placeholder="1"
//                         {...field}
//                         onChange={(e) =>
//                           field.onChange(parseInt(e.target.value) || 1)
//                         }
//                         disabled={createExamMutation.isPending}
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="time_mode"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Time Mode</FormLabel>
//                     <Select
//                       onValueChange={field.onChange}
//                       defaultValue={field.value}
//                       disabled={createExamMutation.isPending}
//                     >
//                       <FormControl>
//                         <SelectTrigger>
//                           <SelectValue placeholder="Select time mode" />
//                         </SelectTrigger>
//                       </FormControl>
//                       <SelectContent>
//                         {TIME_MODE_OPTIONS.map((option) => (
//                           <SelectItem key={option.value} value={option.value}>
//                             {option.label}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </div>

//             {/* Row 3: Question Type and Sections */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <FormField
//                 control={form.control}
//                 name="question_type"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Question Type</FormLabel>
//                     <Select
//                       onValueChange={field.onChange}
//                       defaultValue={field.value}
//                       disabled={createExamMutation.isPending}
//                     >
//                       <FormControl>
//                         <SelectTrigger>
//                           <SelectValue placeholder="Select question type" />
//                         </SelectTrigger>
//                       </FormControl>
//                       <SelectContent>
//                         {QUESTION_TYPE_OPTIONS.map((option) => (
//                           <SelectItem key={option.value} value={option.value}>
//                             {option.label}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               {needsSectionSelection && (
//                 <FormField
//                   control={form.control}
//                   name="section_id"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel className="flex items-center gap-2">
//                         Sections
//                         {sectionsLoading && (
//                           <Loader2 className="h-4 w-4 animate-spin" />
//                         )}
//                       </FormLabel>

//                       {sectionsLoading ? (
//                         <Skeleton className="h-10 w-full" />
//                       ) : sectionsError ? (
//                         <div className="flex items-center gap-2 text-sm text-destructive">
//                           <AlertCircle className="h-4 w-4" />
//                           Failed to load sections
//                         </div>
//                       ) : (
//                         <Select
//                           onValueChange={(value) =>
//                             field.onChange(parseInt(value))
//                           }
//                           value={field.value?.toString()}
//                           disabled={createExamMutation.isPending}
//                         >
//                           <FormControl>
//                             <SelectTrigger>
//                               <SelectValue placeholder="Select section" />
//                             </SelectTrigger>
//                           </FormControl>
//                           <SelectContent>
//                             {sections.map((section) => (
//                               <SelectItem
//                                 key={section.id}
//                                 value={section.id.toString()}
//                               >
//                                 {section.title}
//                               </SelectItem>
//                             ))}
//                           </SelectContent>
//                         </Select>
//                       )}
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               )}
//             </div>

//             {/* Row 4: Chapters Type and Chapters */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <FormField
//                 control={form.control}
//                 name="chapters_type"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Chapters Type</FormLabel>
//                     <Select
//                       onValueChange={field.onChange}
//                       defaultValue={field.value}
//                       disabled={createExamMutation.isPending}
//                     >
//                       <FormControl>
//                         <SelectTrigger>
//                           <SelectValue placeholder="Select chapters type" />
//                         </SelectTrigger>
//                       </FormControl>
//                       <SelectContent>
//                         {CHAPTER_TYPE_OPTIONS.map((option) => (
//                           <SelectItem key={option.value} value={option.value}>
//                             {option.label}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               {/* Placeholder for chapters selector alignment */}
//               <div></div>
//             </div>

//             {/* Chapters Selector */}
//             {watchedQuestionType && (
//               <ChaptersSelector
//                 control={form.control}
//                 onMaxQuestionsChange={setMaxQuestions}
//               />
//             )}

//             {/* Action Buttons */}
//             <div className="flex flex-col sm:flex-row gap-4 pt-6">
//               <Button
//                 type="submit"
//                 className="flex-1"
//                 disabled={createExamMutation.isPending}
//               >
//                 {createExamMutation.isPending ? (
//                   <>
//                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                     Creating Exam...
//                   </>
//                 ) : (
//                   <>
//                     <CheckCircle className="mr-2 h-4 w-4" />
//                     Create Exam
//                   </>
//                 )}
//               </Button>

//               <Button
//                 type="button"
//                 variant="outline"
//                 onClick={handleReset}
//                 disabled={createExamMutation.isPending}
//                 className="flex-1 sm:flex-initial"
//               >
//                 Reset
//               </Button>
//             </div>

//             {/* Status Messages */}
//             {createExamMutation.error && (
//               <div className="p-4 bg-destructive/10 border border-destructive rounded-md">
//                 <div className="flex items-center gap-2 text-destructive">
//                   <AlertCircle className="h-4 w-4" />
//                   <span className="font-medium">Error creating exam</span>
//                 </div>
//                 <p className="text-sm text-destructive/80 mt-1">
//                   {createExamMutation.error instanceof Error
//                     ? createExamMutation.error.message
//                     : "An unexpected error occurred"}
//                 </p>
//               </div>
//             )}
//           </form>
//         </Form>
//       </CardContent>
//     </Card>
//   );
// };
