// Client-side navigation: clicking through the site never reloads the page,
// lands each page at the top, and keeps <title> and the canonical link in
// step with the URL.
import { expect, test } from "./fixtures";

test("home → shop → product → FAQ navigates in place", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    // A full page load would wipe this marker.
    await page.evaluate(() => {
        (window as unknown as { __noReload: boolean }).__noReload = true;
    });
    const marker = () =>
        page.evaluate(
            () => (window as unknown as { __noReload?: boolean }).__noReload
        );
    const canonical = page.locator("head link[rel='canonical']");
    await expect(canonical).toHaveAttribute("href", "https://kalaf.in/");

    // Home → shop, from the Nav.
    await page
        .getByRole("banner")
        .getByRole("link", { name: "Shop all" })
        .click();
    await expect(page).toHaveURL("/products");
    await expect(page).toHaveTitle(/^Shop .* · Kalaf$/);
    await expect(canonical).toHaveAttribute(
        "href",
        "https://kalaf.in/products"
    );
    await expect(canonical).toHaveCount(1);
    expect(await marker()).toBe(true);

    // Shop → a product, from the grid.
    const card = page.locator("main section a[href^='/products/']").first();
    const href = (await card.getAttribute("href"))!;
    const handle = new URL(href, "http://x").pathname;
    await card.click();
    await expect(page).toHaveURL(href);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    const productTitle = await page
        .getByRole("heading", { level: 1 })
        .innerText();
    await expect(page).toHaveTitle(
        new RegExp(`^${productTitle} — .* · Kalaf$`)
    );
    await expect(canonical).toHaveAttribute(
        "href",
        `https://kalaf.in${handle}`
    );
    expect(await marker()).toBe(true);

    // Product → FAQ, from the footer: the FAQ opens at the top.
    const faq = page
        .getByRole("contentinfo")
        .getByRole("link", { name: "FAQ" });
    await faq.scrollIntoViewIfNeeded();
    expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
    await faq.click();
    await expect(page).toHaveURL("/faq");
    await expect(page).toHaveTitle(/^FAQ · Kalaf$/);
    await expect(canonical).toHaveAttribute("href", "https://kalaf.in/faq");
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
    expect(await marker()).toBe(true);
});
