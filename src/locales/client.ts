"use client";
import { createI18nClient } from "next-international/client";

// Define a type for translation parameters
interface TranslationParams {
  count: number; // Required count property
  [key: string]: string | number | undefined; // Compatible with LocaleValue
}

const createOptionalParamsI18n = () => {
  const {
    useI18n: originalUseI18n,
    useScopedI18n,
    I18nProviderClient,
    useChangeLocale,
  } = createI18nClient({
    ar: () => import("./ar"),
    en: () => import("./en"),
  });

  // Create a custom useI18n hook that provides default params with count=1
  const useI18n = () => {
    const originalT = originalUseI18n();

    // Return a wrapped version of t that provides default params with count=1
    const t = (key: string, params?: TranslationParams) => {
      const paramsWithCount: TranslationParams = {
        count: 1,
        ...(params || {}),
      };

      return originalT(key, paramsWithCount);
    };

    return t;
  };

  return { useI18n, useScopedI18n, I18nProviderClient, useChangeLocale };
};

// Export the hooks with the custom useI18n
export const { useI18n, useScopedI18n, I18nProviderClient, useChangeLocale } =
  createOptionalParamsI18n();

// "use client";
// import { createI18nClient } from "next-international/client";
// // import type { ParamsObject, ReactParamsObject } from "next-international";
// // import { ReactNode } from "react";

// // Create a wrapper for the original useI18n hook to make params optional
// const createOptionalParamsI18n = () => {
//   const {
//     useI18n: originalUseI18n,
//     useScopedI18n,
//     I18nProviderClient,
//     useChangeLocale,
//   } = createI18nClient({
//     ar: () => import("./ar"),
//     en: () => import("./en"),
//   });

//   // Create a custom useI18n hook that provides default params with count
//   const useI18n = () => {
//     const originalT = originalUseI18n();

//     // Return a wrapped version of t that provides default params with count=1
//     const t = ((key: string, params?: any) => {
//       // Make sure count exists in params
//       const paramsWithCount = {
//         count: 1,
//         ...(params || {}),
//       };

//       // Cast originalT to any to bypass TypeScript restrictions
//       return (originalT as any)(key, paramsWithCount);
//     }) as typeof originalT;

//     // Just return t as it already has the proper type
//     return t;
//   };

//   return { useI18n, useScopedI18n, I18nProviderClient, useChangeLocale };
// };

// // Export the hooks with the custom useI18n
// export const { useI18n, useScopedI18n, I18nProviderClient, useChangeLocale } =
//   createOptionalParamsI18n();
