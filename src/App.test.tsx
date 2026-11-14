// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";
import { Shell } from "./App";

afterEach(cleanup);

function renderShell(path: string) {
    return render(
        <MemoryRouter initialEntries={[path]}>
            <Shell seo={false} />
        </MemoryRouter>
    );
}

describe("Shell", () => {
    it("puts a skip link to <main id=main> before everything else", () => {
        const { container } = renderShell("/privacy");
        const first = container.querySelector("a, button");
        expect(first?.textContent).toBe("Skip to content");
        expect(first?.getAttribute("href")).toBe("#main");

        const mains = container.querySelectorAll("main");
        expect(mains).toHaveLength(1);
        expect(mains[0].id).toBe("main");
        // Focusable by script, so the skip link moves focus there.
        expect(mains[0].getAttribute("tabindex")).toBe("-1");
    });

    it("labels the main, footer and chat landmarks", () => {
        renderShell("/");
        expect(screen.getByRole("navigation", { name: "Main" })).toBeTruthy();
        expect(screen.getByRole("navigation", { name: "Footer" })).toBeTruthy();
        expect(
            screen.getByRole("complementary", { name: "WhatsApp chat" })
        ).toBeTruthy();
    });
});
