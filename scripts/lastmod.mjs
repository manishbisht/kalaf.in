// Sitemap <lastmod> per page: the date of the last commit that touched the
// files the page is built from (its page folder plus the data it shows).
// Shared chrome (Nav, Footer) is left out on purpose: a footer tweak isn't a
// reason for Google to recrawl every page.
//
// Used by scripts/prerender.mjs. Needs the git history, so the deploy job
// checks out with fetch-depth: 0; with no history (or no git) it falls back
// to the build date.

import { execFileSync } from "node:child_process";

const CATALOG = "src/data/catalog.json";
const BUSINESS = "src/data/business.json";

const HOME = [
    "src/pages/Home",
    "src/components/Hero",
    "src/components/Drop",
    "src/components/Process",
    "src/components/WhyKalaf",
    "src/components/Lookbook",
    "src/components/Newsletter",
    CATALOG,
];

// Policy and guide pages: route → page folder (+ data where the page shows it).
const STATIC = {
    "/shipping-returns": ["src/pages/ShippingReturns", CATALOG],
    "/privacy": ["src/pages/Privacy"],
    "/terms": ["src/pages/Terms"],
    "/refund-policy": ["src/pages/RefundPolicy"],
    "/cookies": ["src/pages/CookiePolicy"],
    "/size-guide": ["src/pages/SizeGuide", CATALOG],
    "/care-guide": ["src/pages/CareGuide", CATALOG],
    "/track-order": ["src/pages/TrackOrder"],
    "/contact": ["src/pages/Contact", BUSINESS],
    "/faq": ["src/pages/Faq", CATALOG, BUSINESS],
    "/links": ["src/pages/Links", CATALOG],
};

/** The source files and folders a page is built from, or null if unknown. */
export function sourcesFor(path) {
    if (path === "/") return HOME;
    if (STATIC[path]) return STATIC[path];
    if (path === "/products" || path.startsWith("/collections/")) {
        return ["src/pages/Shop", CATALOG];
    }
    if (path.startsWith("/products/")) return ["src/pages/Product", CATALOG];
    if (path === "/journal") return ["src/pages/Journal"];
    if (path.startsWith("/journal/")) {
        return ["src/pages/JournalArticle", "src/pages/Journal/articles.ts"];
    }
    return null;
}

/** Returns lastmodFor(path) → "YYYY-MM-DD", caching git lookups. */
export function makeLastmod({ cwd, today, git = runGit }) {
    const cache = new Map();
    return (path) => {
        const files = sourcesFor(path);
        if (!files) return today;
        const key = files.join("\n");
        if (!cache.has(key)) {
            let date = today;
            try {
                // Uncommitted edits (a local build) count as changed today.
                const dirty = git(cwd, [
                    "status",
                    "--porcelain",
                    "--",
                    ...files,
                ]);
                const last = git(cwd, [
                    "log",
                    "-1",
                    "--format=%cs",
                    "--",
                    ...files,
                ]);
                if (!dirty && /^\d{4}-\d{2}-\d{2}$/.test(last)) date = last;
            } catch {
                // No git or no history: the build date is a safe default.
            }
            cache.set(key, date);
        }
        return cache.get(key);
    };
}

function runGit(cwd, args) {
    return execFileSync("git", args, {
        cwd,
        encoding: "utf8",
        stdio: ["ignore", "pipe", "ignore"],
    }).trim();
}
