// Unknown URLs get dist/404.html (HTTP 404, like GitHub Pages), and the
// client router renders the NotFound page with a noindex robots tag.
import { expect, test } from "./fixtures";

for (const path of ["/no-such-page", "/products/no-such-product"]) {
    test(`${path} shows the not-found page, noindexed`, async ({ page }) => {
        const res = await page.goto(path);
        expect(res?.status()).toBe(404);
        await expect(
            page.getByRole("heading", {
                level: 1,
                name: "This page isn't here.",
            })
        ).toBeVisible();
        await expect(page.locator("head meta[name='robots']")).toHaveAttribute(
            "content",
            /noindex/
        );
        await expect(page.locator("head link[rel='canonical']")).toHaveCount(0);
        await expect(
            page.getByRole("main").getByRole("link", { name: "Shop all" })
        ).toBeVisible();
    });
}
