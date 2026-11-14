// Shared test setup: every test imports `test` and `expect` from here.
//
// - Requests that leave the local server (Google Fonts, Fontshare, Clarity
//   when the deploy build sets its ID) get an empty 200 instead, so tests are
//   fast, work offline, don't depend on third-party uptime and send nothing
//   to analytics.
// - `errors` collects every console.error and uncaught page error, for tests
//   that assert a page loads cleanly.
import { test as base, expect } from "@playwright/test";

const STUB_TYPES: Record<string, string> = {
    stylesheet: "text/css",
    script: "text/javascript",
};

export const test = base.extend<{ errors: string[] }>({
    page: async ({ page, baseURL }, run) => {
        await page.route(
            (url) => !url.href.startsWith(baseURL ?? ""),
            (route) =>
                route.fulfill({
                    status: 200,
                    contentType:
                        STUB_TYPES[route.request().resourceType()] ??
                        "text/plain",
                    body: "",
                })
        );
        await run(page);
    },
    errors: async ({ page }, run) => {
        const errors: string[] = [];
        page.on("console", (msg) => {
            if (msg.type() === "error") errors.push(`console: ${msg.text()}`);
        });
        page.on("pageerror", (err) => errors.push(`pageerror: ${err.message}`));
        await run(errors);
    },
});

export { expect };

// A product with several colours and both Flipkart and Meesho links.
export const DUPATTA = "/products/bandhani-dupatta";
