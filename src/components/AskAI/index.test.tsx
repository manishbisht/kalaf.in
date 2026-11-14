// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import { trackAskAIClick } from "../../analytics";
import { AskAI } from ".";

vi.mock("../../analytics", async (importOriginal) => ({
    ...(await importOriginal<typeof import("../../analytics")>()),
    trackAskAIClick: vi.fn(),
}));

afterEach(cleanup);

describe("AskAI", () => {
    it("tracks which assistant was clicked without blocking the link", () => {
        render(
            <MemoryRouter initialEntries={["/"]}>
                <AskAI />
            </MemoryRouter>
        );
        const claude = screen.getByRole("link", { name: /Claude/ });
        expect(claude.getAttribute("href")).toMatch(/^https:\/\/claude\.ai\//);
        expect(fireEvent.click(claude)).toBe(true);
        expect(trackAskAIClick).toHaveBeenCalledWith("Claude");

        fireEvent(
            screen.getByRole("link", { name: /Perplexity/ }),
            new MouseEvent("auxclick", { bubbles: true, button: 1 })
        );
        expect(trackAskAIClick).toHaveBeenLastCalledWith("Perplexity");
    });
});
