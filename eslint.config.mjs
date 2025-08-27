// eslint.config.mjs
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  // Next + TS recommended
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // Your overrides (apply to TS/JS)
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    rules: {
      // allow `any`
      "@typescript-eslint/no-explicit-any": "off",

      // unused vars -> warn (ignore underscored)
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],

      // allow apostrophes / quotes in JSX text
      "react/no-unescaped-entities": "off",

      // allow .apply (or keep 'warn' if you prefer)
      "prefer-spread": "off",

      // silence <img> warning (or fix by using next/image)
      "@next/next/no-img-element": "off",

      // soften exhaustive deps (optional)
      "react-hooks/exhaustive-deps": "warn",
    },
  },
];

// import { dirname } from "path";
// import { fileURLToPath } from "url";
// import { FlatCompat } from "@eslint/eslintrc";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// const compat = new FlatCompat({
//   baseDirectory: __dirname,
// });

// const eslintConfig = [
//   ...compat.extends("next/core-web-vitals", "next/typescript"),
// ];

// export default eslintConfig;
