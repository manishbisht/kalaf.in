// @vitest-environment jsdom
import { Suspense } from "react";
import { act, cleanup, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { isChunkLoadError, lazyWithReload } from "./lazyWithReload";

const reload = vi.fn();
const STALE = new Error(
    "Failed to fetch dynamically imported module: https://kalaf.in/assets/Faq-abc123.js"
);

beforeEach(() => {
    sessionStorage.clear();
    vi.stubGlobal("location", { ...window.location, reload });
    vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    reload.mockReset();
});

async function renderLazy(load: () => Promise<{ default: () => string }>) {
    const Page = lazyWithReload(load);
    await act(async () => {
        render(
            <MemoryRouter>
                <ErrorBoundary>
                    <Suspense fallback="loading">
                        <Page />
                    </Suspense>
                </ErrorBoundary>
            </MemoryRouter>
        );
    });
}

describe("isChunkLoadError", () => {
    it("recognises each browser's wording, and nothing else", () => {
        expect(isChunkLoadError(STALE)).toBe(true);
        expect(
            isChunkLoadError(new TypeError("Importing a module script failed."))
        ).toBe(true);
        expect(
            isChunkLoadError(
                new TypeError("error loading dynamically imported module")
            )
        ).toBe(true);
        expect(isChunkLoadError(new Error("x is undefined"))).toBe(false);
        expect(isChunkLoadError("Failed to fetch")).toBe(false);
    });
});

describe("lazyWithReload", () => {
    it("renders the page when the chunk loads", async () => {
        await renderLazy(async () => ({ default: () => "page" }));
        expect(screen.getByText("page")).toBeTruthy();
        expect(reload).not.toHaveBeenCalled();
    });

    it("reloads once on a stale chunk and keeps the fallback up", async () => {
        await renderLazy(() => Promise.reject(STALE));
        expect(reload).toHaveBeenCalledTimes(1);
        expect(screen.getByText("loading")).toBeTruthy();
    });

    it("doesn't reload twice in a session: shows the error page instead", async () => {
        sessionStorage.setItem("kalaf:chunk-reload", "1");
        await renderLazy(() => Promise.reject(STALE));
        expect(reload).not.toHaveBeenCalled();
        expect(screen.getByRole("alert").textContent).toContain(
            "Something went wrong"
        );
        expect(screen.getByRole("button", { name: "Reload" })).toBeTruthy();
    });

    it("doesn't reload for other errors", async () => {
        await renderLazy(() => Promise.reject(new Error("bug")));
        expect(reload).not.toHaveBeenCalled();
        expect(screen.getByRole("alert")).toBeTruthy();
    });

    it("doesn't reload when sessionStorage is blocked (no loop guard)", async () => {
        // Replace the global itself: on Node 22+ `sessionStorage` can be
        // Node's own Web Storage, so spying on jsdom's Storage.prototype
        // wouldn't reach the object the code calls.
        const blocked = () => {
            throw new Error("SecurityError");
        };
        vi.stubGlobal("sessionStorage", {
            getItem: blocked,
            setItem: blocked,
            removeItem: blocked,
            clear: blocked,
        });
        await renderLazy(() => Promise.reject(STALE));
        expect(reload).not.toHaveBeenCalled();
        expect(screen.getByRole("alert")).toBeTruthy();
    });

    it("clears the flag once a chunk loads", async () => {
        sessionStorage.setItem("kalaf:chunk-reload", "1");
        await renderLazy(async () => ({ default: () => "page" }));
        expect(sessionStorage.getItem("kalaf:chunk-reload")).toBeNull();
    });
});
