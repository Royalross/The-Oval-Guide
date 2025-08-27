// theovalguide-front/eslint.config.mjs
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import importPlugin from "eslint-plugin-import";
import jsxA11y from "eslint-plugin-jsx-a11y";
import prettierPlugin from "eslint-plugin-prettier";
import reactPlugin from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

/**
 * ESLint 9 flat config tailored for Next.js (without eslint-config-next).
 * - Works with ESLint v9.34.0
 * - No @rushstack/eslint-patch dependency
 * - React/TS/Prettier/import/a11y rules included
 */
export default [
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      import: importPlugin,
      "jsx-a11y": jsxA11y,
      prettier: prettierPlugin,
      react: reactPlugin,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    settings: {
      react: { version: "detect" },
      "import/resolver": {
        node: { extensions: [".js", ".jsx", ".ts", ".tsx"] },
        typescript: {}, // supports tsconfig paths
      },
    },
    rules: {
      // Prettier integration
      "prettier/prettier": "warn",

      // Unused vars (prefer TS rule)
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_", caughtErrorsIgnorePattern: "^_" },
      ],

      // Import hygiene & order
      "import/order": [
        "warn",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
            "object",
            "type",
          ],
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
          pathGroups: [
            { pattern: "@/components/**", group: "internal", position: "before" },
            { pattern: "@/lib/**", group: "internal", position: "before" },
            { pattern: "@/app/**", group: "internal", position: "before" },
          ],
          pathGroupsExcludedImportTypes: ["builtin"],
        },
      ],
      "import/first": "warn",
      "import/newline-after-import": "warn",
      "import/no-duplicates": "warn",

      // Reasonable runtime rules
      "no-console":
        process.env.NODE_ENV === "production" ? ["warn", { allow: ["warn", "error"] }] : "off",
      "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",

      // TS niceties
      "@typescript-eslint/consistent-type-imports": ["warn", { prefer: "type-imports" }],
      "@typescript-eslint/no-non-null-assertion": "off",

      // React / hooks (Next.js doesn’t need React in scope)
      "react/jsx-uses-react": "off",
      "react/react-in-jsx-scope": "off",
      "react-refresh/only-export-components": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
    },
  },

  // Dev-only console in configs/tests
  {
    files: ["*.config.{js,cjs,mjs,ts}", "scripts/**", "**/*.test.*", "**/*.spec.*", "cypress/**"],
    rules: { "no-console": "off" },
  },

  // Replaces .eslintignore
  {
    ignores: [
      ".next/",
      "out/",
      "dist/",
      "build/",
      "coverage/",
      "node_modules/",
      "*.min.*",
      "*.lock",
      "public/",
      "next-env.d.ts",
    ],
  },
];
