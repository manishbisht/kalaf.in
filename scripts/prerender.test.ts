// Smoke test for the built site (`yarn build`, which ends with
// scripts/prerender.mjs). A plain `yarn test` skips it until dist/ exists;
// CI runs it after the build with `yarn test:dist`, which sets REQUIRE_DIST
// so a missing build fails instead of skipping.

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { ARTICLES } from "../src/pages/Journal/articles";

const root = join(import.meta.dirname, "..");
const dist = join(root, "dist");
const built = existsSync(join(dist, "index.html"));
const required = process.env.REQUIRE_DIST === "1";

type Catalog = {
    products: {
        handle: string;
        title: string;
        variants: { sku: string }[];
    }[];
};

const read = (file: string) => readFileSync(join(dist, file), "utf8");

// "/" → index.html; "/privacy" → privacy.html and privacy/index.html.
const filesFor = (path: string) =>
    path === "/"
        ? ["index.html"]
        : [`${path.slice(1)}.html`, `${path.slice(1)}/index.html`];

const htmlEscape = (s: string) =>
    s
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");

function jsonLd(html: string) {
    const m = html.match(
        /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/
    );
    if (!m) return null;
    const data = JSON.parse(m[1]) as unknown;
    return (Array.isArray(data) ? data : [data]) as Record<string, unknown>[];
}

describe.skipIf(!built && !required)("prerendered dist/", () => {
    const catalog = JSON.parse(
        readFileSync(join(root, "src/data/catalog.json"), "utf8")
    ) as Catalog;
    const sitemap = existsSync(join(dist, "sitemap.xml"))
        ? read("sitemap.xml")
        : "";
    const paths = [
        ...sitemap.matchAll(/<loc>https:\/\/kalaf\.in([^<]*)<\/loc>/g),
    ].map((m) => m[1] || "/");

    it("sitemap.xml lists the home page and every product", () => {
        expect(paths).toContain("/");
        for (const p of catalog.products) {
            expect(paths).toContain(`/products/${p.handle}`);
        }
    });

    it("every sitemap URL has a prerendered file with content", () => {
        for (const path of paths) {
            for (const file of filesFor(path)) {
                expect(existsSync(join(dist, file)), file).toBe(true);
                const html = read(file);
                expect(html, file).toContain(`data-path="${path}"`);
                expect(html, file).toMatch(/<title data-seo>[^<]+<\/title>/);
                expect(html, file).toContain(
                    `<link data-seo rel="canonical" href="https://kalaf.in${path}" />`
                );
                expect(html, file).not.toContain('content="noindex"');
            }
        }
    });

    it("each product page has its title and a ProductGroup with every colour", () => {
        for (const p of catalog.products) {
            const html = read(`products/${p.handle}.html`);
            expect(html).toContain(
                `<title data-seo>${htmlEscape(p.title)} · Kalaf</title>`
            );
            const ld = jsonLd(html);
            expect(ld, p.handle).not.toBeNull();
            const group = ld!.find((x) => x["@type"] === "ProductGroup");
            const variants = (group?.hasVariant ?? []) as {
                sku: string;
                offers: unknown[];
            }[];
            expect(variants.map((v) => v.sku).sort(), p.handle).toEqual(
                p.variants.map((v) => v.sku).sort()
            );
            for (const v of variants) {
                expect(v.offers.length, v.sku).toBeGreaterThan(0);
            }
        }
    });

    it("each journal article is prerendered with Article JSON-LD and only real product links", () => {
        const handles = new Set(catalog.products.map((p) => p.handle));
        expect(paths).toContain("/journal");
        for (const a of ARTICLES) {
            const path = `/journal/${a.slug}`;
            expect(paths, path).toContain(path);
            const html = read(`journal/${a.slug}.html`);
            expect(html).toContain(
                `<title data-seo>${htmlEscape(a.title)} · Kalaf</title>`
            );
            const article = jsonLd(html)?.find((x) => x["@type"] === "Article");
            expect(article?.headline, path).toBe(a.title);
            expect(article?.datePublished, path).toBe(a.datePublished);

            const linked = [
                ...html.matchAll(/href="\/products\/([^"?/]+)[^"]*"/g),
            ].map((m) => m[1]);
            expect(linked.length, path).toBeGreaterThan(0);
            for (const h of linked) expect(handles.has(h), h).toBe(true);
        }
    });

    it("faq.html has FAQPage JSON-LD and the questions in its body", () => {
        const html = read("faq.html");
        const faq = jsonLd(html)?.find((x) => x["@type"] === "FAQPage");
        const questions = (faq?.mainEntity ?? []) as {
            name: string;
            acceptedAnswer: { text: string };
        }[];
        expect(questions.length).toBeGreaterThan(0);
        for (const q of questions) {
            expect(q.acceptedAnswer.text.length).toBeGreaterThan(0);
            expect(html).toContain(htmlEscape(q.name).replace(/'/g, "&#x27;"));
        }
    });

    it("/links is prerendered and indexable but left out of the sitemap", () => {
        expect(paths).not.toContain("/links");
        for (const file of filesFor("/links")) {
            const html = read(file);
            expect(html, file).toContain('data-path="/links"');
            expect(html, file).toContain(
                "<title data-seo>Kalaf — links</title>"
            );
            expect(html, file).toContain(
                '<link data-seo rel="canonical" href="https://kalaf.in/links" />'
            );
            expect(html, file).not.toContain('content="noindex"');
        }
    });

    it("old product handles redirect to the current URL instead of 404ing", () => {
        const html = read("products/cotton-linen-relaxed-trousers.html");
        expect(html).toContain(
            '<link rel="canonical" href="https://kalaf.in/products/cotton-relaxed-trousers" />'
        );
        expect(html).toContain(
            'content="0; url=/products/cotton-relaxed-trousers"'
        );
        expect(html).toContain("location.search");
    });

    it("404.html is noindex with no canonical", () => {
        const html = read("404.html");
        expect(html).toContain(
            '<meta data-seo name="robots" content="noindex" />'
        );
        expect(html).not.toContain('rel="canonical"');
        expect(html).toContain('<div id="root"></div>');
    });

    it("every page is en-IN with a skip link first, one <main id=main> and one h1", () => {
        for (const path of paths) {
            const html = read(filesFor(path)[0]);
            expect(html, path).toContain('<html lang="en-IN">');
            const body = html.slice(html.indexOf('<div id="root"'));
            // The skip link is the first link or button on the page.
            const firstControl = body.match(/<(a|button)\b[^>]*>/)?.[0];
            expect(firstControl, path).toContain('href="#main"');
            expect(body.match(/<main\b/g), path).toHaveLength(1);
            expect(body, path).toContain('<main id="main" tabindex="-1">');
            expect(body.match(/<h1\b/g), path).toHaveLength(1);
            // The page is inline in <main>, not a fallback swapped later.
            expect(body, path).not.toContain("<!--$?-->");
            expect(body, path).not.toContain("$RC(");
        }
    });

    it("llms.txt mentions every product title", () => {
        const txt = read("llms.txt");
        for (const p of catalog.products) expect(txt).toContain(p.title);
    });

    it("robots.txt points at the sitemap", () => {
        expect(read("robots.txt")).toContain(
            "Sitemap: https://kalaf.in/sitemap.xml"
        );
    });

    it("every /assets/ file the pages load exists", () => {
        const html = read("index.html");
        const assets = [
            ...html.matchAll(/(?:src|href)="(\/assets\/[^"]+)"/g),
        ].map((m) => m[1]);
        expect(assets.length).toBeGreaterThan(0);
        for (const a of assets) expect(existsSync(join(dist, a)), a).toBe(true);
    });
});
