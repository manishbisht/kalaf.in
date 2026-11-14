// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
    BRAND,
    ROUTES,
    SOCIAL,
    collectionPath,
    whatsappHref,
} from "../../constants";
import { PRODUCTS } from "../../data/catalog";
import { trackLinksClick } from "../../analytics";
import Links from ".";

vi.mock("../../analytics", async (importOriginal) => ({
    ...(await importOriginal<typeof import("../../analytics")>()),
    trackLinksClick: vi.fn(),
}));

afterEach(() => {
    cleanup();
    vi.mocked(trackLinksClick).mockReset();
});

const pantFlipkart = PRODUCTS.find((p) => p.code === "PNT")!.variants.find(
    (v) => v.links.flipkart
)!.links.flipkart!;

function renderPage() {
    render(
        <MemoryRouter initialEntries={[ROUTES.links]}>
            <Links />
        </MemoryRouter>
    );
}

const link = (name: RegExp) => screen.getByRole("link", { name });

describe("Links page", () => {
    it("shows the wordmark and every button, pant on Flipkart first", () => {
        renderPage();
        expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(
            BRAND.wordmark
        );
        const hrefs = screen
            .getAllByRole("link")
            .map((a) => a.getAttribute("href"));
        expect(hrefs).toEqual([
            pantFlipkart,
            collectionPath("dupattas"),
            ROUTES.products,
            whatsappHref(BRAND.whatsapp!),
            SOCIAL.instagram,
            `mailto:${BRAND.email}`,
        ]);
        expect(link(/Shop pants on Flipkart/).className).toContain(
            "btn-primary"
        );
        expect(screen.queryByText(/Amazon/)).toBeNull();
    });

    it("opens external links in a new tab", () => {
        renderPage();
        for (const name of [/Flipkart/, /WhatsApp/, /Instagram/]) {
            expect(link(name).getAttribute("target")).toBe("_blank");
            expect(link(name).getAttribute("rel")).toBe("noopener noreferrer");
        }
        expect(link(/Shop dupattas/).getAttribute("target")).toBeNull();
    });

    it("tracks each click with its target, without blocking it", () => {
        renderPage();
        expect(fireEvent.click(link(/Shop pants on Flipkart/))).toBe(true);
        expect(trackLinksClick).toHaveBeenLastCalledWith("pants_flipkart");
        fireEvent.click(link(/WhatsApp/));
        expect(trackLinksClick).toHaveBeenLastCalledWith("whatsapp");
        fireEvent.click(link(/Instagram/));
        expect(trackLinksClick).toHaveBeenLastCalledWith("instagram");
        fireEvent.click(link(new RegExp(BRAND.email)));
        expect(trackLinksClick).toHaveBeenLastCalledWith("email");
        fireEvent.click(link(/Shop dupattas/));
        expect(trackLinksClick).toHaveBeenLastCalledWith("dupattas");
    });
});
