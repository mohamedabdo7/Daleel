"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, AlertCircle, Loader2 } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
}

export interface CustomSelectProps {
  label?: string;
  error?: string;
  placeholder?: string;
  options: SelectOption[];
  value?: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

const CustomSelect = React.forwardRef<HTMLDivElement, CustomSelectProps>(
  (
    {
      className,
      label,
      error,
      placeholder = "Select an option",
      options = [],
      value,
      onValueChange,
      disabled = false,
      loading = false,
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const selectRef = React.useRef<HTMLDivElement>(null);

    const selectedOption = options.find((option) => option.value === value);

    // Close dropdown when clicking outside
    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          selectRef.current &&
          !selectRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

    const handleOptionClick = (optionValue: string) => {
      onValueChange(optionValue);
      setIsOpen(false);
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
      if (disabled) return;

      switch (event.key) {
        case "Enter":
        case " ":
          event.preventDefault();
          setIsOpen(!isOpen);
          break;
        case "Escape":
          setIsOpen(false);
          break;
        case "ArrowDown":
          event.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
          } else {
            // Focus next option logic could be added here
          }
          break;
        case "ArrowUp":
          event.preventDefault();
          if (!isOpen) {
            setIsOpen(true);
          }
          // Focus previous option logic could be added here
          break;
      }
    };

    return (
      <div className="space-y-2" {...props}>
        {label && (
          <label className="text-sm font-medium text-blue-600 block items-center gap-2">
            {label}
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          </label>
        )}
        <div className="relative" ref={selectRef}>
          <div
            ref={ref}
            role="combobox"
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            tabIndex={disabled ? -1 : 0}
            onClick={() => !disabled && !loading && setIsOpen(!isOpen)}
            onKeyDown={handleKeyDown}
            className={cn(
              "flex h-12 w-full items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-900 cursor-pointer focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20",
              error &&
                "border-red-500 focus:border-red-500 focus:ring-red-500/20",
              (disabled || loading) && "cursor-not-allowed opacity-50",
              className
            )}
          >
            <span
              className={selectedOption ? "text-gray-900" : "text-gray-500"}
            >
              {loading ? "Loading..." : selectedOption?.label || placeholder}
            </span>
            <ChevronDown
              className={cn(
                "h-4 w-4 text-gray-400 transition-transform",
                isOpen && "rotate-180"
              )}
            />
          </div>

          {isOpen && !disabled && !loading && (
            <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-auto rounded-lg border border-gray-200 bg-white shadow-lg">
              {options.length === 0 ? (
                <div className="px-4 py-3 text-sm text-gray-500">
                  No options available
                </div>
              ) : (
                options.map((option) => (
                  <div
                    key={option.value}
                    role="option"
                    aria-selected={value === option.value}
                    onClick={() => handleOptionClick(option.value)}
                    className={cn(
                      "px-4 py-3 text-sm cursor-pointer transition-colors hover:bg-blue-50",
                      value === option.value &&
                        "bg-blue-50 text-blue-700 font-medium"
                    )}
                  >
                    {option.label}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {error && (
          <div className="flex items-center gap-2 text-xs text-red-600">
            <AlertCircle className="h-3 w-3" />
            {error}
          </div>
        )}
      </div>
    );
  }
);

CustomSelect.displayName = "CustomSelect";

export { CustomSelect };
