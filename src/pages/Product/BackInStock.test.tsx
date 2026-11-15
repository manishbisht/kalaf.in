// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { BRAND } from "../../constants";
import { PRODUCTS } from "../../data/catalog";
import { trackRestockClick } from "../../analytics";
import { BackInStock } from "./BackInStock";

vi.mock("../../analytics", async (importOriginal) => ({
    ...(await importOriginal<typeof import("../../analytics")>()),
    trackRestockClick: vi.fn(),
}));

afterEach(() => {
    cleanup();
    vi.mocked(trackRestockClick).mockReset();
});

const product = PRODUCTS.find((p) => p.variants.length > 1)!;
const variant = { ...product.variants[1], stock: 0 };

describe("BackInStock", () => {
    it("links to a WhatsApp chat with that message and tracks the click", () => {
        render(<BackInStock product={product} variant={variant} />);
        const link = screen.getByRole("link", {
            name: "Tell me when it's back",
        });
        const url = new URL(link.getAttribute("href")!);
        expect(url.origin).toBe("https://wa.me");
        expect(url.pathname).toBe(`/${BRAND.whatsapp!.replace(/\D/g, "")}`);
        // The message names the piece, colour and page.
        const text = url.searchParams.get("text")!;
        expect(text).toContain(`${product.title} in ${variant.colour}`);
        expect(text).toContain("back in stock");
        expect(text).toContain(
            `https://kalaf.in/products/${product.handle}?colour=${variant.colourCode}`
        );
        expect(link.getAttribute("target")).toBe("_blank");

        fireEvent.click(link);
        expect(trackRestockClick).toHaveBeenCalledWith(variant.sku);
    });
});
