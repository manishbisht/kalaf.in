// Prerendered pages hydrate in the browser. A render that differs between the
// build and the browser (dates, window, random values) shows up as React
// error #418 / #423 / #425 in the console; any other console error or
// uncaught exception fails the page too. Runs on desktop and mobile.
import { DUPATTA, expect, test } from "./fixtures";

const PAGES = [
    "/",
    "/products",
    DUPATTA,
    "/faq",
    "/journal/what-is-bandhani",
    "/links",
    "/links/",
];

for (const path of PAGES) {
    test(`${path} loads without hydration or console errors`, async ({
        page,
        errors,
    }) => {
        const res = await page.goto(path, { waitUntil: "networkidle" });
        expect(res?.status()).toBe(200);
        // Prerendered HTML for exactly this path, so the app hydrates it.
        const prerendered = await page
            .locator("#root")
            .getAttribute("data-path");
        expect(prerendered).toBe(path.replace(/(.)\/+$/, "$1"));
        await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
        expect(errors, errors.join("\n")).toEqual([]);
    });
}
