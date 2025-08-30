"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import PhoneInput, { Country } from "react-phone-number-input";
import { ChevronDown } from "lucide-react";
import "react-phone-number-input/style.css";

export interface PhoneInputComponentProps {
  label?: string;
  error?: string;
  placeholder?: string;
  value?: string;
  onChange: (value: string | undefined, country?: any) => void;
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
            onChange={(value, country) => onChange(value, country)}
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
// import { ChevronDown } from "lucide-react";

// export interface CountryOption {
//   value: string;
//   label: string;
//   flag: string;
//   code: string;
// }

// export interface CustomPhoneInputProps {
//   label?: string;
//   error?: string;
//   placeholder?: string;
//   countryValue?: string;
//   phoneValue?: string;
//   onCountryChange: (value: string) => void;
//   onPhoneChange: (value: string) => void;
//   disabled?: boolean;
//   className?: string;
// }

// // Sample countries data - you can expand this or fetch from an API
// const COUNTRIES: CountryOption[] = [
//   { value: "EG", label: "Egypt (مصر)", flag: "🇪🇬", code: "+20" },
//   {
//     value: "SA",
//     label: "Saudi Arabia (العربية السعودية)",
//     flag: "🇸🇦",
//     code: "+966",
//   },
//   { value: "AF", label: "Afghanistan (افغانستان)", flag: "🇦🇫", code: "+93" },
//   { value: "AL", label: "Albania (Shqipëri)", flag: "🇦🇱", code: "+355" },
//   { value: "DZ", label: "Algeria (الجزائر)", flag: "🇩🇿", code: "+213" },
//   { value: "AS", label: "American Samoa", flag: "🇦🇸", code: "+1" },
//   { value: "AD", label: "Andorra", flag: "🇦🇩", code: "+376" },
// ];

// const CustomPhoneInput = React.forwardRef<
//   HTMLDivElement,
//   CustomPhoneInputProps
// >(
//   (
//     {
//       className,
//       label,
//       error,
//       placeholder = "Type Mobile Number",
//       countryValue = "EG",
//       phoneValue = "",
//       onCountryChange,
//       onPhoneChange,
//       disabled = false,
//       ...props
//     },
//     ref
//   ) => {
//     const [isOpen, setIsOpen] = React.useState(false);
//     const selectRef = React.useRef<HTMLDivElement>(null);

//     const selectedCountry =
//       COUNTRIES.find((country) => country.value === countryValue) ||
//       COUNTRIES[0];

//     // Close dropdown when clicking outside
//     React.useEffect(() => {
//       const handleClickOutside = (event: MouseEvent) => {
//         if (
//           selectRef.current &&
//           !selectRef.current.contains(event.target as Node)
//         ) {
//           setIsOpen(false);
//         }
//       };

//       document.addEventListener("mousedown", handleClickOutside);
//       return () => {
//         document.removeEventListener("mousedown", handleClickOutside);
//       };
//     }, []);

//     const handleCountrySelect = (country: CountryOption) => {
//       onCountryChange(country.value);
//       setIsOpen(false);
//     };

//     const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//       // Only allow numbers
//       const value = e.target.value.replace(/\D/g, "");
//       onPhoneChange(value);
//     };

//     return (
//       <div className="space-y-2" {...props}>
//         {label && (
//           <label className="text-sm font-medium text-blue-600 block">
//             {label}
//           </label>
//         )}

//         <div className="flex gap-2">
//           {/* Country Selector */}
//           <div className="relative" ref={selectRef}>
//             <div
//               role="combobox"
//               aria-expanded={isOpen}
//               aria-haspopup="listbox"
//               tabIndex={disabled ? -1 : 0}
//               onClick={() => !disabled && setIsOpen(!isOpen)}
//               className={cn(
//                 "flex h-12 items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 cursor-pointer focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 min-w-[100px]",
//                 error &&
//                   "border-red-500 focus:border-red-500 focus:ring-red-500/20",
//                 disabled && "cursor-not-allowed opacity-50"
//               )}
//             >
//               <div className="flex items-center gap-2">
//                 <span className="text-base">{selectedCountry.flag}</span>
//                 <span className="text-sm font-medium">
//                   {selectedCountry.code}
//                 </span>
//               </div>
//               <ChevronDown
//                 className={cn(
//                   "h-4 w-4 text-gray-400 transition-transform",
//                   isOpen && "rotate-180"
//                 )}
//               />
//             </div>

//             {isOpen && !disabled && (
//               <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-auto rounded-lg border border-gray-200 bg-white shadow-lg min-w-[280px]">
//                 {COUNTRIES.map((country) => (
//                   <div
//                     key={country.value}
//                     role="option"
//                     aria-selected={countryValue === country.value}
//                     onClick={() => handleCountrySelect(country)}
//                     className={cn(
//                       "flex items-center gap-3 px-4 py-3 text-sm cursor-pointer transition-colors hover:bg-blue-50",
//                       countryValue === country.value &&
//                         "bg-blue-50 text-blue-700"
//                     )}
//                   >
//                     <span className="text-base">{country.flag}</span>
//                     <span className="flex-1">{country.label}</span>
//                     <span className="text-gray-500 text-xs">
//                       {country.code}
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Phone Number Input */}
//           <div className="flex-1">
//             <input
//               type="tel"
//               value={phoneValue}
//               onChange={handlePhoneChange}
//               placeholder={placeholder}
//               disabled={disabled}
//               className={cn(
//                 "flex h-12 w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-50",
//                 error &&
//                   "border-red-500 focus:border-red-500 focus:ring-red-500/20",
//                 className
//               )}
//             />
//           </div>
//         </div>

//         {error && <p className="text-xs text-red-600">{error}</p>}
//       </div>
//     );
//   }
// );

// CustomPhoneInput.displayName = "CustomPhoneInput";

// export { CustomPhoneInput };
