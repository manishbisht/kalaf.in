import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import react from 'eslint-plugin-react'
import prettierConfig from 'eslint-config-prettier'

export default [
  { ignores: ['dist', 'node_modules'] },

  // Base JS rules
  js.configs.recommended,

  // React flat config — jsx-runtime preset disables rules not needed with the new JSX transform
  {
    ...react.configs.flat['jsx-runtime'],
    files: ['**/*.{js,jsx}'],
    settings: { react: { version: 'detect' } },
  },

  // Project-level overrides + hooks + refresh
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'react/prop-types': 'off',
      'no-unused-vars': ['warn', { varsIgnorePattern: '^_', argsIgnorePattern: '^_' }],
    },
  },

  // Disable all ESLint formatting rules that Prettier owns
  prettierConfig,
]
