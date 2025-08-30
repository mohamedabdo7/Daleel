"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import PhoneInput, { Country } from "react-phone-number-input";
import "react-phone-number-input/style.css";

export interface PhoneInputComponentProps {
  label?: string;
  error?: string;
  placeholder?: string;
  value?: string | undefined;
  onChange: (value?: string) => void;
  onCountryChange?: (country?: Country) => void; // Added for country changes
  disabled?: boolean;
  className?: string;
  defaultCountry?: Country;
}

const PhoneInputComponent = React.forwardRef<
  HTMLDivElement,
  PhoneInputComponentProps
>(
  (
    {
      className,
      label,
      error,
      placeholder = "Type Mobile Number",
      value,
      onChange,
      onCountryChange,
      disabled = false,
      defaultCountry = "EG",
      ...props
    },
    ref
  ) => {
    return (
      <div className="space-y-2" {...props} ref={ref}>
        {label && (
          <label className="text-sm font-medium text-blue-600 block">
            {label}
          </label>
        )}

        <div className="phone-input-wrapper">
          <PhoneInput
            international
            countryCallingCodeEditable={false}
            defaultCountry={defaultCountry}
            value={value}
            onChange={onChange}
            onCountryChange={onCountryChange} // Pass country change handler
            disabled={disabled}
            placeholder={placeholder}
            className={cn(
              "custom-phone-input",
              error && "error",
              disabled && "disabled",
              className
            )}
          />
        </div>

        {error && <p className="text-xs text-red-600">{error}</p>}

        <style jsx>{`
          .phone-input-wrapper :global(.PhoneInput) {
            display: flex;
            gap: 8px;
          }

          .phone-input-wrapper :global(.PhoneInputCountrySelect) {
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 48px;
            min-width: 100px;
            padding: 8px 12px;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            background-color: #f9fafb;
            color: #111827;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.15s ease-in-out;
          }

          .phone-input-wrapper :global(.PhoneInputCountrySelect:focus) {
            outline: none;
            border-color: #3b82f6;
            background-color: white;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
          }

          .phone-input-wrapper :global(.PhoneInputCountrySelect:hover) {
            border-color: #d1d5db;
          }

          .phone-input-wrapper :global(.PhoneInputCountrySelectArrow) {
            width: 16px;
            height: 16px;
            color: #9ca3af;
            margin-left: 8px;
            transition: transform 0.15s ease-in-out;
          }

          .phone-input-wrapper
            :global(
              .PhoneInputCountrySelect[aria-expanded="true"]
                .PhoneInputCountrySelectArrow
            ) {
            transform: rotate(180deg);
          }

          .phone-input-wrapper :global(.PhoneInputInput) {
            flex: 1;
            height: 48px;
            width: 100%;
            padding: 8px 16px;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            background-color: #f9fafb;
            color: #111827;
            font-size: 14px;
            transition: all 0.15s ease-in-out;
          }

          .phone-input-wrapper :global(.PhoneInputInput::placeholder) {
            color: #6b7280;
          }

          .phone-input-wrapper :global(.PhoneInputInput:focus) {
            outline: none;
            border-color: #3b82f6;
            background-color: white;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
          }

          .phone-input-wrapper :global(.PhoneInputCountryIcon) {
            width: 20px;
            height: 15px;
            margin-right: 8px;
          }

          .phone-input-wrapper :global(.PhoneInputCountryIcon--square) {
            width: 18px;
            height: 18px;
          }

          .phone-input-wrapper :global(.PhoneInputCountryIcon--border) {
            border-radius: 2px;
            box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
          }

          /* Country dropdown */
          .phone-input-wrapper
            :global(
              .PhoneInputCountrySelect--focus .PhoneInputCountrySelectArrow
            ) {
            transform: rotate(180deg);
          }

          /* Error state */
          .phone-input-wrapper
            :global(.custom-phone-input.error .PhoneInputCountrySelect) {
            border-color: #ef4444;
          }

          .phone-input-wrapper
            :global(.custom-phone-input.error .PhoneInputCountrySelect:focus) {
            border-color: #ef4444;
            box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
          }

          .phone-input-wrapper
            :global(.custom-phone-input.error .PhoneInputInput) {
            border-color: #ef4444;
          }

          .phone-input-wrapper
            :global(.custom-phone-input.error .PhoneInputInput:focus) {
            border-color: #ef4444;
            box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
          }

          /* Disabled state */
          .phone-input-wrapper
            :global(.custom-phone-input.disabled .PhoneInputCountrySelect) {
            cursor: not-allowed;
            opacity: 0.5;
          }

          .phone-input-wrapper
            :global(.custom-phone-input.disabled .PhoneInputInput) {
            Ascending
            cursor: not-allowed;
            opacity: 0.5;
          }
        `}</style>
      </div>
    );
  }
);

PhoneInputComponent.displayName = "PhoneInputComponent";

export { PhoneInputComponent };

// "use client";

// import * as React from "react";
// import { cn } from "@/lib/utils";
// import PhoneInput, { Country } from "react-phone-number-input";
// import { ChevronDown } from "lucide-react";
// import "react-phone-number-input/style.css";

// export interface PhoneInputComponentProps {
//   label?: string;
//   error?: string;
//   placeholder?: string;
//   value?: string;
//   onChange: (value: string | undefined, country?: any) => void;
//   disabled?: boolean;
//   className?: string;
//   defaultCountry?: Country;
// }

// const PhoneInputComponent = React.forwardRef<
//   HTMLDivElement,
//   PhoneInputComponentProps
// >(
//   (
//     {
//       className,
//       label,
//       error,
//       placeholder = "Type Mobile Number",
//       value,
//       onChange,
//       disabled = false,
//       defaultCountry = "EG",
//       ...props
//     },
//     ref
//   ) => {
//     return (
//       <div className="space-y-2" {...props} ref={ref}>
//         {label && (
//           <label className="text-sm font-medium text-blue-600 block">
//             {label}
//           </label>
//         )}

//         <div className="phone-input-wrapper">
//           <PhoneInput
//             international
//             countryCallingCodeEditable={false}
//             defaultCountry={defaultCountry}
//             value={value}
//             onChange={(value, country) => onChange(value, country)}
//             disabled={disabled}
//             placeholder={placeholder}
//             className={cn(
//               "custom-phone-input",
//               error && "error",
//               disabled && "disabled",
//               className
//             )}
//           />
//         </div>

//         {error && <p className="text-xs text-red-600">{error}</p>}

//         <style jsx>{`
//           .phone-input-wrapper :global(.PhoneInput) {
//             display: flex;
//             gap: 8px;
//           }

//           .phone-input-wrapper :global(.PhoneInputCountrySelect) {
//             display: flex;
//             align-items: center;
//             justify-content: space-between;
//             height: 48px;
//             min-width: 100px;
//             padding: 8px 12px;
//             border: 1px solid #e5e7eb;
//             border-radius: 8px;
//             background-color: #f9fafb;
//             color: #111827;
//             font-size: 14px;
//             cursor: pointer;
//             transition: all 0.15s ease-in-out;
//           }

//           .phone-input-wrapper :global(.PhoneInputCountrySelect:focus) {
//             outline: none;
//             border-color: #3b82f6;
//             background-color: white;
//             box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
//           }

//           .phone-input-wrapper :global(.PhoneInputCountrySelect:hover) {
//             border-color: #d1d5db;
//           }

//           .phone-input-wrapper :global(.PhoneInputCountrySelectArrow) {
//             width: 16px;
//             height: 16px;
//             color: #9ca3af;
//             margin-left: 8px;
//             transition: transform 0.15s ease-in-out;
//           }

//           .phone-input-wrapper
//             :global(
//               .PhoneInputCountrySelect[aria-expanded="true"]
//                 .PhoneInputCountrySelectArrow
//             ) {
//             transform: rotate(180deg);
//           }

//           .phone-input-wrapper :global(.PhoneInputInput) {
//             flex: 1;
//             height: 48px;
//             width: 100%;
//             padding: 8px 16px;
//             border: 1px solid #e5e7eb;
//             border-radius: 8px;
//             background-color: #f9fafb;
//             color: #111827;
//             font-size: 14px;
//             transition: all 0.15s ease-in-out;
//           }

//           .phone-input-wrapper :global(.PhoneInputInput::placeholder) {
//             color: #6b7280;
//           }

//           .phone-input-wrapper :global(.PhoneInputInput:focus) {
//             outline: none;
//             border-color: #3b82f6;
//             background-color: white;
//             box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
//           }

//           .phone-input-wrapper :global(.PhoneInputCountryIcon) {
//             width: 20px;
//             height: 15px;
//             margin-right: 8px;
//           }

//           .phone-input-wrapper :global(.PhoneInputCountryIcon--square) {
//             width: 18px;
//             height: 18px;
//           }

//           .phone-input-wrapper :global(.PhoneInputCountryIcon--border) {
//             border-radius: 2px;
//             box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
//           }

//           /* Country dropdown */
//           .phone-input-wrapper
//             :global(
//               .PhoneInputCountrySelect--focus .PhoneInputCountrySelectArrow
//             ) {
//             transform: rotate(180deg);
//           }

//           /* Error state */
//           .phone-input-wrapper
//             :global(.custom-phone-input.error .PhoneInputCountrySelect) {
//             border-color: #ef4444;
//           }

//           .phone-input-wrapper
//             :global(.custom-phone-input.error .PhoneInputCountrySelect:focus) {
//             border-color: #ef4444;
//             box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
//           }

//           .phone-input-wrapper
//             :global(.custom-phone-input.error .PhoneInputInput) {
//             border-color: #ef4444;
//           }

//           .phone-input-wrapper
//             :global(.custom-phone-input.error .PhoneInputInput:focus) {
//             border-color: #ef4444;
//             box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
//           }

//           /* Disabled state */
//           .phone-input-wrapper
//             :global(.custom-phone-input.disabled .PhoneInputCountrySelect) {
//             cursor: not-allowed;
//             opacity: 0.5;
//           }

//           .phone-input-wrapper
//             :global(.custom-phone-input.disabled .PhoneInputInput) {
//             cursor: not-allowed;
//             opacity: 0.5;
//           }
//         `}</style>
//       </div>
//     );
//   }
// );

// PhoneInputComponent.displayName = "PhoneInputComponent";

// export { PhoneInputComponent };
