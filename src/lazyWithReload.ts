import { lazy, type ComponentType } from "react";

// Every deploy renames the page chunks (their names carry a content hash). A
// visitor whose tab is still on the old build then fails to load the next
// page's chunk ("Failed to fetch dynamically imported module") and would see a
// blank page. lazyWithReload() catches that and reloads the page once, which
// fetches the new build. A sessionStorage flag stops it reloading in a loop if
// the chunk is really missing; then the error reaches the ErrorBoundary.

const FLAG = "kalaf:chunk-reload";

// Chrome, Firefox and Safari word it differently; Vite's CSS preload helper
// throws "Unable to preload CSS".
const CHUNK_ERROR =
    /dynamically imported module|Importing a module script failed|Unable to preload CSS|ChunkLoadError/i;

export function isChunkLoadError(error: unknown) {
    return error instanceof Error && CHUNK_ERROR.test(error.message);
}

/** Returns true if it started a reload, false if it already tried (or can't
 *  tell, because sessionStorage is blocked). */
export function reloadOnce(): boolean {
    try {
        if (sessionStorage.getItem(FLAG)) return false;
        sessionStorage.setItem(FLAG, "1");
    } catch {
        // No storage, no loop guard: don't risk a reload loop.
        return false;
    }
    window.location.reload();
    return true;
}

function clearFlag() {
    try {
        sessionStorage.removeItem(FLAG);
    } catch {
        // Nothing to clear.
    }
}

// Same type parameter as React's own lazy().
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function lazyWithReload<T extends ComponentType<any>>(
    load: () => Promise<{ default: T }>
) {
    return lazy(() =>
        load().then(
            (module) => {
                // A chunk loaded, so the build is current: allow a reload
                // again the next time a deploy lands while the tab is open.
                if (typeof window !== "undefined") clearFlag();
                return module;
            },
            (error: unknown) => {
                if (
                    typeof window !== "undefined" &&
                    isChunkLoadError(error) &&
                    reloadOnce()
                ) {
                    // Keep showing the Suspense fallback until the reload.
                    return new Promise<never>(() => {});
                }
                throw error;
            }
        )
    );
}
