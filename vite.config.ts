import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

// Content Security Policy for the built site: the only places the pages may
// load code, styles, fonts and images from. GitHub Pages can't send headers,
// so it goes in a <meta> tag (which can't set frame-ancestors or reporting).
//
// - script: our own bundle; Microsoft Clarity's loader and script; and the
//   one inline handler, `onload="this.media='all'"` on the two font
//   stylesheets in index.html, allowed by its hash. Change that handler and
//   the hash must change too (scripts/README.md → CSP shows how).
// - style: our stylesheet, Google Fonts and Fontshare CSS, plus inline style
//   attributes (React sets a few, e.g. swatch colours).
// - img / connect: Clarity sends its data to *.clarity.ms and c.bing.com.
// JSON-LD <script type="application/ld+json"> blocks aren't run, so CSP
// doesn't apply to them.
export const CSP = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-hashes' 'sha256-MhtPZXr7+LpJUY5qtMutB+qWfQtMaPccfe7QXtCcEYc=' https://www.clarity.ms https://scripts.clarity.ms",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://api.fontshare.com",
    "font-src 'self' https://fonts.gstatic.com https://cdn.fontshare.com",
    "img-src 'self' data: https://*.clarity.ms https://c.bing.com",
    "connect-src 'self' https://*.clarity.ms https://c.bing.com",
    "media-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "upgrade-insecure-requests",
].join("; ");

// Build only: the dev server injects inline scripts (React Refresh) that
// this policy would block.
function contentSecurityPolicy(): Plugin {
    return {
        name: "kalaf-csp",
        apply: "build",
        // Right after the charset and viewport tags (charset must stay in
        // the first 1024 bytes) and before the font stylesheets it governs.
        transformIndexHtml: (html) => {
            const anchor = /<meta name="viewport"[^>]*>/;
            if (!anchor.test(html)) {
                throw new Error("kalaf-csp: no viewport meta in index.html");
            }
            const attr = CSP.replace(/'/g, "&#39;");
            return html.replace(
                anchor,
                (m) =>
                    `${m}\n        <meta http-equiv="Content-Security-Policy" content="${attr}" />`
            );
        },
    };
}

export default defineConfig(({ isSsrBuild }) => ({
    plugins: [react(), contentSecurityPolicy()],
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
