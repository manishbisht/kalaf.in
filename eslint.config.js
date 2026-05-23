import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import react from "eslint-plugin-react";
import tseslint from "typescript-eslint";
import prettierRecommended from "eslint-plugin-prettier/recommended";

export default tseslint.config(
    { ignores: ["dist", "node_modules"] },

    // Base JS rules
    js.configs.recommended,

    // typescript-eslint recommended rules (works on .ts/.tsx)
    ...tseslint.configs.recommended,

    // React flat config — jsx-runtime preset disables rules not needed with the new JSX transform
    {
        ...react.configs.flat["jsx-runtime"],
        files: ["**/*.{js,jsx,ts,tsx}"],
        settings: { react: { version: "detect" } },
    },

    // Project-level overrides + hooks + refresh
    {
        files: ["**/*.{js,jsx,ts,tsx}"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            globals: globals.browser,
            parserOptions: {
                ecmaFeatures: { jsx: true },
            },
        },
        plugins: {
            "react-hooks": reactHooks,
            "react-refresh": reactRefresh,
        },
        rules: {
            ...reactHooks.configs.recommended.rules,
            "react-refresh/only-export-components": [
                "warn",
                { allowConstantExport: true },
            ],
            "react/prop-types": "off",
            // Prefer the typescript-eslint variant; disable the core rule
            "no-unused-vars": "off",
            "@typescript-eslint/no-unused-vars": [
                "warn",
                { varsIgnorePattern: "^_", argsIgnorePattern: "^_" },
            ],
        },
    },

    // Run Prettier as an ESLint rule + disable formatting rules that conflict.
    // Must come last so it overrides anything above.
    prettierRecommended
);
