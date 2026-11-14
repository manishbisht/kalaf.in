import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { matchPath } from "react-router-dom";
import { ROUTES, journalPath } from "../../constants";
import { COLLECTIONS, PRODUCTS } from "../../data/catalog";
import {
    ARTICLES,
    articleLinks,
    articleText,
    heroImage,
    parseLinks,
    wordCount,
} from "./articles";

const publicDir = join(import.meta.dirname, "../../../public");
const handles = new Set(PRODUCTS.map((p) => p.handle));
const slugs = new Set(ARTICLES.map((a) => a.slug));

// The static routes an article may link to.
const STATIC = new Set<string>(
    Object.values(ROUTES).filter((r) => !r.includes(":"))
);

function linkTargetExists(path: string) {
    if (STATIC.has(path)) return true;
    const product = matchPath(ROUTES.product, path);
    if (product) return handles.has(product.params.handle!);
    const collection = matchPath(ROUTES.collection, path);
    if (collection) return collection.params.handle! in COLLECTIONS;
    const article = matchPath(ROUTES.journalArticle, path);
    if (article) return slugs.has(article.params.slug!);
    return false;
}

describe("journal articles", () => {
    it("have unique, URL-safe slugs", () => {
        expect(slugs.size).toBe(ARTICLES.length);
        for (const a of ARTICLES) expect(a.slug).toMatch(/^[a-z0-9-]+$/);
    });

    it.each(ARTICLES)(
        "$slug: related handles all exist in the catalog",
        (a) => {
            expect(a.related.length).toBeGreaterThan(0);
            for (const h of a.related) expect(handles.has(h), h).toBe(true);
        }
    );

    it.each(ARTICLES)("$slug: hero photo is a real catalog image", (a) => {
        const img = heroImage(a);
        expect(img, a.slug).not.toBeNull();
        expect(existsSync(join(publicDir, img!.src)), img!.src).toBe(true);
        expect(existsSync(join(publicDir, img!.srcLarge)), img!.srcLarge).toBe(
            true
        );
    });

    it.each(ARTICLES)("$slug: every inline link goes somewhere real", (a) => {
        const links = articleLinks(a);
        expect(links.length).toBeGreaterThan(0);
        for (const to of links) {
            expect(to.startsWith("/"), to).toBe(true);
            expect(linkTargetExists(to), to).toBe(true);
            expect(to).not.toBe(journalPath(a.slug));
        }
    });

    it.each(ARTICLES)("$slug: 400–700 words, no stray link syntax", (a) => {
        const n = wordCount(a);
        expect(n).toBeGreaterThanOrEqual(400);
        expect(n).toBeLessThanOrEqual(700);
        for (const t of articleText(a)) {
            const plain = parseLinks(t)
                .filter((p) => typeof p === "string")
                .join("");
            expect(plain, t).not.toMatch(/\]\(|\[[^\]]*\]/);
            // Catalog-derived values must have resolved.
            expect(t, t).not.toMatch(/undefined|NaN|\[\]\(/);
        }
    });

    it.each(ARTICLES)(
        "$slug: no Amazon, ISO date matches the shown date",
        (a) => {
            expect(JSON.stringify(a)).not.toMatch(/amazon/i);
            const shown = new Date(`${a.date} UTC`).toISOString().slice(0, 10);
            expect(shown).toBe(a.datePublished);
            expect(a.description.length).toBeLessThanOrEqual(160);
        }
    );

    it("parseLinks splits text and links", () => {
        expect(parseLinks("See [the guide](/care-guide) now.")).toEqual([
            "See ",
            { label: "the guide", to: "/care-guide" },
            " now.",
        ]);
        expect(parseLinks("plain")).toEqual(["plain"]);
    });
});
