import React, { useEffect, useRef } from "react";
import { Clock, Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TimerProps {
  remainingTime: number;
  isActive: boolean;
  onTimeUp: () => void;
  onPause?: () => void;
  onResume?: () => void;
  className?: string;
  showControls?: boolean;
}

export const Timer: React.FC<TimerProps> = ({
  remainingTime,
  isActive,
  onTimeUp,
  onPause,
  onResume,
  className,
  showControls = false,
}) => {
  // FIXED: Add ref to prevent multiple onTimeUp calls
  const hasCalledTimeUp = useRef(false);
  const previousRemainingTime = useRef(remainingTime);

  // FIXED: Reset the flag when timer is reset/restarted
  useEffect(() => {
    if (remainingTime > previousRemainingTime.current) {
      hasCalledTimeUp.current = false;
    }
    previousRemainingTime.current = remainingTime;
  }, [remainingTime]);

  // FIXED: Improved onTimeUp call with safety checks
  useEffect(() => {
    if (remainingTime === 0 && !hasCalledTimeUp.current && isActive) {
      hasCalledTimeUp.current = true;
      // Add a small delay to ensure state is consistent
      const timeoutId = setTimeout(() => {
        onTimeUp();
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [remainingTime, onTimeUp, isActive]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const getTimeColor = () => {
    if (remainingTime <= 10) return "text-red-600";
    if (remainingTime <= 30) return "text-orange-600";
    return "text-gray-700";
  };

  const getProgressColor = () => {
    if (remainingTime <= 10) return "bg-red-500";
    if (remainingTime <= 30) return "bg-orange-500";
    return "bg-blue-500";
  };

  // Don't show timer if no time limit
  if (remainingTime === 0 && !isActive) return null;

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="flex items-center gap-2">
        <Clock className={cn("h-5 w-5", getTimeColor())} />
        <div className="flex flex-col">
          <span className={cn("text-lg font-mono font-bold", getTimeColor())}>
            {formatTime(remainingTime)}
          </span>
          {remainingTime <= 30 && (
            <div className="w-16 h-1 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full transition-all duration-1000",
                  getProgressColor()
                )}
                style={{
                  width: `${Math.max(0, (remainingTime / 30) * 100)}%`,
                }}
              />
            </div>
          )}
        </div>
      </div>

      {showControls && (onPause || onResume) && (
        <Button
          variant="outline"
          size="sm"
          onClick={isActive ? onPause : onResume}
          className="flex items-center gap-1"
        >
          {isActive ? (
            <>
              <Pause className="h-3 w-3" />
              Pause
            </>
          ) : (
            <>
              <Play className="h-3 w-3" />
              Resume
            </>
          )}
        </Button>
      )}

      {/* Time warning alerts */}
      {remainingTime <= 10 && remainingTime > 0 && (
        <div className="animate-pulse">
          <span className="text-xs font-semibold text-red-600 bg-red-100 px-2 py-1 rounded">
            Time running out!
          </span>
        </div>
      )}
    </div>
  );
};

export default Timer;

// // components/exam/Timer.tsx

// import React, { useEffect } from "react";
// import { Clock, Pause, Play } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { cn } from "@/lib/utils";

// interface TimerProps {
//   remainingTime: number;
//   isActive: boolean;
//   onTimeUp: () => void;
//   onPause?: () => void;
//   onResume?: () => void;
//   className?: string;
//   showControls?: boolean;
// }

// export const Timer: React.FC<TimerProps> = ({
//   remainingTime,
//   isActive,
//   onTimeUp,
//   onPause,
//   onResume,
//   className,
//   showControls = false,
// }) => {
//   // Auto call onTimeUp when time reaches 0
//   useEffect(() => {
//     if (remainingTime === 0) {
//       onTimeUp();
//     }
//   }, [remainingTime, onTimeUp]);

//   const formatTime = (seconds: number) => {
//     const minutes = Math.floor(seconds / 60);
//     const remainingSeconds = seconds % 60;
//     return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
//   };

//   const getTimeColor = () => {
//     if (remainingTime <= 10) return "text-red-600";
//     if (remainingTime <= 30) return "text-orange-600";
//     return "text-gray-700";
//   };

//   const getProgressColor = () => {
//     if (remainingTime <= 10) return "bg-red-500";
//     if (remainingTime <= 30) return "bg-orange-500";
//     return "bg-blue-500";
//   };

//   // Don't show timer if no time limit
//   if (remainingTime === 0 && !isActive) return null;

//   return (
//     <div className={cn("flex items-center gap-3", className)}>
//       <div className="flex items-center gap-2">
//         <Clock className={cn("h-5 w-5", getTimeColor())} />
//         <div className="flex flex-col">
//           <span className={cn("text-lg font-mono font-bold", getTimeColor())}>
//             {formatTime(remainingTime)}
//           </span>
//           {remainingTime <= 30 && (
//             <div className="w-16 h-1 bg-gray-200 rounded-full overflow-hidden">
//               <div
//                 className={cn(
//                   "h-full transition-all duration-1000",
//                   getProgressColor()
//                 )}
//                 style={{
//                   width: `${Math.max(0, (remainingTime / 30) * 100)}%`,
//                 }}
//               />
//             </div>
//           )}
//         </div>
//       </div>

//       {showControls && (onPause || onResume) && (
//         <Button
//           variant="outline"
//           size="sm"
//           onClick={isActive ? onPause : onResume}
//           className="flex items-center gap-1"
//         >
//           {isActive ? (
//             <>
//               <Pause className="h-3 w-3" />
//               Pause
//             </>
//           ) : (
//             <>
//               <Play className="h-3 w-3" />
//               Resume
//             </>
//           )}
//         </Button>
//       )}

//       {/* Time warning alerts */}
//       {remainingTime <= 10 && remainingTime > 0 && (
//         <div className="animate-pulse">
//           <span className="text-xs font-semibold text-red-600 bg-red-100 px-2 py-1 rounded">
//             Time running out!
//           </span>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Timer;
