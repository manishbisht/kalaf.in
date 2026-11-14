// Links from before the move to real paths keep working: HashRouter links
// (/#/products/…) are rewritten by main.tsx, and old product handles get a
// redirect page from the prerender (OLD_HANDLES in src/data/catalog.ts).
import { DUPATTA, expect, test } from "./fixtures";

test("an old hash link lands on the real product URL with its colour", async ({
    page,
}) => {
    await page.goto(`/#${DUPATTA}?colour=RED`);
    await expect(page).toHaveURL(`${DUPATTA}?colour=RED`);
    await expect(
        page.getByRole("heading", { level: 1, name: "Bandhani Dupatta" })
    ).toBeVisible();
    await expect(page.getByText("Colour — Red")).toBeVisible();
    await expect(
        page.getByRole("button", { name: "Red", exact: true })
    ).toHaveAttribute("aria-pressed", "true");
});

test("the old cotton-linen trousers handle redirects to the cotton trousers in Black", async ({
    page,
}) => {
    await page.goto("/products/cotton-linen-relaxed-trousers?colour=BK");
    await expect(page).toHaveURL("/products/cotton-relaxed-trousers?colour=BK");
    await expect(
        page.getByRole("heading", {
            level: 1,
            name: "Cotton Relaxed Trousers",
        })
    ).toBeVisible();
    await expect(
        page.getByRole("button", { name: "Black", exact: true })
    ).toHaveAttribute("aria-pressed", "true");
});
