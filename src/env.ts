// Single read-point for every VITE_* env variable.
// Anything that needs env config imports `ENV` from here instead of touching
// `import.meta.env` directly. The TypeScript shape lives in `vite-env.d.ts`.

export const ENV = {
    /** Microsoft Clarity project ID. Blank → analytics disabled. */
    clarityProjectId: import.meta.env.VITE_CLARITY_PROJECT_ID,
    /** CalVer build stamp injected by CI (e.g. "2026.05.23.0914"). */
    buildVersion: import.meta.env.VITE_BUILD_VERSION,
    /** Full git SHA of the commit that produced this build. */
    commitSha: import.meta.env.VITE_COMMIT_SHA,
} as const;
