import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ isSsrBuild }) => ({
    plugins: [react()],
    build: {
        // One stylesheet, linked from every page. With per-route CSS chunks a
        // prerendered page would show unstyled until its JS chunk loaded.
        cssCodeSplit: false,
        // The SSR bundle (scripts/prerender.mjs) needs no public/ copy.
        copyPublicDir: !isSsrBuild,
    },
}));
