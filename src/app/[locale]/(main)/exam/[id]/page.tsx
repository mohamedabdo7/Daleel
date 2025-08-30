"use client";

import React, { useEffect, useCallback, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { Loader2, AlertTriangle, Wifi, Pause } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useExamSelectors, useExamStore } from "../add/components/useExamStore";
import {
  useExam,
  useExamNavigation,
  useQuestion,
  useSubmitExam,
  useTutorMode, // NEW: Import the tutor mode hook
} from "../add/components/useExamApi";
import Timer from "../add/components/Timer";
import { QuestionDisplay } from "../add/components/QuestionDisplay";
import { QuestionStepper } from "../add/components/QuestionStepper";
import { ExamControls } from "../add/components/ExamControls";

export default function ExamPage() {
  const router = useRouter();
  const params = useParams();
  const examId = params.id as string;

  // Local state for better control
  const [isInitialized, setIsInitialized] = useState(false);
  const [currentQuestionId, setCurrentQuestionId] = useState<string | null>(
    null
  );

  // NEW: Tutor mode specific states
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [checkResult, setCheckResult] = useState<{
    isCorrect: boolean;
    correctAnswer: string;
  } | null>(null);

  // Zustand store
  const {
    initializeExam,
    setCurrentQuestion,
    selectAnswer,
    flagQuestion,
    markQuestionAsSubmitted,
    nextQuestion,
    previousQuestion,
    navigateToQuestion,
    startTimer,
    pauseTimer,
    updateRemainingTime,
    pauseExam,
    resumeExam,
    finishExam,
    setLoading,
    setError,
    resetTimer,
  } = useExamStore();

  // Selectors
  const {
    examData,
    currentQuestion,
    currentIndex,
    totalQuestions,
    answeredCount,
    remainingTime,
    isTimerActive,
    canGoNext,
    canGoPrevious,
    currentAnswer,
    currentQuestionStatus,
    isLoading,
    error,
    isPaused,
    isFinished,
  } = useExamSelectors();

  // API hooks
  const examQuery = useExam(examId);
  const questionQuery = useQuestion(currentQuestionId);
  const { submitAndNavigate, isSubmitting } = useExamNavigation();
  const { checkAnswer, isChecking } = useTutorMode(); // NEW: Tutor mode hook

  // Initialize exam data ONCE
  useEffect(() => {
    if (examQuery.data?.data && !isInitialized) {
      console.log("Initializing exam with data:", examQuery.data.data);

      initializeExam(examQuery.data.data);
      setCurrentQuestionId(examQuery.data.data.current_question?.id || null);
      setIsInitialized(true);

      if (examQuery.data.data.time_mode !== "untimed") {
        startTimer();
      }
    }
  }, [examQuery.data, isInitialized, initializeExam, startTimer]);

  // Update current question when query data changes
  useEffect(() => {
    if (questionQuery.data?.data) {
      console.log("Setting current question:", questionQuery.data.data);
      setCurrentQuestion(questionQuery.data.data);

      // Reset tutor mode states when changing questions
      setIsAnswerChecked(false);
      setCheckResult(null);

      const remainingTime = parseInt(questionQuery.data.data.remaining) || 60;
      updateRemainingTime(remainingTime);
    }
  }, [questionQuery.data, setCurrentQuestion, updateRemainingTime]);

  // Timer management
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isTimerActive && remainingTime > 0 && !isPaused && !isFinished) {
      interval = setInterval(() => {
        updateRemainingTime(remainingTime - 1);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerActive, remainingTime, isPaused, isFinished, updateRemainingTime]);

  // NEW: Handle answer checking in tutor mode
  const handleAnswerCheck = useCallback(
    async (answerId: string) => {
      if (!currentQuestion || !examData || examData.mode !== "tutor") return;

      try {
        console.log("Checking answer in tutor mode:", answerId);

        const result = await checkAnswer(currentQuestion.id, answerId);

        setCheckResult(result);
        setIsAnswerChecked(true);

        // Update question status based on result
        markQuestionAsSubmitted(currentQuestion.id, result.isCorrect);

        // Show toast notification
        if (result.isCorrect) {
          toast.success("Correct! Well done!");
        } else {
          toast.error("Incorrect. Check the correct answer below.");
        }
      } catch (error) {
        console.error("Failed to check answer:", error);
        toast.error("Failed to check answer. Please try again.");
      }
    },
    [currentQuestion, examData, checkAnswer, markQuestionAsSubmitted]
  );

  const prepareExamSubmissionData = useCallback(() => {
    if (!examData) return null;

    const questionsAnswers = useExamStore.getState().questionsAnswers;
    const questionsIds = useExamStore.getState().questionsIds;

    // Prepare questions array with answers
    const questions = questionsIds.map((questionId) => ({
      question_id: questionId,
      answer_id: questionsAnswers[questionId] || "", // Empty string for unanswered
    }));

    return {
      exam_id: examData.id,
      questions,
    };
  }, [examData]);
  const [isSubmittingExam, setIsSubmittingExam] = useState(false);

  // Add this hook after existing hooks
  const submitExamMutation = useSubmitExam();

  // Add this function to handle full exam submission
  const handleSubmitExam = useCallback(async () => {
    if (!examData) return;

    const submissionData = prepareExamSubmissionData();
    if (!submissionData) {
      toast.error("Failed to prepare exam data for submission.");
      return;
    }

    setIsSubmittingExam(true);
    pauseTimer();

    try {
      console.log("Submitting entire exam with data:", submissionData);

      const response = await submitExamMutation.mutateAsync(submissionData);

      if (response?.data) {
        finishExam();
        toast.success("Exam submitted successfully!");

        // Redirect to results page
        router.push(`/en/exam/${examId}/results`);
      }
    } catch (error) {
      console.error("Failed to submit exam:", error);
      toast.error("Failed to submit exam. Please try again.");
      setIsSubmittingExam(false);
    }
  }, [
    examData,
    prepareExamSubmissionData,
    submitExamMutation,
    finishExam,
    pauseTimer,
    router,
    examId,
  ]);

  // Handle question submission (for both modes)
  const handleSubmitQuestion = useCallback(
    async (answerId?: string) => {
      if (!currentQuestion || !examData) return;

      const answerToSubmit = answerId || currentAnswer;
      if (!answerToSubmit) {
        toast.error("Please select an answer before submitting.");
        return;
      }

      try {
        console.log(
          "Submitting question:",
          currentQuestion.id,
          "with answer:",
          answerToSubmit
        );

        const response = await submitAndNavigate(
          examData.id,
          currentQuestion.id,
          answerToSubmit
        );

        if (response?.data) {
          setCurrentQuestion(response.data);

          // Mark as submitted (different status for different modes)
          if (examData.mode === "test") {
            markQuestionAsSubmitted(currentQuestion.id);
            toast.success("Answer submitted successfully.");
          } else if (examData.mode === "tutor") {
            toast.success("Answer recorded successfully.");
          }

          // NEW: Check if this was the last question
          const isLastQuestion = currentIndex === totalQuestions - 1;
          if (isLastQuestion) {
            // Auto-submit the entire exam after a brief delay
            toast.info("Last question submitted. Submitting exam...");
            setTimeout(() => {
              handleSubmitExam();
            }, 1500);
          }
        }
      } catch (error) {
        console.error("Failed to submit question:", error);
        toast.error("Failed to submit answer. Please try again.");
      }
    },
    [
      currentQuestion,
      examData,
      currentAnswer,
      currentIndex,
      totalQuestions,
      submitAndNavigate,
      setCurrentQuestion,
      markQuestionAsSubmitted,
      handleSubmitExam,
    ]
  );

  // Handle answer selection - MODIFIED FOR TUTOR MODE
  const handleAnswerSelect = useCallback(
    async (answerId: string) => {
      if (!examData) return;

      // Check if question is already submitted/answered (use correct status values)
      const isQuestionSubmitted =
        currentQuestionStatus === "correct" ||
        currentQuestionStatus === "incorrect" ||
        currentQuestionStatus === "checked";

      // Prevent selection if question is already submitted (test mode)
      if (examData.mode === "test" && isQuestionSubmitted) {
        toast.error(
          "This question is already submitted and cannot be changed."
        );
        return;
      }

      // Prevent selection if already checked in tutor mode
      if (examData.mode === "tutor" && isAnswerChecked) {
        toast.info(
          "This question has already been answered and cannot be changed."
        );
        return;
      }

      console.log("Selecting answer:", answerId);
      selectAnswer(answerId);

      // NEW: Different behavior for different modes
      if (examData.mode === "tutor") {
        // In tutor mode: check answer immediately, don't submit
        await handleAnswerCheck(answerId);
      } else if (examData.mode === "test") {
        // In test mode: just select, don't submit (submit on Next button)
        // No immediate action needed
      }
    },
    [
      examData,
      currentQuestionStatus,
      isAnswerChecked,
      selectAnswer,
      handleAnswerCheck,
    ]
  );

  // Navigation handlers - MODIFIED
  const handleNext = useCallback(() => {
    if (!canGoNext || !examData) return;

    const isLastQuestion = currentIndex === totalQuestions - 1;

    console.log("Moving to next question. Is last question:", isLastQuestion);

    // Check if question is already submitted
    const isQuestionSubmitted =
      currentQuestionStatus === "correct" ||
      currentQuestionStatus === "incorrect" ||
      currentQuestionStatus === "checked";

    // In test mode: submit current answer if exists and not already submitted
    if (examData.mode === "test" && currentAnswer && !isQuestionSubmitted) {
      if (isLastQuestion) {
        // For last question in test mode, submit question then submit exam
        handleSubmitQuestion();
      } else {
        // For non-last questions, just submit and move to next
        handleSubmitQuestion().then(() => {
          navigateToNextQuestion();
        });
      }
      return;
    }

    // In tutor mode: answer should already be checked, so just submit and navigate
    if (examData.mode === "tutor" && isAnswerChecked && currentAnswer) {
      if (isLastQuestion) {
        // For last question in tutor mode, submit question then submit exam
        handleSubmitQuestion();
      } else {
        // Submit the answer first, then navigate
        handleSubmitQuestion().then(() => {
          navigateToNextQuestion();
        });
      }
      return;
    }

    // Direct navigation (for unanswered questions or already submitted)
    if (!isLastQuestion) {
      navigateToNextQuestion();
    }
  }, [
    canGoNext,
    examData,
    currentAnswer,
    currentQuestionStatus,
    isAnswerChecked,
    currentIndex,
    totalQuestions,
    handleSubmitQuestion,
  ]);

  const navigateToNextQuestion = useCallback(() => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < totalQuestions && examData?.questions) {
      const nextQuestionId = examData.questions[nextIndex]?.id;
      if (nextQuestionId) {
        setCurrentQuestionId(nextQuestionId);
        nextQuestion();

        // Reset timer for next question
        if (examData.time_mode !== "untimed") {
          resetTimer();
        }
      }
    }
  }, [currentIndex, totalQuestions, examData, nextQuestion, resetTimer]);

  // Handle time up
  const handleTimeUp = useCallback(() => {
    console.log("Time up for current question");

    if (!currentQuestion || isPaused || isFinished) return;

    pauseTimer();

    // Check if question is already submitted
    const isQuestionSubmitted =
      currentQuestionStatus === "correct" ||
      currentQuestionStatus === "incorrect" ||
      currentQuestionStatus === "checked";

    if (currentQuestionStatus === "flagged" || isQuestionSubmitted) {
      return;
    }

    if (currentAnswer && !isQuestionSubmitted) {
      handleSubmitQuestion();
    } else {
      markQuestionAsSubmitted(currentQuestion.id);
      toast.warning("Time up! Moving to next question.");

      setTimeout(() => {
        handleNext();
      }, 1000);
    }
  }, [
    currentQuestion,
    currentAnswer,
    currentQuestionStatus,
    isPaused,
    isFinished,
    pauseTimer,
    markQuestionAsSubmitted,
    handleSubmitQuestion,
    handleNext,
  ]);

  const handlePrevious = useCallback(() => {
    if (!canGoPrevious || !examData) return;

    console.log("Moving to previous question");

    const prevIndex = currentIndex - 1;
    if (prevIndex >= 0 && examData.questions) {
      const prevQuestionId = examData.questions[prevIndex]?.id;
      if (prevQuestionId) {
        setCurrentQuestionId(prevQuestionId);
        previousQuestion();

        if (examData.time_mode !== "untimed") {
          resetTimer();
        }
      }
    }
  }, [canGoPrevious, examData, currentIndex, previousQuestion, resetTimer]);

  const handleQuestionSelect = useCallback(
    (index: number) => {
      if (!examData?.questions) return;

      const questionId = examData.questions[index]?.id;
      if (questionId) {
        console.log("Navigating to question index:", index);
        setCurrentQuestionId(questionId);
        navigateToQuestion(index);

        if (examData.time_mode !== "untimed") {
          resetTimer();
        }
      }
    },
    [examData, navigateToQuestion, resetTimer]
  );

  // Exam control handlers
  const handlePauseExam = useCallback(() => {
    if (isPaused) {
      resumeExam();
      if (examData?.time_mode !== "untimed") {
        startTimer();
      }
      toast.success("Exam resumed.");
    } else {
      pauseExam();
      pauseTimer();
      toast.info("Exam paused.");
    }
  }, [isPaused, resumeExam, startTimer, pauseExam, pauseTimer, examData]);

  const handleFinishExam = useCallback(async () => {
    if (!examData) return;

    console.log("Manual finish exam requested");
    await handleSubmitExam();
  }, [examData, handleSubmitExam]);

  const handleClearAnswers = useCallback(() => {
    useExamStore.setState((state) => ({
      questionsAnswers: {},
      questionsStatus: Object.fromEntries(
        state.questionsIds.map((id) => [id, "unanswered"])
      ),
    }));

    // Reset tutor mode states
    setIsAnswerChecked(false);
    setCheckResult(null);

    toast.success("All answers cleared.");
  }, []);

  // Loading states
  if (examQuery.isLoading || isLoading || !isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8">
          <CardContent className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <p className="text-lg font-medium">Loading exam...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error states
  if (examQuery.error || error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Error Loading Exam</h2>
            <p className="text-gray-600 mb-4">
              {examQuery.error?.message || error || "Failed to load exam data."}
            </p>
            <Button onClick={() => router.push("/exams")} className="w-full">
              Back to Exams
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // No exam data
  if (!examData || !currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8">
          <CardContent className="text-center">
            <p className="text-lg">No exam data found.</p>
            <Button onClick={() => router.push("/exams")} className="mt-4">
              Back to Exams
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const questionsIds = useExamStore.getState().questionsIds;
  const questionsStatus = useExamStore.getState().questionsStatus;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold text-gray-900">
                {examData.name}
              </h1>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="capitalize">{examData.mode} Mode</span>
                {examData.time_mode !== "untimed" && (
                  <>
                    <span>•</span>
                    <span>
                      {examData.time_mode === "timed" ? "60s" : "90s"} per
                      question
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Timer */}
            {examData.time_mode !== "untimed" && (
              <Timer
                remainingTime={remainingTime}
                isActive={isTimerActive}
                onTimeUp={handleTimeUp}
                onPause={handlePauseExam}
                onResume={handlePauseExam}
                showControls={true}
              />
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Question Stepper - Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <QuestionStepper
                questionsCount={totalQuestions}
                currentIndex={currentIndex}
                questionsStatus={questionsStatus}
                questionsIds={questionsIds}
                onQuestionSelect={handleQuestionSelect}
                allowNavigation={true}
                examMode={examData.mode}
              />

              {/* Connection Status */}
              <div className="mt-4 p-3 bg-white rounded-lg border">
                <div className="flex items-center gap-2 text-sm">
                  <Wifi className="h-4 w-4 text-green-600" />
                  <span className="text-green-700">Connected</span>
                </div>
              </div>
            </div>
          </div>

          {/* Question Content */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              {/* Pause Alert */}
              {isPaused && (
                <Alert>
                  <Pause className="h-4 w-4" />
                  <AlertDescription>
                    Exam is paused. Click Resume to continue.
                  </AlertDescription>
                </Alert>
              )}

              {/* Question Display - MODIFIED for tutor mode */}
              <QuestionDisplay
                question={currentQuestion}
                selectedAnswerId={currentAnswer}
                isSubmitted={
                  currentQuestionStatus === "correct" ||
                  currentQuestionStatus === "incorrect" ||
                  currentQuestionStatus === "checked" ||
                  (examData.mode === "tutor" && isAnswerChecked)
                }
                showResult={
                  examData.mode === "tutor" && isAnswerChecked && checkResult
                }
                examMode={examData.mode}
                questionNumber={currentIndex + 1}
                totalQuestions={totalQuestions}
                onAnswerSelect={handleAnswerSelect}
                onFlag={() => flagQuestion()}
                disabled={isPaused || isFinished || isChecking}
                // NEW: Pass check result for tutor mode
                checkResult={checkResult}
              />

              {/* Controls - MODIFIED */}
              <ExamControls
                canGoPrevious={canGoPrevious}
                canGoNext={canGoNext}
                onPrevious={handlePrevious}
                onNext={handleNext}
                hasSelectedAnswer={!!currentAnswer}
                // For tutor mode, show submit button only after answer is checked
                onSubmitQuestion={
                  examData.mode === "tutor" && isAnswerChecked
                    ? handleSubmitQuestion
                    : undefined
                }
                onGradeExam={handleFinishExam}
                onPauseExam={handlePauseExam}
                onClearAnswers={handleClearAnswers}
                examMode={examData.mode}
                isPaused={isPaused}
                isSubmitting={isSubmitting || isChecking || isSubmittingExam} // Add exam submission state
                isLastQuestion={!canGoNext}
                totalQuestions={totalQuestions}
                answeredCount={answeredCount}
                // NEW: Pass tutor mode specific states
                isAnswerChecked={isAnswerChecked}
                isChecking={isChecking}
              />
              {isSubmittingExam && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <Card className="p-8">
                    <CardContent className="flex flex-col items-center gap-4">
                      <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                      <p className="text-lg font-medium">Submitting exam...</p>
                      <p className="text-sm text-gray-600">
                        Please wait while we process your answers.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// "use client";

// import React, { useEffect, useCallback, useState } from "react";
// import { useRouter, useParams } from "next/navigation";
// import { toast } from "sonner";
// import { Loader2, AlertTriangle, Wifi, Pause } from "lucide-react";

// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import { useExamSelectors, useExamStore } from "../add/components/useExamStore";
// import {
//   useExam,
//   useExamNavigation,
//   useQuestion,
//   useSubmitExam,
//   useTutorMode, // NEW: Import the tutor mode hook
// } from "../add/components/useExamApi";
// import Timer from "../add/components/Timer";
// import { QuestionDisplay } from "../add/components/QuestionDisplay";
// import { QuestionStepper } from "../add/components/QuestionStepper";
// import { ExamControls } from "../add/components/ExamControls";

// export default function ExamPage() {
//   const router = useRouter();
//   const params = useParams();
//   const examId = params.id as string;

//   // Local state for better control
//   const [isInitialized, setIsInitialized] = useState(false);
//   const [currentQuestionId, setCurrentQuestionId] = useState<string | null>(
//     null
//   );

//   // NEW: Tutor mode specific states
//   const [isAnswerChecked, setIsAnswerChecked] = useState(false);
//   const [checkResult, setCheckResult] = useState<{
//     isCorrect: boolean;
//     correctAnswer: string;
//   } | null>(null);

//   // Zustand store
//   const {
//     initializeExam,
//     setCurrentQuestion,
//     selectAnswer,
//     flagQuestion,
//     markQuestionAsSubmitted,
//     nextQuestion,
//     previousQuestion,
//     navigateToQuestion,
//     startTimer,
//     pauseTimer,
//     updateRemainingTime,
//     pauseExam,
//     resumeExam,
//     finishExam,
//     setLoading,
//     setError,
//     resetTimer,
//   } = useExamStore();

//   // Selectors
//   const {
//     examData,
//     currentQuestion,
//     currentIndex,
//     totalQuestions,
//     answeredCount,
//     remainingTime,
//     isTimerActive,
//     canGoNext,
//     canGoPrevious,
//     currentAnswer,
//     currentQuestionStatus,
//     isLoading,
//     error,
//     isPaused,
//     isFinished,
//   } = useExamSelectors();

//   // API hooks
//   const examQuery = useExam(examId);
//   const questionQuery = useQuestion(currentQuestionId);
//   const { submitAndNavigate, isSubmitting } = useExamNavigation();
//   const { checkAnswer, isChecking } = useTutorMode(); // NEW: Tutor mode hook

//   // Initialize exam data ONCE
//   useEffect(() => {
//     if (examQuery.data?.data && !isInitialized) {
//       console.log("Initializing exam with data:", examQuery.data.data);

//       initializeExam(examQuery.data.data);
//       setCurrentQuestionId(examQuery.data.data.current_question?.id || null);
//       setIsInitialized(true);

//       if (examQuery.data.data.time_mode !== "untimed") {
//         startTimer();
//       }
//     }
//   }, [examQuery.data, isInitialized, initializeExam, startTimer]);

//   // Update current question when query data changes
//   useEffect(() => {
//     if (questionQuery.data?.data) {
//       console.log("Setting current question:", questionQuery.data.data);
//       setCurrentQuestion(questionQuery.data.data);

//       // Reset tutor mode states when changing questions
//       setIsAnswerChecked(false);
//       setCheckResult(null);

//       const remainingTime = parseInt(questionQuery.data.data.remaining) || 60;
//       updateRemainingTime(remainingTime);
//     }
//   }, [questionQuery.data, setCurrentQuestion, updateRemainingTime]);

//   // Timer management
//   useEffect(() => {
//     let interval: NodeJS.Timeout;

//     if (isTimerActive && remainingTime > 0 && !isPaused && !isFinished) {
//       interval = setInterval(() => {
//         updateRemainingTime(remainingTime - 1);
//       }, 1000);
//     }

//     return () => {
//       if (interval) clearInterval(interval);
//     };
//   }, [isTimerActive, remainingTime, isPaused, isFinished, updateRemainingTime]);

//   // NEW: Handle answer checking in tutor mode
//   const handleAnswerCheck = useCallback(
//     async (answerId: string) => {
//       if (!currentQuestion || !examData || examData.mode !== "tutor") return;

//       try {
//         console.log("Checking answer in tutor mode:", answerId);

//         const result = await checkAnswer(currentQuestion.id, answerId);

//         setCheckResult(result);
//         setIsAnswerChecked(true);

//         // Update question status based on result
//         markQuestionAsSubmitted(currentQuestion.id, result.isCorrect);

//         // Show toast notification
//         if (result.isCorrect) {
//           toast.success("Correct! Well done!");
//         } else {
//           toast.error("Incorrect. Check the correct answer below.");
//         }
//       } catch (error) {
//         console.error("Failed to check answer:", error);
//         toast.error("Failed to check answer. Please try again.");
//       }
//     },
//     [currentQuestion, examData, checkAnswer, markQuestionAsSubmitted]
//   );

//   const prepareExamSubmissionData = useCallback(() => {
//     if (!examData) return null;

//     const questionsAnswers = useExamStore.getState().questionsAnswers;
//     const questionsIds = useExamStore.getState().questionsIds;

//     // Prepare questions array with answers
//     const questions = questionsIds.map((questionId) => ({
//       question_id: questionId,
//       answer_id: questionsAnswers[questionId] || "", // Empty string for unanswered
//     }));

//     return {
//       exam_id: examData.id,
//       questions,
//     };
//   }, [examData]);
//   const [isSubmittingExam, setIsSubmittingExam] = useState(false);

//   // Add this hook after existing hooks
//   const submitExamMutation = useSubmitExam();

//   // Add this function to handle full exam submission
//   const handleSubmitExam = useCallback(async () => {
//     if (!examData) return;

//     const submissionData = prepareExamSubmissionData();
//     if (!submissionData) {
//       toast.error("Failed to prepare exam data for submission.");
//       return;
//     }

//     setIsSubmittingExam(true);
//     pauseTimer();

//     try {
//       console.log("Submitting entire exam with data:", submissionData);

//       const response = await submitExamMutation.mutateAsync(submissionData);

//       if (response?.data) {
//         finishExam();
//         toast.success("Exam submitted successfully!");

//         // Redirect to results page
//         router.push(`/en/exam/${examId}/results`);
//       }
//     } catch (error) {
//       console.error("Failed to submit exam:", error);
//       toast.error("Failed to submit exam. Please try again.");
//       setIsSubmittingExam(false);
//     }
//   }, [
//     examData,
//     prepareExamSubmissionData,
//     submitExamMutation,
//     finishExam,
//     pauseTimer,
//     router,
//     examId,
//   ]);

//   // Handle question submission (for both modes)
//   const handleSubmitQuestion = useCallback(
//     async (answerId?: string) => {
//       if (!currentQuestion || !examData) return;

//       const answerToSubmit = answerId || currentAnswer;
//       if (!answerToSubmit) {
//         toast.error("Please select an answer before submitting.");
//         return;
//       }

//       try {
//         console.log(
//           "Submitting question:",
//           currentQuestion.id,
//           "with answer:",
//           answerToSubmit
//         );

//         const response = await submitAndNavigate(
//           examData.id,
//           currentQuestion.id,
//           answerToSubmit
//         );

//         if (response?.data) {
//           setCurrentQuestion(response.data);

//           // Mark as submitted (locked for test mode)
//           if (examData.mode === "test") {
//             markQuestionAsSubmitted(currentQuestion.id);
//             toast.success("Answer submitted successfully.");
//           } else if (examData.mode === "tutor") {
//             toast.success("Answer recorded successfully.");
//           }

//           // NEW: Check if this was the last question
//           const isLastQuestion = currentIndex === totalQuestions - 1;
//           if (isLastQuestion) {
//             // Auto-submit the entire exam after a brief delay
//             toast.info("Last question submitted. Submitting exam...");
//             setTimeout(() => {
//               handleSubmitExam();
//             }, 1500);
//           }
//         }
//       } catch (error) {
//         console.error("Failed to submit question:", error);
//         toast.error("Failed to submit answer. Please try again.");
//       }
//     },
//     [
//       currentQuestion,
//       examData,
//       currentAnswer,
//       currentIndex,
//       totalQuestions,
//       submitAndNavigate,
//       setCurrentQuestion,
//       markQuestionAsSubmitted,
//       handleSubmitExam,
//     ]
//   );

//   // Handle answer selection - MODIFIED FOR TUTOR MODE
//   const handleAnswerSelect = useCallback(
//     async (answerId: string) => {
//       if (!examData) return;

//       // Prevent selection if question is already locked (test mode)
//       if (examData.mode === "test" && currentQuestionStatus === "locked") {
//         toast.error("This question is locked and cannot be changed.");
//         return;
//       }

//       // Prevent selection if already checked in tutor mode
//       if (examData.mode === "tutor" && isAnswerChecked) {
//         toast.info(
//           "This question has already been answered and cannot be changed."
//         );
//         return;
//       }

//       console.log("Selecting answer:", answerId);
//       selectAnswer(answerId);

//       // NEW: Different behavior for different modes
//       if (examData.mode === "tutor") {
//         // In tutor mode: check answer immediately, don't submit
//         await handleAnswerCheck(answerId);
//       } else if (examData.mode === "test") {
//         // In test mode: just select, don't submit (submit on Next button)
//         // No immediate action needed
//       }
//     },
//     [
//       examData,
//       currentQuestionStatus,
//       isAnswerChecked,
//       selectAnswer,
//       handleAnswerCheck,
//     ]
//   );

//   // Navigation handlers - MODIFIED
//   const handleNext = useCallback(() => {
//     if (!canGoNext || !examData) return;

//     const isLastQuestion = currentIndex === totalQuestions - 1;

//     console.log("Moving to next question. Is last question:", isLastQuestion);

//     // In test mode: submit current answer if exists and not already submitted
//     if (
//       examData.mode === "test" &&
//       currentAnswer &&
//       currentQuestionStatus !== "locked"
//     ) {
//       if (isLastQuestion) {
//         // For last question in test mode, submit question then submit exam
//         handleSubmitQuestion();
//       } else {
//         // For non-last questions, just submit and move to next
//         handleSubmitQuestion().then(() => {
//           navigateToNextQuestion();
//         });
//       }
//       return;
//     }

//     // In tutor mode: answer should already be checked, so just submit and navigate
//     if (examData.mode === "tutor" && isAnswerChecked && currentAnswer) {
//       if (isLastQuestion) {
//         // For last question in tutor mode, submit question then submit exam
//         handleSubmitQuestion();
//       } else {
//         // Submit the answer first, then navigate
//         handleSubmitQuestion().then(() => {
//           navigateToNextQuestion();
//         });
//       }
//       return;
//     }

//     // Direct navigation (for unanswered questions or already submitted)
//     if (!isLastQuestion) {
//       navigateToNextQuestion();
//     }
//   }, [
//     canGoNext,
//     examData,
//     currentAnswer,
//     currentQuestionStatus,
//     isAnswerChecked,
//     currentIndex,
//     totalQuestions,
//     handleSubmitQuestion,
//   ]);

//   const navigateToNextQuestion = useCallback(() => {
//     const nextIndex = currentIndex + 1;
//     if (nextIndex < totalQuestions && examData?.questions) {
//       const nextQuestionId = examData.questions[nextIndex]?.id;
//       if (nextQuestionId) {
//         setCurrentQuestionId(nextQuestionId);
//         nextQuestion();

//         // Reset timer for next question
//         if (examData.time_mode !== "untimed") {
//           resetTimer();
//         }
//       }
//     }
//   }, [currentIndex, totalQuestions, examData, nextQuestion, resetTimer]);

//   // Handle time up
//   const handleTimeUp = useCallback(() => {
//     console.log("Time up for current question");

//     if (!currentQuestion || isPaused || isFinished) return;

//     pauseTimer();

//     if (
//       currentQuestionStatus === "skipped" ||
//       currentQuestionStatus === "locked"
//     ) {
//       return;
//     }

//     if (currentAnswer && currentQuestionStatus !== "locked") {
//       handleSubmitQuestion();
//     } else {
//       markQuestionAsSubmitted(currentQuestion.id);
//       toast.warning("Time up! Moving to next question.");

//       setTimeout(() => {
//         handleNext();
//       }, 1000);
//     }
//   }, [
//     currentQuestion,
//     currentAnswer,
//     currentQuestionStatus,
//     isPaused,
//     isFinished,
//     pauseTimer,
//     markQuestionAsSubmitted,
//     handleSubmitQuestion,
//     handleNext,
//   ]);

//   const handlePrevious = useCallback(() => {
//     if (!canGoPrevious || !examData) return;

//     console.log("Moving to previous question");

//     const prevIndex = currentIndex - 1;
//     if (prevIndex >= 0 && examData.questions) {
//       const prevQuestionId = examData.questions[prevIndex]?.id;
//       if (prevQuestionId) {
//         setCurrentQuestionId(prevQuestionId);
//         previousQuestion();

//         if (examData.time_mode !== "untimed") {
//           resetTimer();
//         }
//       }
//     }
//   }, [canGoPrevious, examData, currentIndex, previousQuestion, resetTimer]);

//   const handleQuestionSelect = useCallback(
//     (index: number) => {
//       if (!examData?.questions) return;

//       const questionId = examData.questions[index]?.id;
//       if (questionId) {
//         console.log("Navigating to question index:", index);
//         setCurrentQuestionId(questionId);
//         navigateToQuestion(index);

//         if (examData.time_mode !== "untimed") {
//           resetTimer();
//         }
//       }
//     },
//     [examData, navigateToQuestion, resetTimer]
//   );

//   // Exam control handlers
//   const handlePauseExam = useCallback(() => {
//     if (isPaused) {
//       resumeExam();
//       if (examData?.time_mode !== "untimed") {
//         startTimer();
//       }
//       toast.success("Exam resumed.");
//     } else {
//       pauseExam();
//       pauseTimer();
//       toast.info("Exam paused.");
//     }
//   }, [isPaused, resumeExam, startTimer, pauseExam, pauseTimer, examData]);

//   const handleFinishExam = useCallback(async () => {
//     if (!examData) return;

//     console.log("Manual finish exam requested");
//     await handleSubmitExam();
//   }, [examData, handleSubmitExam]);

//   const handleClearAnswers = useCallback(() => {
//     useExamStore.setState((state) => ({
//       questionsAnswers: {},
//       questionsStatus: Object.fromEntries(
//         state.questionsIds.map((id) => [id, "unanswered"])
//       ),
//     }));

//     // Reset tutor mode states
//     setIsAnswerChecked(false);
//     setCheckResult(null);

//     toast.success("All answers cleared.");
//   }, []);

//   // Loading states
//   if (examQuery.isLoading || isLoading || !isInitialized) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <Card className="p-8">
//           <CardContent className="flex flex-col items-center gap-4">
//             <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
//             <p className="text-lg font-medium">Loading exam...</p>
//           </CardContent>
//         </Card>
//       </div>
//     );
//   }

//   // Error states
//   if (examQuery.error || error) {
//     return (
//       <div className="min-h-screen flex items-center justify-center p-4">
//         <Card className="max-w-md w-full">
//           <CardContent className="p-6 text-center">
//             <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
//             <h2 className="text-xl font-semibold mb-2">Error Loading Exam</h2>
//             <p className="text-gray-600 mb-4">
//               {examQuery.error?.message || error || "Failed to load exam data."}
//             </p>
//             <Button onClick={() => router.push("/exams")} className="w-full">
//               Back to Exams
//             </Button>
//           </CardContent>
//         </Card>
//       </div>
//     );
//   }

//   // No exam data
//   if (!examData || !currentQuestion) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <Card className="p-8">
//           <CardContent className="text-center">
//             <p className="text-lg">No exam data found.</p>
//             <Button onClick={() => router.push("/exams")} className="mt-4">
//               Back to Exams
//             </Button>
//           </CardContent>
//         </Card>
//       </div>
//     );
//   }

//   const questionsIds = useExamStore.getState().questionsIds;
//   const questionsStatus = useExamStore.getState().questionsStatus;

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <div className="bg-white border-b shadow-sm sticky top-0 z-50">
//         <div className="max-w-7xl mx-auto px-4 py-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               <h1 className="text-xl font-bold text-gray-900">
//                 {examData.name}
//               </h1>
//               <div className="flex items-center gap-2 text-sm text-gray-600">
//                 <span className="capitalize">{examData.mode} Mode</span>
//                 {examData.time_mode !== "untimed" && (
//                   <>
//                     <span>•</span>
//                     <span>
//                       {examData.time_mode === "timed" ? "60s" : "90s"} per
//                       question
//                     </span>
//                   </>
//                 )}
//               </div>
//             </div>

//             {/* Timer */}
//             {examData.time_mode !== "untimed" && (
//               <Timer
//                 remainingTime={remainingTime}
//                 isActive={isTimerActive}
//                 onTimeUp={handleTimeUp}
//                 onPause={handlePauseExam}
//                 onResume={handlePauseExam}
//                 showControls={true}
//               />
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="max-w-7xl mx-auto px-4 py-6">
//         <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
//           {/* Question Stepper - Sidebar */}
//           <div className="lg:col-span-1">
//             <div className="sticky top-24">
//               <QuestionStepper
//                 questionsCount={totalQuestions}
//                 currentIndex={currentIndex}
//                 questionsStatus={questionsStatus}
//                 questionsIds={questionsIds}
//                 onQuestionSelect={handleQuestionSelect}
//                 allowNavigation={true}
//                 examMode={examData.mode}
//               />

//               {/* Connection Status */}
//               <div className="mt-4 p-3 bg-white rounded-lg border">
//                 <div className="flex items-center gap-2 text-sm">
//                   <Wifi className="h-4 w-4 text-green-600" />
//                   <span className="text-green-700">Connected</span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Question Content */}
//           <div className="lg:col-span-3">
//             <div className="space-y-6">
//               {/* Pause Alert */}
//               {isPaused && (
//                 <Alert>
//                   <Pause className="h-4 w-4" />
//                   <AlertDescription>
//                     Exam is paused. Click Resume to continue.
//                   </AlertDescription>
//                 </Alert>
//               )}

//               {/* Question Display - MODIFIED for tutor mode */}
//               <QuestionDisplay
//                 question={currentQuestion}
//                 selectedAnswerId={currentAnswer}
//                 isSubmitted={
//                   currentQuestionStatus === "locked" ||
//                   currentQuestionStatus === "correct" ||
//                   currentQuestionStatus === "incorrect" ||
//                   (examData.mode === "tutor" && isAnswerChecked)
//                 }
//                 showResult={
//                   examData.mode === "tutor" && isAnswerChecked && checkResult
//                 }
//                 examMode={examData.mode}
//                 questionNumber={currentIndex + 1}
//                 totalQuestions={totalQuestions}
//                 onAnswerSelect={handleAnswerSelect}
//                 onFlag={() => flagQuestion()}
//                 disabled={isPaused || isFinished || isChecking}
//                 // NEW: Pass check result for tutor mode
//                 checkResult={checkResult}
//               />

//               {/* Controls - MODIFIED */}
//               <ExamControls
//                 canGoPrevious={canGoPrevious}
//                 canGoNext={canGoNext}
//                 onPrevious={handlePrevious}
//                 onNext={handleNext}
//                 hasSelectedAnswer={!!currentAnswer}
//                 // For tutor mode, show submit button only after answer is checked
//                 onSubmitQuestion={
//                   examData.mode === "tutor" && isAnswerChecked
//                     ? handleSubmitQuestion
//                     : undefined
//                 }
//                 onGradeExam={handleFinishExam}
//                 onPauseExam={handlePauseExam}
//                 onClearAnswers={handleClearAnswers}
//                 examMode={examData.mode}
//                 isPaused={isPaused}
//                 isSubmitting={isSubmitting || isChecking || isSubmittingExam} // Add exam submission state
//                 isLastQuestion={!canGoNext}
//                 totalQuestions={totalQuestions}
//                 answeredCount={answeredCount}
//                 // NEW: Pass tutor mode specific states
//                 isAnswerChecked={isAnswerChecked}
//                 isChecking={isChecking}
//               />
//               {isSubmittingExam && (
//                 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//                   <Card className="p-8">
//                     <CardContent className="flex flex-col items-center gap-4">
//                       <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
//                       <p className="text-lg font-medium">Submitting exam...</p>
//                       <p className="text-sm text-gray-600">
//                         Please wait while we process your answers.
//                       </p>
//                     </CardContent>
//                   </Card>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
