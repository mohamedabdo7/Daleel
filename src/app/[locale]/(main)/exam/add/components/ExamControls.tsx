// components/exam/ExamControls.tsx - UPDATED FOR SUBMIT EXAM FUNCTIONALITY

import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Pause,
  RotateCcw,
  Send,
  Play,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ExamControlsProps {
  // Navigation
  canGoPrevious: boolean;
  canGoNext: boolean;
  onPrevious: () => void;
  onNext: () => void;

  // Question actions
  hasSelectedAnswer: boolean;
  onSubmitQuestion?: () => void; // For tutor mode after checking

  // Exam actions
  onGradeExam: () => void;
  onPauseExam: () => void;
  onClearAnswers: () => void;

  // State
  examMode: "test" | "tutor";
  isPaused: boolean;
  isSubmitting: boolean;
  isLastQuestion: boolean;
  totalQuestions: number;
  answeredCount: number;

  // NEW: Tutor mode specific props
  isAnswerChecked?: boolean;
  isChecking?: boolean;

  className?: string;
}

export const ExamControls: React.FC<ExamControlsProps> = ({
  canGoPrevious,
  canGoNext,
  onPrevious,
  onNext,
  hasSelectedAnswer,
  onSubmitQuestion,
  onGradeExam,
  onPauseExam,
  onClearAnswers,
  examMode,
  isPaused,
  isSubmitting,
  isLastQuestion,
  totalQuestions,
  answeredCount,
  isAnswerChecked = false,
  isChecking = false,
  className,
}) => {
  const [showGradeDialog, setShowGradeDialog] = useState(false);
  const [showClearDialog, setShowClearDialog] = useState(false);

  const getNextButtonText = () => {
    if (examMode === "tutor") {
      if (!hasSelectedAnswer) {
        return "Select an answer";
      }
      if (!isAnswerChecked) {
        return "Checking...";
      }
      if (onSubmitQuestion) {
        return isLastQuestion ? "Submit & Finish Exam" : "Submit & Next";
      }
      return isLastQuestion ? "Finish Exam" : "Next Question";
    }

    // Test mode
    if (isLastQuestion) {
      return hasSelectedAnswer ? "Submit & Finish Exam" : "Finish Exam";
    }
    return hasSelectedAnswer ? "Submit & Next" : "Skip";
  };

  const isNextDisabled = () => {
    if (isSubmitting || isChecking) return true;

    if (examMode === "tutor") {
      // In tutor mode, disable if no answer selected or still checking
      if (!hasSelectedAnswer) return true;
      if (hasSelectedAnswer && !isAnswerChecked) return true;
    }

    return false;
  };

  const getNextButtonIcon = () => {
    if (isSubmitting || isChecking) {
      return <Loader2 className="h-4 w-4 animate-spin" />;
    }

    if (isLastQuestion) {
      return <Send className="h-4 w-4" />;
    }

    return <ChevronRight className="h-4 w-4" />;
  };

  const getNextButtonStyle = () => {
    if (examMode === "tutor" && isAnswerChecked && hasSelectedAnswer) {
      return "bg-green-600 hover:bg-green-700";
    }
    if (isLastQuestion) {
      return "bg-green-600 hover:bg-green-700";
    }
    return "";
  };

  // NEW: Get Grade Exam button text based on context
  const getGradeButtonText = () => {
    if (isSubmitting) {
      return "Submitting...";
    }
    return "Submit Exam";
  };

  return (
    <div className={cn("flex flex-col gap-4 p-4 bg-white border-t", className)}>
      {/* Main Navigation */}
      <div className="flex items-center justify-between gap-4">
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={!canGoPrevious || isSubmitting || isChecking}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className="font-medium">
            {answeredCount} of {totalQuestions} answered
          </span>
          {examMode === "tutor" && hasSelectedAnswer && isAnswerChecked && (
            <CheckCircle className="h-4 w-4 text-green-600" />
          )}
        </div>

        <Button
          onClick={onNext}
          disabled={isNextDisabled()}
          className={cn("flex items-center gap-2", getNextButtonStyle())}
        >
          {getNextButtonIcon()}
          <span>{getNextButtonText()}</span>
        </Button>
      </div>

      {/* NEW: Tutor Mode Submit Button (separate from Next) */}
      {examMode === "tutor" &&
        isAnswerChecked &&
        onSubmitQuestion &&
        !isLastQuestion && (
          <div className="flex justify-center pt-2 border-t border-gray-100">
            <Button
              onClick={onSubmitQuestion}
              disabled={isSubmitting}
              variant="outline"
              className="flex items-center gap-2 bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              Record Answer
            </Button>
          </div>
        )}

      {/* Exam Action Buttons */}
      <div className="flex items-center justify-center gap-3 pt-3 border-t border-gray-200">
        {/* Submit Exam - UPDATED */}
        <AlertDialog open={showGradeDialog} onOpenChange={setShowGradeDialog}>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center gap-2 border-green-200 text-green-700 hover:bg-green-50"
              disabled={isSubmitting || isChecking}
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <GraduationCap className="h-4 w-4" />
              )}
              {getGradeButtonText()}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Submit Exam</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to submit this exam now? This will end the
                exam and calculate your final score.
                <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                  <div className="text-sm">
                    <strong>Progress Summary:</strong>
                    <ul className="mt-1 space-y-1">
                      <li>• Total Questions: {totalQuestions}</li>
                      <li>• Answered: {answeredCount}</li>
                      <li>• Remaining: {totalQuestions - answeredCount}</li>
                    </ul>
                  </div>
                </div>
                {answeredCount < totalQuestions && (
                  <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <div className="text-amber-600 font-medium text-sm">
                        ⚠️ Warning
                      </div>
                    </div>
                    <p className="text-amber-700 text-sm mt-1">
                      {totalQuestions - answeredCount} questions remain
                      unanswered and will be marked as incorrect.
                    </p>
                  </div>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isSubmitting}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  setShowGradeDialog(false);
                  onGradeExam();
                }}
                className="bg-green-600 hover:bg-green-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Submitting...
                  </>
                ) : (
                  "Yes, Submit Exam"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Pause/Resume Exam */}
        <Button
          variant="outline"
          onClick={onPauseExam}
          disabled={isSubmitting || isChecking}
          className="flex items-center gap-2"
        >
          {isPaused ? (
            <>
              <Play className="h-4 w-4" />
              Resume
            </>
          ) : (
            <>
              <Pause className="h-4 w-4" />
              Pause
            </>
          )}
        </Button>

        {/* Clear Answers */}
        <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              disabled={isSubmitting || isChecking}
              className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50"
            >
              <RotateCcw className="h-4 w-4" />
              Clear Answers
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Clear All Answers</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to clear all your answers and start over?
                This action cannot be undone. You will lose all progress on{" "}
                {answeredCount} answered questions.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  setShowClearDialog(false);
                  onClearAnswers();
                }}
                className="bg-red-600 hover:bg-red-700"
              >
                Yes, Clear All
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Help Text - UPDATED */}
      <div className="text-center text-xs text-gray-500 pt-2 border-t border-gray-100">
        <p>
          Use keyboard shortcuts: ← → to navigate • F to flag • Ctrl+Enter to
          submit
        </p>
        {examMode === "test" && (
          <p className="mt-1">
            Test Mode: Questions become locked after submission
          </p>
        )}
        {examMode === "tutor" && (
          <p className="mt-1 text-blue-600">
            Tutor Mode: Answers are checked immediately, then you can proceed to
            next question
          </p>
        )}
        <p className="mt-1 text-green-600 font-medium">
          Complete exam by answering all questions or click "Submit Exam" to
          finish early
        </p>
      </div>
    </div>
  );
};
