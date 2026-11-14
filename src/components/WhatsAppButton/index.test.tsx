// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";
import { BRAND, productPath } from "../../constants";
import { PRODUCTS } from "../../data/catalog";
import { WhatsAppButton } from ".";

afterEach(cleanup);

function hrefAt(path: string) {
    render(
        <MemoryRouter initialEntries={[path]}>
            <WhatsAppButton />
        </MemoryRouter>
    );
    const link = screen.getByRole("link", {
        name: "Chat with Kalaf on WhatsApp",
    });
    return new URL(link.getAttribute("href")!);
}

const number = BRAND.whatsapp!.replace(/\D/g, "");
const multi = PRODUCTS.find((p) => p.variants.length > 1)!;

describe("WhatsAppButton", () => {
    it("opens a wa.me chat with a generic greeting off product pages", () => {
        const url = hrefAt("/privacy");
        expect(url.origin).toBe("https://wa.me");
        expect(url.pathname).toBe(`/${number}`);
        expect(url.searchParams.get("text")).toBe(
            "Hi Kalaf! I have a question."
        );
    });

    it("names the product, colour and public URL on a product page", () => {
        const v = multi.variants[1];
        const path = productPath(multi.handle, v.colourCode);
        const text = hrefAt(path).searchParams.get("text")!;
        expect(text).toContain(multi.title);
        expect(text).toContain(`(${v.colour})`);
        expect(text).toContain(`https://kalaf.in${path}`);
        expect(text).not.toContain("localhost");
    });

    it("defaults to the first colour without ?colour=", () => {
        const text = hrefAt(productPath(multi.handle)).searchParams.get(
            "text"
        )!;
        expect(text).toContain(`(${multi.variants[0].colour})`);
    });

    it("works for an old product handle", () => {
        const text = hrefAt(
            "/products/cotton-linen-relaxed-trousers"
        ).searchParams.get("text")!;
        expect(text).toContain("Cotton Relaxed Trousers");
    });
});
