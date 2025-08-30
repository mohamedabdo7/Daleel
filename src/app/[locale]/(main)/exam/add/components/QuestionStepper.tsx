// components/exam/QuestionStepper.tsx

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Flag,
  CheckCircle,
  XCircle,
  Clock,
  Lock,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { QuestionStatus, STATUS_STYLES } from "./exam.types";

interface QuestionStepperProps {
  questionsCount: number;
  currentIndex: number;
  questionsStatus: Record<string, QuestionStatus>;
  questionsIds: string[];
  onQuestionSelect: (index: number) => void;
  allowNavigation?: boolean;
  examMode?: "test" | "tutor";
  className?: string;
}

export const QuestionStepper: React.FC<QuestionStepperProps> = ({
  questionsCount,
  currentIndex,
  questionsStatus,
  questionsIds,
  onQuestionSelect,
  allowNavigation = true,
  examMode = "test",
  className,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusIcon = (status: QuestionStatus) => {
    const iconClass = "h-3 w-3";

    switch (status) {
      case "correct":
        return <CheckCircle className={cn(iconClass, "text-green-600")} />;
      case "incorrect":
        return <XCircle className={cn(iconClass, "text-red-600")} />;
      case "flagged":
        return <Flag className={cn(iconClass, "text-yellow-600")} />;
      case "skipped":
        return <Clock className={cn(iconClass, "text-orange-600")} />;
      case "locked":
        return <Lock className={cn(iconClass, "text-gray-500")} />;
      default:
        return null;
    }
  };

  const getStepVariant = (index: number, status: QuestionStatus) => {
    if (index === currentIndex) {
      return "default"; // Current step
    }

    switch (status) {
      case "correct":
        return "secondary";
      case "incorrect":
        return "destructive";
      case "answered":
      case "locked":
        return "outline";
      case "flagged":
        return "secondary";
      default:
        return "ghost";
    }
  };

  const canNavigateToStep = (index: number, status: QuestionStatus) => {
    if (!allowNavigation) return false;

    // In test mode, prevent navigation to locked questions
    if (examMode === "test" && status === "locked") {
      return false;
    }

    return true;
  };

  return (
    <div
      className={cn(
        "flex flex-wrap gap-2 p-4 bg-gray-50 rounded-lg",
        className
      )}
    >
      {/* Header */}
      <div className="w-full mb-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-700">
            Questions Progress
          </h3>
          <ProgressSummary
            questionsStatus={questionsStatus}
            questionsIds={questionsIds}
            examMode={examMode}
          />
        </div>
      </div>

      {/* Question steps - always visible */}
      <div className="flex flex-wrap gap-2 w-full">
        {Array.from({ length: questionsCount }, (_, index) => {
          const questionId = questionsIds[index];
          const status = questionsStatus[questionId] || "unanswered";
          const isCurrentStep = index === currentIndex;
          const canNavigate = canNavigateToStep(index, status);

          return (
            <Button
              key={index}
              variant={getStepVariant(index, status)}
              size="sm"
              className={cn(
                "relative min-w-[2.5rem] h-10 p-0 transition-all duration-200",
                STATUS_STYLES[status],
                isCurrentStep && "ring-2 ring-blue-500 ring-offset-2",
                !canNavigate && "opacity-60 cursor-not-allowed",
                canNavigate && "hover:scale-105"
              )}
              onClick={() => canNavigate && onQuestionSelect(index)}
              disabled={!canNavigate}
            >
              <div className="flex flex-col items-center justify-center gap-0.5">
                <span className="text-xs font-semibold">{index + 1}</span>
                {getStatusIcon(status)}
              </div>

              {/* Current step indicator */}
              {isCurrentStep && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white" />
              )}
            </Button>
          );
        })}
      </div>

      {/* Toggle button */}
      <div className="w-full flex justify-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="h-8 px-3 hover:bg-gray-200 text-xs text-gray-600"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="h-3 w-3 mr-1" />
              Hide Details
            </>
          ) : (
            <>
              <ChevronDown className="h-3 w-3 mr-1" />
              Show Details
            </>
          )}
        </Button>
      </div>

      {/* Collapsible content */}
      {isExpanded && (
        <div className="w-full mt-4">
          {/* Legend */}
          <div className="pt-3 border-t border-gray-200">
            <div className="flex flex-wrap gap-4 text-xs text-gray-600">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-gray-100 border border-gray-300 rounded" />
                <span>Unanswered</span>
              </div>

              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-blue-100 border border-blue-300 rounded" />
                <span>Answered</span>
              </div>

              {examMode === "tutor" && (
                <>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    <span>Correct</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <XCircle className="h-3 w-3 text-red-600" />
                    <span>Incorrect</span>
                  </div>
                </>
              )}

              <div className="flex items-center gap-1">
                <Flag className="h-3 w-3 text-yellow-600" />
                <span>Flagged</span>
              </div>

              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3 text-orange-600" />
                <span>Skipped</span>
              </div>

              {examMode === "test" && (
                <div className="flex items-center gap-1">
                  <Lock className="h-3 w-3 text-gray-500" />
                  <span>Locked</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Progress Summary Component
interface ProgressSummaryProps {
  questionsStatus: Record<string, QuestionStatus>;
  questionsIds: string[];
  examMode: "test" | "tutor";
}

const ProgressSummary: React.FC<ProgressSummaryProps> = ({
  questionsStatus,
  questionsIds,
  examMode,
}) => {
  const getStatusCounts = () => {
    const counts = {
      answered: 0,
      correct: 0,
      incorrect: 0,
      flagged: 0,
      skipped: 0,
      unanswered: 0,
      locked: 0,
    };

    questionsIds.forEach((id) => {
      const status = questionsStatus[id] || "unanswered";
      counts[status]++;
    });

    return counts;
  };

  const counts = getStatusCounts();
  const total = questionsIds.length;
  const completedCount =
    examMode === "tutor"
      ? counts.correct + counts.incorrect + counts.skipped
      : counts.answered + counts.locked + counts.skipped;

  return (
    <div className="flex items-center gap-2 text-xs">
      <Badge variant="outline" className="text-xs">
        {completedCount}/{total}
      </Badge>

      {examMode === "tutor" && counts.correct > 0 && (
        <Badge
          variant="secondary"
          className="text-xs bg-green-100 text-green-700"
        >
          ✓ {counts.correct}
        </Badge>
      )}

      {examMode === "tutor" && counts.incorrect > 0 && (
        <Badge variant="secondary" className="text-xs bg-red-100 text-red-700">
          ✗ {counts.incorrect}
        </Badge>
      )}

      {counts.flagged > 0 && (
        <Badge
          variant="secondary"
          className="text-xs bg-yellow-100 text-yellow-700"
        >
          🏳 {counts.flagged}
        </Badge>
      )}
    </div>
  );
};

// // components/exam/QuestionStepper.tsx

// import React from "react";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Flag, CheckCircle, XCircle, Clock, Lock } from "lucide-react";
// import { cn } from "@/lib/utils";
// import { QuestionStatus, STATUS_STYLES } from "./exam.types";

// interface QuestionStepperProps {
//   questionsCount: number;
//   currentIndex: number;
//   questionsStatus: Record<string, QuestionStatus>;
//   questionsIds: string[];
//   onQuestionSelect: (index: number) => void;
//   allowNavigation?: boolean;
//   examMode?: "test" | "tutor";
//   className?: string;
// }

// export const QuestionStepper: React.FC<QuestionStepperProps> = ({
//   questionsCount,
//   currentIndex,
//   questionsStatus,
//   questionsIds,
//   onQuestionSelect,
//   allowNavigation = true,
//   examMode = "test",
//   className,
// }) => {
//   const getStatusIcon = (status: QuestionStatus) => {
//     const iconClass = "h-3 w-3";

//     switch (status) {
//       case "correct":
//         return <CheckCircle className={cn(iconClass, "text-green-600")} />;
//       case "incorrect":
//         return <XCircle className={cn(iconClass, "text-red-600")} />;
//       case "flagged":
//         return <Flag className={cn(iconClass, "text-yellow-600")} />;
//       case "skipped":
//         return <Clock className={cn(iconClass, "text-orange-600")} />;
//       case "locked":
//         return <Lock className={cn(iconClass, "text-gray-500")} />;
//       default:
//         return null;
//     }
//   };

//   const getStepVariant = (index: number, status: QuestionStatus) => {
//     if (index === currentIndex) {
//       return "default"; // Current step
//     }

//     switch (status) {
//       case "correct":
//         return "secondary";
//       case "incorrect":
//         return "destructive";
//       case "answered":
//       case "locked":
//         return "outline";
//       case "flagged":
//         return "secondary";
//       default:
//         return "ghost";
//     }
//   };

//   const canNavigateToStep = (index: number, status: QuestionStatus) => {
//     if (!allowNavigation) return false;

//     // In test mode, prevent navigation to locked questions
//     if (examMode === "test" && status === "locked") {
//       return false;
//     }

//     return true;
//   };

//   return (
//     <div
//       className={cn(
//         "flex flex-wrap gap-2 p-4 bg-gray-50 rounded-lg",
//         className
//       )}
//     >
//       <div className="w-full mb-3">
//         <div className="flex items-center justify-between">
//           <h3 className="text-sm font-medium text-gray-700">
//             Questions Progress
//           </h3>
//           <ProgressSummary
//             questionsStatus={questionsStatus}
//             questionsIds={questionsIds}
//             examMode={examMode}
//           />
//         </div>
//       </div>

//       <div className="flex flex-wrap gap-2 w-full">
//         {Array.from({ length: questionsCount }, (_, index) => {
//           const questionId = questionsIds[index];
//           const status = questionsStatus[questionId] || "unanswered";
//           const isCurrentStep = index === currentIndex;
//           const canNavigate = canNavigateToStep(index, status);

//           return (
//             <Button
//               key={index}
//               variant={getStepVariant(index, status)}
//               size="sm"
//               className={cn(
//                 "relative min-w-[2.5rem] h-10 p-0 transition-all duration-200",
//                 STATUS_STYLES[status],
//                 isCurrentStep && "ring-2 ring-blue-500 ring-offset-2",
//                 !canNavigate && "opacity-60 cursor-not-allowed",
//                 canNavigate && "hover:scale-105"
//               )}
//               onClick={() => canNavigate && onQuestionSelect(index)}
//               disabled={!canNavigate}
//             >
//               <div className="flex flex-col items-center justify-center gap-0.5">
//                 <span className="text-xs font-semibold">{index + 1}</span>
//                 {getStatusIcon(status)}
//               </div>

//               {/* Current step indicator */}
//               {isCurrentStep && (
//                 <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-white" />
//               )}
//             </Button>
//           );
//         })}
//       </div>

//       {/* Legend */}
//       <div className="w-full mt-4 pt-3 border-t border-gray-200">
//         <div className="flex flex-wrap gap-4 text-xs text-gray-600">
//           <div className="flex items-center gap-1">
//             <div className="w-3 h-3 bg-gray-100 border border-gray-300 rounded" />
//             <span>Unanswered</span>
//           </div>

//           <div className="flex items-center gap-1">
//             <div className="w-3 h-3 bg-blue-100 border border-blue-300 rounded" />
//             <span>Answered</span>
//           </div>

//           {examMode === "tutor" && (
//             <>
//               <div className="flex items-center gap-1">
//                 <CheckCircle className="h-3 w-3 text-green-600" />
//                 <span>Correct</span>
//               </div>

//               <div className="flex items-center gap-1">
//                 <XCircle className="h-3 w-3 text-red-600" />
//                 <span>Incorrect</span>
//               </div>
//             </>
//           )}

//           <div className="flex items-center gap-1">
//             <Flag className="h-3 w-3 text-yellow-600" />
//             <span>Flagged</span>
//           </div>

//           <div className="flex items-center gap-1">
//             <Clock className="h-3 w-3 text-orange-600" />
//             <span>Skipped</span>
//           </div>

//           {examMode === "test" && (
//             <div className="flex items-center gap-1">
//               <Lock className="h-3 w-3 text-gray-500" />
//               <span>Locked</span>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// // Progress Summary Component
// interface ProgressSummaryProps {
//   questionsStatus: Record<string, QuestionStatus>;
//   questionsIds: string[];
//   examMode: "test" | "tutor";
// }

// const ProgressSummary: React.FC<ProgressSummaryProps> = ({
//   questionsStatus,
//   questionsIds,
//   examMode,
// }) => {
//   const getStatusCounts = () => {
//     const counts = {
//       answered: 0,
//       correct: 0,
//       incorrect: 0,
//       flagged: 0,
//       skipped: 0,
//       unanswered: 0,
//       locked: 0,
//     };

//     questionsIds.forEach((id) => {
//       const status = questionsStatus[id] || "unanswered";
//       counts[status]++;
//     });

//     return counts;
//   };

//   const counts = getStatusCounts();
//   const total = questionsIds.length;
//   const completedCount =
//     examMode === "tutor"
//       ? counts.correct + counts.incorrect + counts.skipped
//       : counts.answered + counts.locked + counts.skipped;

//   return (
//     <div className="flex items-center gap-2 text-xs">
//       <Badge variant="outline" className="text-xs">
//         {completedCount}/{total}
//       </Badge>

//       {examMode === "tutor" && counts.correct > 0 && (
//         <Badge
//           variant="secondary"
//           className="text-xs bg-green-100 text-green-700"
//         >
//           ✓ {counts.correct}
//         </Badge>
//       )}

//       {examMode === "tutor" && counts.incorrect > 0 && (
//         <Badge variant="secondary" className="text-xs bg-red-100 text-red-700">
//           ✗ {counts.incorrect}
//         </Badge>
//       )}

//       {counts.flagged > 0 && (
//         <Badge
//           variant="secondary"
//           className="text-xs bg-yellow-100 text-yellow-700"
//         >
//           🏳 {counts.flagged}
//         </Badge>
//       )}
//     </div>
//   );
// };
