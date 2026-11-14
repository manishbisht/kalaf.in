// The floating WhatsApp badge pre-fills the product and colour on a product
// page, and stays off /links, which has its own WhatsApp button.
import { DUPATTA, expect, test } from "./fixtures";

const BADGE = { name: "Chat with us on WhatsApp" };

// The badge's pre-filled message.
const message = (href: string | null) =>
    new URL(href ?? "about:blank").searchParams.get("text") ?? "";

test("the WhatsApp badge names the product and colour", async ({ page }) => {
    await page.goto(`${DUPATTA}?colour=RED`);
    const badge = page.getByRole("link", BADGE);
    await expect(badge).toHaveAttribute("href", /^https:\/\/wa\.me\/\d+\?/);
    const text = message(await badge.getAttribute("href"));
    expect(text).toContain("Bandhani Dupatta (Red)");
    expect(text).toContain("https://kalaf.in/products/bandhani-dupatta");

    // It follows a colour change.
    await page.getByRole("button", { name: "Green", exact: true }).click();
    await expect
        .poll(async () => message(await badge.getAttribute("href")))
        .toContain("Bandhani Dupatta (Green)");
});

for (const path of ["/links", "/links/"]) {
    test(`the WhatsApp badge is hidden on ${path}`, async ({ page }) => {
        await page.goto(path);
        await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
        // The page's own WhatsApp button is there; the floating badge isn't.
        await expect(page.locator("a[href*='wa.me']").first()).toBeVisible();
        await expect(page.getByRole("link", BADGE)).toHaveCount(0);
    });
}
