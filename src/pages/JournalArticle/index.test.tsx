// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";
import { ROUTES, journalPath } from "../../constants";
import { PRODUCTS } from "../../data/catalog";
import { ARTICLES } from "../Journal/articles";
import JournalArticle from ".";

afterEach(cleanup);

function renderAt(path: string) {
    return render(
        <MemoryRouter initialEntries={[path]}>
            <Routes>
                <Route
                    path={ROUTES.journalArticle}
                    element={<JournalArticle />}
                />
            </Routes>
        </MemoryRouter>
    );
}

const handles = new Set(PRODUCTS.map((p) => p.handle));

describe("JournalArticle", () => {
    it.each(ARTICLES)(
        "$slug: renders its title and real product links",
        (a) => {
            const { container } = renderAt(journalPath(a.slug));
            expect(
                screen.getByRole("heading", { level: 1, name: a.title })
            ).toBeDefined();
            expect(screen.getByText("Shop the pieces")).toBeDefined();

            const productLinks = [...container.querySelectorAll("a[href]")]
                .map((el) => new URL(el.getAttribute("href")!, "https://x"))
                .filter((u) => u.pathname.startsWith("/products/"));
            expect(productLinks.length).toBeGreaterThan(0);
            for (const u of productLinks) {
                const handle = u.pathname.split("/")[2];
                expect(handles.has(handle), u.pathname).toBe(true);
            }
            // The shop strip shows every related piece.
            for (const h of a.related) {
                expect(
                    productLinks.some((u) => u.pathname === `/products/${h}`),
                    h
                ).toBe(true);
            }
        }
    );

    it("an unknown slug shows the 404 page", () => {
        renderAt(journalPath("no-such-article"));
        expect(screen.getByRole("heading", { level: 1 }).textContent).toContain(
            "This page isn"
        );
    });
});
