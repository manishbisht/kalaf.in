/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_CLARITY_PROJECT_ID?: string;
    readonly VITE_BUILD_VERSION?: string;
    readonly VITE_COMMIT_SHA?: string;
}

// Set by `define` in vite.config.ts; absent under Vitest.
declare const __BUILD_YEAR__: number | undefined;
