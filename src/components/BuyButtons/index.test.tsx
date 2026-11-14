// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { PRODUCTS, SOLD_ON } from "../../data/catalog";
import { BuyButtons } from ".";
import { trackBuyClick } from "../../analytics";

vi.mock("../../analytics", async (importOriginal) => ({
    ...(await importOriginal<typeof import("../../analytics")>()),
    trackBuyClick: vi.fn(),
}));

afterEach(() => {
    cleanup();
    vi.mocked(trackBuyClick).mockReset();
});

const links = () => screen.queryAllByRole("link");

describe("BuyButtons", () => {
    it("renders one link per store with a URL, first one primary", () => {
        render(
            <BuyButtons
                links={{
                    flipkart: "https://www.flipkart.com/x",
                    meesho: "https://www.meesho.com/y",
                }}
            />
        );
        expect(links().map((a) => a.textContent?.trim())).toEqual([
            "Buy on Flipkart",
            "Buy on Meesho",
        ]);
        const [fk, me] = links();
        expect(fk.getAttribute("href")).toBe("https://www.flipkart.com/x");
        expect(fk.className).toContain("btn-primary");
        expect(me.className).toContain("btn-secondary");
        for (const a of links()) {
            expect(a.getAttribute("target")).toBe("_blank");
            expect(a.getAttribute("rel")).toBe("noopener noreferrer");
        }
    });

    it("shows a store Kalaf sells on elsewhere as coming soon, not as a link", () => {
        expect(SOLD_ON).toContain("meesho");
        render(
            <BuyButtons links={{ flipkart: "https://www.flipkart.com/x" }} />
        );
        expect(links()).toHaveLength(1);
        const soon = screen.getByText("Meesho — coming soon");
        expect(soon.tagName).toBe("SPAN");
        expect(soon.getAttribute("aria-disabled")).toBe("true");
    });

    it("leaves out a store nothing is live on (Amazon) entirely", () => {
        expect(SOLD_ON).not.toContain("amazon");
        render(
            <BuyButtons links={{ flipkart: "https://www.flipkart.com/x" }} />
        );
        expect(screen.queryByText(/Amazon/)).toBeNull();
    });

    it("ignores empty link values", () => {
        render(
            <BuyButtons
                links={{ flipkart: "https://www.flipkart.com/x", meesho: "" }}
            />
        );
        expect(links()).toHaveLength(1);
        expect(screen.getByText("Meesho — coming soon")).toBeTruthy();
    });

    it("prints per-store prices only when they differ", () => {
        const { rerender } = render(
            <BuyButtons
                links={{ flipkart: "https://f/", meesho: "https://m/" }}
                prices={{ flipkart: 949, meesho: 1000 }}
            />
        );
        expect(links()[0].textContent).toContain("₹949");
        expect(links()[1].textContent).toContain("₹1,000");

        rerender(
            <BuyButtons
                links={{ flipkart: "https://f/", meesho: "https://m/" }}
                prices={{ flipkart: 1000, meesho: 1000 }}
            />
        );
        expect(links()[0].textContent).not.toContain("₹");
    });

    it("tracks the click without blocking the link", () => {
        render(
            <BuyButtons
                links={{ flipkart: "https://f/", meesho: "https://m/" }}
                sku="DUA_BK"
            />
        );
        const notCancelled = fireEvent.click(links()[1]);
        expect(notCancelled).toBe(true);
        expect(trackBuyClick).toHaveBeenCalledWith("meesho", "DUA_BK");

        fireEvent(
            links()[0],
            new MouseEvent("auxclick", { bubbles: true, button: 1 })
        );
        expect(trackBuyClick).toHaveBeenLastCalledWith("flipkart", "DUA_BK");
    });

    it("renders the real catalog links for every variant", () => {
        for (const p of PRODUCTS) {
            for (const v of p.variants) {
                const { unmount } = render(
                    <BuyButtons links={v.links} prices={v.prices} />
                );
                const live = Object.values(v.links).filter(Boolean);
                expect(
                    links().map((a) => a.getAttribute("href")),
                    v.sku
                ).toEqual(live);
                unmount();
            }
        }
    });
});
