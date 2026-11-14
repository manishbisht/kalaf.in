// End-to-end browser tests (e2e/*.spec.ts) against the built site in dist/,
// served like GitHub Pages by e2e/serve.mjs. Build first (`yarn build`), then
// `yarn test:e2e`. See scripts/README.md → Tests.
import { existsSync } from "node:fs";
import { defineConfig, devices } from "@playwright/test";

if (!existsSync("dist/404.html")) {
    throw new Error(
        "dist/ isn't built, so there's nothing to test. Run the full build first: yarn build (or the four steps in AGENTS.md)."
    );
}

const PORT = Number(process.env.E2E_PORT) || 4317;
const CI = !!process.env.CI;

export default defineConfig({
    testDir: "e2e",
    fullyParallel: true,
    forbidOnly: CI,
    retries: CI ? 1 : 0,
    timeout: 15_000,
    expect: { timeout: 5_000 },
    reporter: CI
        ? [["list"], ["html", { open: "never" }]]
        : [["list"], ["html", { open: "on-failure" }]],
    use: {
        baseURL: `http://127.0.0.1:${PORT}`,
        trace: "retain-on-failure",
    },
    projects: [
        {
            name: "desktop",
            use: { ...devices["Desktop Chrome"] },
            testIgnore: /\.mobile\.spec\.ts$/,
        },
        {
            // Pixel 7 is emulated in Chromium (touch, 412px wide), so the shop
            // filters become a drawer. Runs the mobile specs plus the
            // hydration check, since the narrow layout renders differently
            // after hydration.
            name: "mobile",
            use: { ...devices["Pixel 7"] },
            testMatch: /(\.mobile|hydration)\.spec\.ts$/,
        },
    ],
    webServer: {
        command: "node e2e/serve.mjs",
        url: `http://127.0.0.1:${PORT}/`,
        env: { PORT: String(PORT) },
        // Never reuse: another server on the port (vite preview, say) would
        // not behave like GitHub Pages.
        reuseExistingServer: false,
        timeout: 10_000,
    },
});
