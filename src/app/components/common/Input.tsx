"use client";

import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
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

  // Icons
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
  onRightIconClick?: () => void;

  // Layout
  fullWidth?: boolean;

  // Container class for additional styling
  containerClassName?: string;
  labelClassName?: string;
  helperClassName?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
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
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      onRightIconClick,
      fullWidth = false,
      type = "text",
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: "h-9 px-3 text-sm",
      md: "h-11 px-4 text-base", // 44px height from Figma
      lg: "h-12 px-5 text-lg",
    };

    const variantClasses = {
      default:
        "border border-gray-300 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-[#F1F7Fb]",
      outline: "border-2 border-gray-300 bg-transparent focus:border-blue-500",
      ghost:
        "border-0 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20",
      filled:
        "border-0 bg-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-500/20",
      custom:
        "border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20",
    };

    const inputClasses = cn(
      // Base styles
      "flex w-full rounded-xl font-medium transition-all duration-200 ease-in-out",
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

      // Icon padding adjustments
      LeftIcon && "pl-10",
      RightIcon && "pr-10",

      // Width
      fullWidth ? "w-full" : "w-full max-w-sm", // Default to Figma width equivalent (386px ≈ max-w-sm)

      className
    );

    const containerClasses = cn(
      "relative",
      fullWidth ? "w-full" : "w-full max-w-sm",
      containerClassName
    );

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
          {LeftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <LeftIcon className="h-5 w-5 text-gray-400" />
            </div>
          )}

          <input ref={ref} type={type} className={inputClasses} {...props} />

          {RightIcon && (
            <div
              className={cn(
                "absolute right-3 top-1/2 transform -translate-y-1/2",
                onRightIconClick && "cursor-pointer hover:text-gray-600"
              )}
              onClick={onRightIconClick}
            >
              <RightIcon className="h-5 w-5 text-gray-400" />
            </div>
          )}
        </div>

        {(helperText || errorMessage) && (
          <p
            className={cn(
              "mt-2 text-sm",
              error ? "text-red-600" : "text-gray-600",
              helperClassName
            )}
          >
            {error && errorMessage ? errorMessage : helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input, type InputProps };
