// Smoke test for the built site (`yarn build`, which ends with
// scripts/prerender.mjs). A plain `yarn test` skips it until dist/ exists;
// CI runs it after the build with `yarn test:dist`, which sets REQUIRE_DIST
// so a missing build fails instead of skipping.

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

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

    it("404.html is noindex with no canonical", () => {
        const html = read("404.html");
        expect(html).toContain(
            '<meta data-seo name="robots" content="noindex" />'
        );
        expect(html).not.toContain('rel="canonical"');
        expect(html).toContain('<div id="root"></div>');
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
