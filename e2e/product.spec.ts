// The product page: colour picker, photo lightbox and buy links.
import { DUPATTA, expect, test } from "./fixtures";

const PANTS = "/products/cotton-relaxed-trousers";

test("changing colour updates the URL and the title", async ({ page }) => {
    await page.goto(`${DUPATTA}?colour=RED`);
    await expect(page).toHaveTitle(/^Bandhani Dupatta — Red · Kalaf$/);

    await page.getByRole("button", { name: "Green", exact: true }).click();
    await expect(page).toHaveURL(`${DUPATTA}?colour=GR`);
    await expect(page).toHaveTitle(/^Bandhani Dupatta — Green · Kalaf$/);
    await expect(page.getByText("Colour — Green")).toBeVisible();
    await expect(
        page.getByRole("button", { name: "Green", exact: true })
    ).toHaveAttribute("aria-pressed", "true");
});

test("the lightbox opens on a photo, pages with the arrow keys and closes on Esc", async ({
    page,
}) => {
    await page.goto(DUPATTA);
    const photo = page.getByRole("button", {
        name: /photo 1 of 3\. Open full screen$/,
    });
    await photo.click();

    const dialog = page.getByRole("dialog", { name: /photo \d of 3$/ });
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAccessibleName(/photo 1 of 3$/);
    await expect(dialog.getByRole("button", { name: "Close" })).toBeFocused();

    await page.keyboard.press("ArrowRight");
    await expect(dialog).toHaveAccessibleName(/photo 2 of 3$/);
    await page.keyboard.press("ArrowRight");
    await expect(dialog).toHaveAccessibleName(/photo 3 of 3$/);
    await page.keyboard.press("ArrowRight"); // wraps round
    await expect(dialog).toHaveAccessibleName(/photo 1 of 3$/);
    await page.keyboard.press("ArrowLeft");
    await expect(dialog).toHaveAccessibleName(/photo 3 of 3$/);
    await page.keyboard.press("ArrowRight"); // back on photo 1

    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(photo).toBeFocused();
});

// Closing the lightbox on a different photo scrolls the gallery to it, and
// focus must follow to that visible photo (not the hidden opener).
test("after paging in the lightbox, Esc returns focus to the photo now shown", async ({
    page,
}) => {
    await page.goto(DUPATTA);
    await page
        .getByRole("button", { name: /photo 1 of 3\. Open full screen$/ })
        .click();
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toBeHidden();
    await expect(
        page.getByRole("button", { name: /photo 2 of 3\. Open full screen$/ })
    ).toBeFocused();
    const focusInHidden = await page.evaluate(
        () => !!document.activeElement?.closest("[aria-hidden='true']")
    );
    expect(focusInHidden).toBe(false);
});

test("buy buttons are real store links that open in a new tab", async ({
    page,
}) => {
    for (const path of [DUPATTA, PANTS]) {
        await page.goto(path);
        const buy = page.getByRole("link", { name: /^Buy on / });
        expect(await buy.count()).toBeGreaterThan(0);
        for (const link of await buy.all()) {
            await expect(link).toHaveAttribute(
                "href",
                /^https:\/\/(www\.flipkart\.com|www\.meesho\.com|pants\.kalaf\.in)\//
            );
            await expect(link).toHaveAttribute("target", "_blank");
            await expect(link).toHaveAttribute("rel", /\bnoopener\b/);
        }
    }
    // The dupatta is on both stores; the pants link to the owner's page.
    await page.goto(DUPATTA);
    await expect(
        page.getByRole("link", { name: /^Buy on Flipkart/ })
    ).toHaveAttribute("href", /flipkart\.com/);
    await expect(
        page.getByRole("link", { name: /^Buy on Meesho/ })
    ).toHaveAttribute("href", /meesho\.com/);
    await page.goto(PANTS);
    await expect(
        page.getByRole("link", { name: /^Buy on Flipkart/ })
    ).toHaveAttribute("href", /^https:\/\/pants\.kalaf\.in\//);
});

test("Amazon appears nowhere", async ({ page }) => {
    for (const path of ["/", "/products", DUPATTA, PANTS, "/faq"]) {
        await page.goto(path);
        await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
        const html = await page.content();
        expect(html, `Amazon on ${path}`).not.toMatch(/amazon/i);
    }
});
