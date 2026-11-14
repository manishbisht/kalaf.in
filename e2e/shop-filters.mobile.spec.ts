// On phones the shop's filter sidebar is a full-screen drawer (Shop/index.tsx).
// Runs only in the mobile project (see playwright.config.ts).
import { expect, test } from "./fixtures";

test("the filter drawer fills the screen, scrolls, traps Tab, filters and closes on Esc", async ({
    page,
}) => {
    await page.goto("/products");
    const toggle = page.getByRole("button", { name: /^Filter/ });
    const drawer = page.getByRole("dialog", { name: "Filters" });
    const cards = page.locator("main section a[href^='/products/']");
    const before = await cards.count();
    expect(before).toBeGreaterThan(1);

    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    const done = drawer.getByRole("button", { name: /^Show \d+ products?$/ });
    await expect(done).toBeFocused();

    // Fills the viewport once its slide-in transition ends.
    const viewport = page.viewportSize()!;
    await expect
        .poll(async () => {
            const box = await drawer.boundingBox();
            return box && [box.x, box.y, box.width, box.height].map(Math.round);
        })
        .toEqual([0, 0, viewport.width, viewport.height]);

    // Its content is taller than the screen, and it scrolls on its own.
    const scrolled = await drawer.evaluate((el) => {
        el.scrollTop = 200;
        return { tall: el.scrollHeight > el.clientHeight, top: el.scrollTop };
    });
    expect(scrolled.tall).toBe(true);
    expect(scrolled.top).toBeGreaterThan(0);
    await drawer.evaluate((el) => (el.scrollTop = 0));

    // Tab never reaches anything behind the drawer. Past its last control,
    // focus may leave for the browser's own UI (document.body here), which
    // is fine for a modal; it must not land on the page underneath.
    const focusables = await drawer
        .locator("button, input, select, a[href]")
        .count();
    let inDrawer = 0;
    for (let i = 0; i < focusables + 3; i++) {
        await page.keyboard.press("Tab");
        const where = await page.evaluate(() => {
            const el = document.activeElement;
            if (!el || el === document.body) return "body";
            return el.closest("#shop-filters") ? "drawer" : el.outerHTML;
        });
        expect(["drawer", "body"]).toContain(where);
        if (where === "drawer") inDrawer++;
    }
    expect(inDrawer).toBeGreaterThanOrEqual(focusables);

    // Ticking a colour filters the grid and records it in the URL.
    // click(), not check(): the box is controlled by the URL, which React
    // Router updates in a transition, so it reads as ticked a beat later.
    const red = drawer.getByRole("checkbox", { name: /^Red\b/ });
    await red.click();
    await expect(red).toBeChecked();
    await expect(page).toHaveURL(/[?&]colour=Red(&|$)/);
    const shown = Number(
        (await done.textContent())?.match(/\d+/)?.[0] ?? Number.NaN
    );
    expect(shown).toBeGreaterThan(0);
    expect(shown).toBeLessThan(before);
    await expect(cards).toHaveCount(shown);

    // Esc closes it and hands focus back to the Filter button.
    await page.keyboard.press("Escape");
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await expect(toggle).toBeFocused();
    await expect(toggle).toContainText("1");
});
