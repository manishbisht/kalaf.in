// Unit tests run in Node (no browser). Component tests opt into jsdom with a
// `// @vitest-environment jsdom` comment at the top of the file.
// scripts/prerender.test.ts checks the built site in dist/ and skips itself
// until a build exists (run it after a build with `yarn test:dist`).
import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        include: ["src/**/*.test.{ts,tsx}", "scripts/**/*.test.ts"],
        // .env is committed with a blank Clarity ID; keep tests independent of
        // whatever a developer has in .env.local.
        env: { VITE_CLARITY_PROJECT_ID: "" },
    },
});
