// The Content Security Policy (vite.config.ts) is in every built page and
// blocks nothing the site itself uses: no violation is reported, and the
// font stylesheets' inline onload (allowed by its hash) still switches them
// from media="print" to "all".
import { DUPATTA, expect, test } from "./fixtures";

const PAGES = ["/", "/products", DUPATTA, "/journal/what-is-bandhani", "/nope"];

for (const path of PAGES) {
    test(`${path} has the CSP and breaks none of it`, async ({ page }) => {
        await page.addInitScript(() => {
            const w = window as unknown as { cspViolations: string[] };
            w.cspViolations = [];
            document.addEventListener("securitypolicyviolation", (e) =>
                w.cspViolations.push(
                    `${e.effectiveDirective} blocked ${e.blockedURI || "inline"}`
                )
            );
        });
        await page.goto(path, { waitUntil: "networkidle" });

        const csp = await page
            .locator('meta[http-equiv="Content-Security-Policy"]')
            .getAttribute("content");
        expect(csp).toContain("default-src 'self'");

        // The font stylesheets' onload handler ran.
        const fonts = page.locator('link[rel="stylesheet"][href^="https://"]');
        await expect(fonts).toHaveCount(2);
        for (const link of await fonts.all()) {
            await expect(link).toHaveAttribute("media", "all");
        }

        // Scroll so lazy images and video load too.
        await page.mouse.wheel(0, 4000);
        await page.waitForLoadState("networkidle");
        const violations = await page.evaluate(
            () =>
                (window as unknown as { cspViolations: string[] }).cspViolations
        );
        expect(violations, violations.join("\n")).toEqual([]);
    });
}
