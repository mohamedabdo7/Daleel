// components/exam/QuestionDisplay.tsx - FIXED VERSION WITH COLLAPSIBLE EXPLANATION

import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  Flag,
  FlagOff,
  CheckCircle,
  XCircle,
  Loader2,
  ChevronDown,
  ChevronUp,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { QuestionDetails } from "./exam.types";

interface QuestionDisplayProps {
  question: QuestionDetails;
  selectedAnswerId?: string;
  isSubmitted?: boolean;
  showResult?: boolean; // For tutor mode
  examMode: "test" | "tutor";
  questionNumber: number;
  totalQuestions: number;
  onAnswerSelect: (answerId: string) => void;
  onFlag: () => void;
  disabled?: boolean;
  className?: string;
  // NEW: For tutor mode check result
  checkResult?: {
    isCorrect: boolean;
    correctAnswer: string;
  } | null;
  isChecking?: boolean;
}

export const QuestionDisplay: React.FC<QuestionDisplayProps> = ({
  question,
  selectedAnswerId,
  isSubmitted = false,
  showResult = false,
  examMode,
  questionNumber,
  totalQuestions,
  onAnswerSelect,
  onFlag,
  disabled = false,
  className,
  checkResult = null,
  isChecking = false,
}) => {
  const [isExplanationExpanded, setIsExplanationExpanded] = useState(false);

  const isCorrectAnswer = (answerId: string) => {
    // FIXED: Handle the case where API returns correct_answer: null
    if (examMode === "tutor" && checkResult) {
      // If we have explicit correct answer ID, use it
      if (checkResult.correctAnswer && checkResult.correctAnswer !== null) {
        return checkResult.correctAnswer === answerId;
      } else {
        // If correct_answer is null, we need to determine correctness differently:
        // - If checkResult.isCorrect is true and this is the selected answer, it's correct
        // - If checkResult.isCorrect is false and this is the selected answer, it's wrong
        // - For other answers, we can't determine correctness, so use fallback
        if (selectedAnswerId === answerId) {
          return checkResult.isCorrect;
        } else {
          // For non-selected answers, we can't know which is correct
          // Fall back to question data if available
          return question.correct_answer === answerId;
        }
      }
    }

    // Fallback to question.correct_answer for test mode or when no checkResult
    return question.correct_answer === answerId;
  };

  const isUserAnswer = (answerId: string) => {
    return selectedAnswerId === answerId;
  };

  // Determine if answer selection should be disabled
  const isAnswerSelectionDisabled = () => {
    if (disabled || isChecking) return true;

    // In test mode, disable after submission (locked)
    if (examMode === "test" && isSubmitted) return true;

    // In tutor mode, disable after showing result
    if (examMode === "tutor" && showResult) return true;

    return false;
  };

  const getAnswerStyle = (answerId: string) => {
    const isSelected = isUserAnswer(answerId);
    const isDisabled = isAnswerSelectionDisabled();

    // Show loading state during checking
    if (isChecking && isSelected) {
      return "bg-blue-100 border-blue-300 text-blue-900 animate-pulse";
    }

    // Check if we should show results
    const shouldShowResults =
      (examMode === "tutor" && checkResult) ||
      (examMode === "test" && isSubmitted && showResult);

    if (!shouldShowResults) {
      // Before showing results
      if (isSelected) {
        return "bg-blue-50 border-blue-300 text-blue-900";
      }
      return isDisabled
        ? "bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed"
        : "bg-white border-gray-200 hover:bg-gray-50";
    }

    // Show results - FIXED LOGIC
    const isCorrect = isCorrectAnswer(answerId);
    const isUserSelected = isSelected;

    console.log("Answer styling debug:", {
      answerId,
      isCorrect,
      isUserSelected,
      checkResult,
      correctAnswer: checkResult?.correctAnswer || question.correct_answer,
    });

    if (isCorrect) {
      // This answer is correct
      if (isUserSelected) {
        // User selected the correct answer - GREEN
        return "bg-green-100 border-green-400 text-green-900";
      } else {
        // Correct answer but not selected - LIGHT GREEN
        return "bg-green-50 border-green-300 text-green-800";
      }
    } else {
      // This answer is incorrect
      if (isUserSelected) {
        // User selected wrong answer - RED
        return "bg-red-100 border-red-400 text-red-900";
      } else {
        // Wrong answer and not selected - GRAY
        return "bg-gray-50 border-gray-200 text-gray-700";
      }
    }
  };

  const getAnswerIcon = (answerId: string) => {
    // Show loading icon during checking
    if (isChecking && isUserAnswer(answerId)) {
      return <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />;
    }

    // Check if we should show results
    const shouldShowResults =
      (examMode === "tutor" && checkResult) ||
      (examMode === "test" && isSubmitted && showResult);

    if (!shouldShowResults) return null;

    const isCorrect = isCorrectAnswer(answerId);
    const isUserSelected = isUserAnswer(answerId);

    console.log("Answer icon debug:", {
      answerId,
      isCorrect,
      isUserSelected,
      checkResult,
    });

    if (isCorrect) {
      // This answer is correct - show green checkmark
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    } else if (isUserSelected && !isCorrect) {
      // User selected wrong answer - show red X
      return <XCircle className="h-4 w-4 text-red-600" />;
    }

    return null;
  };

  // Check if we should show explanation
  const shouldShowExplanation = () => {
    return (
      question.explain &&
      ((examMode === "tutor" && checkResult && !isChecking) ||
        (examMode === "test" && showResult && isSubmitted))
    );
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-sm">
              Question {questionNumber} of {totalQuestions}
            </Badge>

            <Badge variant="secondary" className="text-xs">
              {question.section.title}
            </Badge>

            <Badge variant="outline" className="text-xs">
              {question.chapter.title}
            </Badge>

            {/* Show checking status */}
            {isChecking && (
              <Badge
                variant="outline"
                className="text-xs bg-blue-50 text-blue-700"
              >
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                Checking...
              </Badge>
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={onFlag}
            disabled={disabled || isChecking}
            className={cn(
              "flex items-center gap-1",
              question.is_flagged
                ? "bg-yellow-100 border-yellow-300 text-yellow-700 hover:bg-yellow-200"
                : "hover:bg-gray-100"
            )}
          >
            {question.is_flagged ? (
              <>
                <FlagOff className="h-3 w-3" />
                Unflag
              </>
            ) : (
              <>
                <Flag className="h-3 w-3" />
                Flag
              </>
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Question Text */}
        <div className="prose prose-sm max-w-none">
          <div
            dangerouslySetInnerHTML={{ __html: question.desc }}
            className="text-gray-900 leading-relaxed"
          />
        </div>

        {/* Answer Options */}
        <div className="space-y-3">
          <RadioGroup
            value={selectedAnswerId || ""}
            onValueChange={onAnswerSelect}
            disabled={isAnswerSelectionDisabled()}
            className="space-y-2"
          >
            {question.answers.map((answer, index) => (
              <div
                key={answer.id}
                className={cn(
                  "relative rounded-lg border-2 transition-all duration-200",
                  getAnswerStyle(answer.id)
                )}
              >
                <Label
                  htmlFor={answer.id}
                  className={cn(
                    "flex items-center space-x-3 p-4 w-full",
                    isAnswerSelectionDisabled()
                      ? "cursor-not-allowed"
                      : "cursor-pointer"
                  )}
                >
                  <RadioGroupItem
                    value={answer.id}
                    id={answer.id}
                    className="flex-shrink-0"
                    disabled={isAnswerSelectionDisabled()}
                  />

                  <div className="flex-grow flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-sm text-gray-600">
                        {String.fromCharCode(65 + index)}.
                      </span>
                      <span className="text-sm">{answer.answer}</span>
                    </div>

                    {getAnswerIcon(answer.id)}
                  </div>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Instant feedback in tutor mode after checking */}
        {examMode === "tutor" && checkResult && !isChecking && (
          <div className="mt-4 p-4 rounded-lg border-2 border-dashed">
            {checkResult.isCorrect ? (
              <div className="flex items-center gap-3 text-green-700">
                <CheckCircle className="h-6 w-6" />
                <div>
                  <h4 className="font-semibold">Correct!</h4>
                  <p className="text-sm">Well done! Your answer is correct.</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 text-red-700">
                <XCircle className="h-6 w-6" />
                <div>
                  <h4 className="font-semibold">Incorrect</h4>
                  <p className="text-sm">
                    The correct answer is:{" "}
                    <span className="font-medium">
                      {
                        question.answers.find(
                          (a) => a.id === checkResult.correctAnswer
                        )?.answer
                      }
                    </span>
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Collapsible Explanation Section */}
        {shouldShowExplanation() && (
          <div className="mt-4">
            {/* Toggle Button */}
            <Button
              variant="outline"
              onClick={() => setIsExplanationExpanded(!isExplanationExpanded)}
              className="w-full flex items-center justify-between p-3 h-auto bg-blue-50 border-blue-200 hover:bg-blue-100 text-blue-800"
            >
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                <span className="font-medium">Explanation</span>
              </div>
              {isExplanationExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>

            {/* Collapsible Content */}
            {isExplanationExpanded && (
              <div className="mt-2 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div
                  dangerouslySetInnerHTML={{ __html: question.explain }}
                  className="prose prose-sm max-w-none text-blue-800"
                />
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// // components/exam/QuestionDisplay.tsx - FIXED VERSION

// import React from "react";
// import { Card, CardContent, CardHeader } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { Label } from "@/components/ui/label";
// import { Flag, FlagOff, CheckCircle, XCircle, Loader2 } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { QuestionDetails } from "./exam.types";

// interface QuestionDisplayProps {
//   question: QuestionDetails;
//   selectedAnswerId?: string;
//   isSubmitted?: boolean;
//   showResult?: boolean; // For tutor mode
//   examMode: "test" | "tutor";
//   questionNumber: number;
//   totalQuestions: number;
//   onAnswerSelect: (answerId: string) => void;
//   onFlag: () => void;
//   disabled?: boolean;
//   className?: string;
//   // NEW: For tutor mode check result
//   checkResult?: {
//     isCorrect: boolean;
//     correctAnswer: string;
//   } | null;
//   isChecking?: boolean;
// }

// export const QuestionDisplay: React.FC<QuestionDisplayProps> = ({
//   question,
//   selectedAnswerId,
//   isSubmitted = false,
//   showResult = false,
//   examMode,
//   questionNumber,
//   totalQuestions,
//   onAnswerSelect,
//   onFlag,
//   disabled = false,
//   className,
//   checkResult = null,
//   isChecking = false,
// }) => {
//   const isCorrectAnswer = (answerId: string) => {
//     // FIXED: Handle the case where API returns correct_answer: null
//     if (examMode === "tutor" && checkResult) {
//       // If we have explicit correct answer ID, use it
//       if (checkResult.correctAnswer && checkResult.correctAnswer !== null) {
//         return checkResult.correctAnswer === answerId;
//       } else {
//         // If correct_answer is null, we need to determine correctness differently:
//         // - If checkResult.isCorrect is true and this is the selected answer, it's correct
//         // - If checkResult.isCorrect is false and this is the selected answer, it's wrong
//         // - For other answers, we can't determine correctness, so use fallback
//         if (selectedAnswerId === answerId) {
//           return checkResult.isCorrect;
//         } else {
//           // For non-selected answers, we can't know which is correct
//           // Fall back to question data if available
//           return question.correct_answer === answerId;
//         }
//       }
//     }

//     // Fallback to question.correct_answer for test mode or when no checkResult
//     return question.correct_answer === answerId;
//   };

//   const isUserAnswer = (answerId: string) => {
//     return selectedAnswerId === answerId;
//   };

//   // Determine if answer selection should be disabled
//   const isAnswerSelectionDisabled = () => {
//     if (disabled || isChecking) return true;

//     // In test mode, disable after submission (locked)
//     if (examMode === "test" && isSubmitted) return true;

//     // In tutor mode, disable after showing result
//     if (examMode === "tutor" && showResult) return true;

//     return false;
//   };

//   const getAnswerStyle = (answerId: string) => {
//     const isSelected = isUserAnswer(answerId);
//     const isDisabled = isAnswerSelectionDisabled();

//     // Show loading state during checking
//     if (isChecking && isSelected) {
//       return "bg-blue-100 border-blue-300 text-blue-900 animate-pulse";
//     }

//     // Check if we should show results
//     const shouldShowResults =
//       (examMode === "tutor" && checkResult) ||
//       (examMode === "test" && isSubmitted && showResult);

//     if (!shouldShowResults) {
//       // Before showing results
//       if (isSelected) {
//         return "bg-blue-50 border-blue-300 text-blue-900";
//       }
//       return isDisabled
//         ? "bg-gray-100 border-gray-200 text-gray-500 cursor-not-allowed"
//         : "bg-white border-gray-200 hover:bg-gray-50";
//     }

//     // Show results - FIXED LOGIC
//     const isCorrect = isCorrectAnswer(answerId);
//     const isUserSelected = isSelected;

//     console.log("Answer styling debug:", {
//       answerId,
//       isCorrect,
//       isUserSelected,
//       checkResult,
//       correctAnswer: checkResult?.correctAnswer || question.correct_answer,
//     });

//     if (isCorrect) {
//       // This answer is correct
//       if (isUserSelected) {
//         // User selected the correct answer - GREEN
//         return "bg-green-100 border-green-400 text-green-900";
//       } else {
//         // Correct answer but not selected - LIGHT GREEN
//         return "bg-green-50 border-green-300 text-green-800";
//       }
//     } else {
//       // This answer is incorrect
//       if (isUserSelected) {
//         // User selected wrong answer - RED
//         return "bg-red-100 border-red-400 text-red-900";
//       } else {
//         // Wrong answer and not selected - GRAY
//         return "bg-gray-50 border-gray-200 text-gray-700";
//       }
//     }
//   };

//   const getAnswerIcon = (answerId: string) => {
//     // Show loading icon during checking
//     if (isChecking && isUserAnswer(answerId)) {
//       return <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />;
//     }

//     // Check if we should show results
//     const shouldShowResults =
//       (examMode === "tutor" && checkResult) ||
//       (examMode === "test" && isSubmitted && showResult);

//     if (!shouldShowResults) return null;

//     const isCorrect = isCorrectAnswer(answerId);
//     const isUserSelected = isUserAnswer(answerId);

//     console.log("Answer icon debug:", {
//       answerId,
//       isCorrect,
//       isUserSelected,
//       checkResult,
//     });

//     if (isCorrect) {
//       // This answer is correct - show green checkmark
//       return <CheckCircle className="h-4 w-4 text-green-600" />;
//     } else if (isUserSelected && !isCorrect) {
//       // User selected wrong answer - show red X
//       return <XCircle className="h-4 w-4 text-red-600" />;
//     }

//     return null;
//   };

//   return (
//     <Card className={cn("w-full", className)}>
//       <CardHeader className="pb-4">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-2">
//             <Badge variant="outline" className="text-sm">
//               Question {questionNumber} of {totalQuestions}
//             </Badge>

//             <Badge variant="secondary" className="text-xs">
//               {question.section.title}
//             </Badge>

//             <Badge variant="outline" className="text-xs">
//               {question.chapter.title}
//             </Badge>

//             {/* Show checking status */}
//             {isChecking && (
//               <Badge
//                 variant="outline"
//                 className="text-xs bg-blue-50 text-blue-700"
//               >
//                 <Loader2 className="h-3 w-3 mr-1 animate-spin" />
//                 Checking...
//               </Badge>
//             )}
//           </div>

//           <Button
//             variant="outline"
//             size="sm"
//             onClick={onFlag}
//             disabled={disabled || isChecking}
//             className={cn(
//               "flex items-center gap-1",
//               question.is_flagged
//                 ? "bg-yellow-100 border-yellow-300 text-yellow-700 hover:bg-yellow-200"
//                 : "hover:bg-gray-100"
//             )}
//           >
//             {question.is_flagged ? (
//               <>
//                 <FlagOff className="h-3 w-3" />
//                 Unflag
//               </>
//             ) : (
//               <>
//                 <Flag className="h-3 w-3" />
//                 Flag
//               </>
//             )}
//           </Button>
//         </div>
//       </CardHeader>

//       <CardContent className="space-y-6">
//         {/* Question Text */}
//         <div className="prose prose-sm max-w-none">
//           <div
//             dangerouslySetInnerHTML={{ __html: question.desc }}
//             className="text-gray-900 leading-relaxed"
//           />
//         </div>

//         {/* Answer Options */}
//         <div className="space-y-3">
//           <RadioGroup
//             value={selectedAnswerId || ""}
//             onValueChange={onAnswerSelect}
//             disabled={isAnswerSelectionDisabled()}
//             className="space-y-2"
//           >
//             {question.answers.map((answer, index) => (
//               <div
//                 key={answer.id}
//                 className={cn(
//                   "relative rounded-lg border-2 transition-all duration-200",
//                   getAnswerStyle(answer.id)
//                 )}
//               >
//                 <Label
//                   htmlFor={answer.id}
//                   className={cn(
//                     "flex items-center space-x-3 p-4 w-full",
//                     isAnswerSelectionDisabled()
//                       ? "cursor-not-allowed"
//                       : "cursor-pointer"
//                   )}
//                 >
//                   <RadioGroupItem
//                     value={answer.id}
//                     id={answer.id}
//                     className="flex-shrink-0"
//                     disabled={isAnswerSelectionDisabled()}
//                   />

//                   <div className="flex-grow flex items-center justify-between">
//                     <div className="flex items-center gap-3">
//                       <span className="font-medium text-sm text-gray-600">
//                         {String.fromCharCode(65 + index)}.
//                       </span>
//                       <span className="text-sm">{answer.answer}</span>
//                     </div>

//                     {getAnswerIcon(answer.id)}
//                   </div>
//                 </Label>
//               </div>
//             ))}
//           </RadioGroup>
//         </div>

//         {/* Instant feedback in tutor mode after checking */}
//         {examMode === "tutor" && checkResult && !isChecking && (
//           <div className="mt-4 p-4 rounded-lg border-2 border-dashed">
//             {checkResult.isCorrect ? (
//               <div className="flex items-center gap-3 text-green-700">
//                 <CheckCircle className="h-6 w-6" />
//                 <div>
//                   <h4 className="font-semibold">Correct!</h4>
//                   <p className="text-sm">Well done! Your answer is correct.</p>
//                 </div>
//               </div>
//             ) : (
//               <div className="flex items-center gap-3 text-red-700">
//                 <XCircle className="h-6 w-6" />
//                 <div>
//                   <h4 className="font-semibold">Incorrect</h4>
//                   <p className="text-sm">
//                     The correct answer is:{" "}
//                     <span className="font-medium">
//                       {
//                         question.answers.find(
//                           (a) => a.id === checkResult.correctAnswer
//                         )?.answer
//                       }
//                     </span>
//                   </p>
//                 </div>
//               </div>
//             )}
//           </div>
//         )}

//         {/* Explanation (shown in tutor mode after checking) */}
//         {examMode === "tutor" && checkResult && question.explain && (
//           <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
//             <h4 className="font-semibold text-blue-900 mb-2">Explanation:</h4>
//             <div
//               dangerouslySetInnerHTML={{ __html: question.explain }}
//               className="prose prose-sm max-w-none text-blue-800"
//             />
//           </div>
//         )}

//         {/* Legacy explanation for test mode or when using old flow */}
//         {examMode === "test" &&
//           showResult &&
//           isSubmitted &&
//           question.explain && (
//             <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
//               <h4 className="font-semibold text-blue-900 mb-2">Explanation:</h4>
//               <div
//                 dangerouslySetInnerHTML={{ __html: question.explain }}
//                 className="prose prose-sm max-w-none text-blue-800"
//               />
//             </div>
//           )}
//       </CardContent>
//     </Card>
//   );
// };
