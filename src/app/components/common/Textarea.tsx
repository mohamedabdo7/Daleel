import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  // Styling variants
  variant?: "default" | "outline" | "ghost" | "filled";
  size?: "sm" | "md" | "lg";

  // States
  error?: boolean;
  success?: boolean;

  // Label and helper text
  label?: string;
  helperText?: string;
  errorMessage?: string;

  // Character/word count
  showCharCount?: boolean;
  maxLength?: number;
  showWordCount?: boolean;

  // Auto-resize functionality
  autoResize?: boolean;
  minRows?: number;
  maxRows?: number;

  // Icons (typically for top-right corner)
  topRightIcon?: LucideIcon;
  onTopRightIconClick?: () => void;

  // Layout
  fullWidth?: boolean;

  // Container class for additional styling
  containerClassName?: string;
  labelClassName?: string;
  helperClassName?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      containerClassName,
      labelClassName,
      helperClassName,
      variant = "default",
      size = "md",
      error = false,
      success = false,
      label,
      helperText,
      errorMessage,
      showCharCount = false,
      maxLength,
      showWordCount = false,
      autoResize = false,
      minRows = 3,
      maxRows = 8,
      topRightIcon: TopRightIcon,
      onTopRightIconClick,
      fullWidth = false,
      value,
      onChange,
      ...props
    },
    ref
  ) => {
    const [textValue, setTextValue] = React.useState(value || "");

    const sizeClasses = {
      sm: "min-h-[60px] px-3 py-2 text-sm", // Reduced from 80px
      md: "min-h-[90px] px-4 py-3 text-base", // Reduced from 117px
      lg: "min-h-[110px] px-5 py-4 text-lg", // Reduced from 140px
    };

    const variantClasses = {
      default:
        "border border-gray-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-[#F1F7Fb]",
      outline: "border-2 border-gray-300 bg-transparent focus:border-blue-500",
      ghost:
        "border-0 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20",
      filled:
        "border-0 bg-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-500/20",
    };

    const textareaClasses = cn(
      // Base styles
      "flex w-full rounded-xl font-medium transition-all duration-200 ease-in-out resize-none",
      "placeholder:text-gray-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",

      // Size variants
      sizeClasses[size],

      // Style variants
      !error && !success && variantClasses[variant],

      // Error state
      error &&
        "border border-red-500 bg-white focus:border-red-500 focus:ring-2 focus:ring-red-500/20",

      // Success state
      success &&
        "border border-green-500 bg-white focus:border-green-500 focus:ring-2 focus:ring-green-500/20",

      // Icon padding adjustment
      TopRightIcon && "pr-10",

      // Width
      fullWidth ? "w-full" : "w-full max-w-sm", // Default to Figma width equivalent (386px ≈ max-w-sm)

      // Auto-resize
      autoResize && "resize-none overflow-hidden",

      className
    );

    const containerClasses = cn(
      "relative",
      fullWidth ? "w-full" : "w-full max-w-sm",
      containerClassName
    );

    // Handle auto-resize
    React.useEffect(() => {
      if (autoResize && ref && "current" in ref && ref.current) {
        const textarea = ref.current;
        textarea.style.height = "auto";
        const scrollHeight = textarea.scrollHeight;
        const lineHeight = parseInt(getComputedStyle(textarea).lineHeight);
        const minHeight = lineHeight * minRows;
        const maxHeight = lineHeight * maxRows;

        textarea.style.height = `${Math.min(
          Math.max(scrollHeight, minHeight),
          maxHeight
        )}px`;
      }
    }, [textValue, autoResize, minRows, maxRows, ref]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value;
      setTextValue(newValue);
      if (onChange) {
        onChange(e);
      }
    };

    // Character and word count calculations
    const charCount = String(textValue).length;
    const wordCount = String(textValue).trim()
      ? String(textValue).trim().split(/\s+/).length
      : 0;
    const isOverLimit = maxLength ? charCount > maxLength : false;

    return (
      <div className={containerClasses}>
        {label && (
          <label
            className={cn(
              "block text-sm font-medium text-[#136FB7] mb-2",
              labelClassName
            )}
          >
            {label}
          </label>
        )}

        <div className="relative">
          <textarea
            ref={ref}
            className={textareaClasses}
            value={textValue}
            onChange={handleChange}
            maxLength={maxLength}
            rows={autoResize ? minRows : undefined}
            {...props}
          />

          {TopRightIcon && (
            <div
              className={cn(
                "absolute right-3 top-3",
                onTopRightIconClick && "cursor-pointer hover:text-gray-600"
              )}
              onClick={onTopRightIconClick}
            >
              <TopRightIcon className="h-5 w-5 text-gray-400" />
            </div>
          )}
        </div>

        {/* Helper text and counts */}
        <div className="flex justify-between items-start mt-2">
          <div className="flex-1">
            {(helperText || errorMessage) && (
              <p
                className={cn(
                  "text-sm",
                  error ? "text-red-600" : "text-gray-600",
                  helperClassName
                )}
              >
                {error && errorMessage ? errorMessage : helperText}
              </p>
            )}
          </div>

          {(showCharCount || showWordCount) && (
            <div className="flex flex-col items-end text-xs text-gray-500 space-y-1 ml-2">
              {showCharCount && (
                <span
                  className={cn(
                    "transition-colors",
                    isOverLimit && "text-red-500"
                  )}
                >
                  {charCount}
                  {maxLength && `/${maxLength}`} chars
                </span>
              )}
              {showWordCount && <span>{wordCount} words</span>}
            </div>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea, type TextareaProps };
