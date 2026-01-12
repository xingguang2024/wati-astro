import js from "@eslint/js";
import typescript from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import importPlugin from "eslint-plugin-import";

export default [
  js.configs.recommended, // TypeScript and React files
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true
        }
      },
      globals: {
        ...globals.browser,
        ...globals.es2021
      }
    },
    plugins: {
      "@typescript-eslint": typescript,
      react,
      "react-hooks": reactHooks,
      import: importPlugin
    },
    rules: {
      // Basic TypeScript rules
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" }
      ],
      "@typescript-eslint/no-explicit-any": "warn",

      // React rules
      "react/jsx-uses-react": "error",
      "react/jsx-uses-vars": "error",
      "react/prop-types": "off",
      "react/react-in-jsx-scope": "off",

      // React Hooks rules
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // General rules
      "no-console": "off",
      "no-debugger": "error",
      "no-unused-vars": "off",
      "prefer-const": "error",
      "no-undef": "error",

      // Import/Export rules
      "import/order": [
        "error",
        {
          groups: [
            "builtin", // Node.js built-in modules
            "external", // npm packages
            "internal", // internal modules (alias)
            "parent", // parent directories
            "sibling", // sibling files
            "index", // index files
            "type" // type-only imports
          ],
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
            caseInsensitive: true
          }
        }
      ],
      "import/no-duplicates": "error",
      "import/no-unresolved": "off", // TypeScript handles this
      "import/named": "off"
    },
    settings: {
      react: {
        version: "detect"
      }
    }
  }, // JavaScript files
  {
    files: ["**/*.js", "**/*.mjs"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021
      }
    },
    rules: {
      "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "no-console": "off",
      "no-debugger": "error",
      "prefer-const": "error"
    }
  }, // Server-side files (API routes, middleware)
  {
    files: [
      "src/pages/api/**/*.ts",
      "src/middleware.ts",
      "src/pages/healthz.ts"
    ],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module"
      },
      globals: {
        ...globals.node,
        ...globals.es2021
      }
    },
    plugins: {
      "@typescript-eslint": typescript
    },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" }
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      "no-console": "off",
      "no-debugger": "error",
      "no-unused-vars": "off",
      "prefer-const": "error"
    }
  }, // Ignore patterns
  {
    ignores: [
      "dist/",
      "node_modules/",
      "*.config.js",
      "*.config.ts",
      "*.config.mjs",
      "public/",
      ".astro/",
      "coverage/",
      "build/",
      "*.min.js",
      "**/*.astro"
    ]
  }
];
