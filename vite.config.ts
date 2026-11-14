import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ isSsrBuild }) => ({
    plugins: [react()],
    define: {
        // Fixed when the site is built, so the prerendered HTML and the app
        // agree on it (a live new Date() would break hydration on 1 Jan).
        __BUILD_YEAR__: JSON.stringify(new Date().getFullYear()),
    },
    build: {
        // One stylesheet, linked from every page. With per-route CSS chunks a
        // prerendered page would show unstyled until its JS chunk loaded.
        cssCodeSplit: false,
        // The SSR bundle (scripts/prerender.mjs) needs no public/ copy.
        copyPublicDir: !isSsrBuild,
    },
}));
