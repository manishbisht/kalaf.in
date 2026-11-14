// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";
import { Lookbook } from ".";

afterEach(cleanup);

describe("Lookbook", () => {
    it("names each link once: by its visible label, with a decorative photo", () => {
        const { container } = render(
            <MemoryRouter>
                <Lookbook />
            </MemoryRouter>
        );
        const links = screen.getAllByRole("link");
        expect(links.length).toBeGreaterThan(0);
        for (const link of links) {
            const img = link.querySelector("img")!;
            expect(img.getAttribute("alt")).toBe("");
            // The accessible name is the label text, not repeated by the alt.
            const name = link.textContent!.trim();
            expect(name).toMatch(/—/);
            expect(screen.getByRole("link", { name })).toBe(link);
        }
        expect(
            container.querySelectorAll("img[alt]:not([alt=''])")
        ).toHaveLength(0);
    });
});
