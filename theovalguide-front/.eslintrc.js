/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  // Let ESLint parse both TS/JS
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: { jsx: true },
    project: false, // set your tsconfig path if you want type-aware linting
  },
  settings: {
    react: { version: "detect" },
    "import/resolver": {
      node: { extensions: [".js", ".jsx", ".ts", ".tsx"] },
      // If you use path aliases via tsconfig.json -> compilerOptions.paths
      typescript: {},
    },
  },
  env: { browser: true, es2022: true, node: true },
  extends: [
    "next/core-web-vitals", // Next.js best practices
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "plugin:prettier/recommended", // adds plugin:prettier & "prettier" to turns off conflicting rules
  ],
  plugins: [
    "@typescript-eslint",
    "jsx-a11y",
    "import",
    "unused-imports",
    "prettier",
  ],
  rules: {
    /** Prettier runs as an ESLint rule so `eslint --fix` formats too */
    "prettier/prettier": "warn",

    /** Clean imports */
    "unused-imports/no-unused-imports": "error",
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        caughtErrorsIgnorePattern: "^_",
      },
    ],

    /** Import order & hygiene */
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

    /** Reasonable runtime rules */
    "no-console":
      process.env.NODE_ENV === "production"
        ? ["warn", { allow: ["warn", "error"] }]
        : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",

    /** TypeScript niceties */
    "@typescript-eslint/consistent-type-imports": [
      "warn",
      { prefer: "type-imports" },
    ],
    "@typescript-eslint/no-non-null-assertion": "off",
  },
  overrides: [
    // Allow dev-only console in config/scripts/tests
    {
      files: [
        "*.config.{js,cjs,mjs,ts}",
        "scripts/**",
        "**/*.test.*",
        "**/*.spec.*",
        "cypress/**",
      ],
      rules: { "no-console": "off" },
    },
  ],
  ignorePatterns: [
    ".next/",
    "out/",
    "dist/",
    "build/",
    "coverage/",
    "node_modules/",
    "*.min.*",
    "*.lock",
    "public/",
  ],
};
