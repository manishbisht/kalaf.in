import { describe, expect, it } from "vitest";
import {
    COLLECTIONS,
    PRODUCTS,
    findProduct,
    type Variant,
} from "../data/catalog";
import { BUSINESS } from "../data/business";
import { ROUTES, collectionPath, productPath } from "../constants";
import {
    SITE_URL,
    headHtml,
    jsonLdText,
    llmsTxt,
    prerenderPaths,
    seoFor,
    sitemapXml,
} from ".";

type Json = Record<string, unknown>;
type Offer = {
    "@type": string;
    url: string;
    priceCurrency: string;
    price: string;
};

const ofType = (ld: Json[], type: string) =>
    ld.find((x) => x["@type"] === type) as Json | undefined;

function expectCommon(seo: ReturnType<typeof seoFor>, path: string) {
    expect(seo.canonical).toBe(`${SITE_URL}${path}`);
    expect(seo.canonical).not.toContain("?");
    expect(seo.image).toMatch(/^https:\/\/kalaf\.in\//);
    expect(seo.title.length).toBeGreaterThan(0);
    expect(seo.description.length).toBeGreaterThan(0);
    expect(seo.description.length).toBeLessThanOrEqual(160);
}

const pant = PRODUCTS.find((p) => p.collection === "pants")!;
const multi = PRODUCTS.find((p) => p.variants.length > 1)!;

describe("seoFor", () => {
    it("home: brand title, Organization + WebSite JSON-LD", () => {
        const seo = seoFor("/");
        expectCommon(seo, "/");
        expect(seo.title).toMatch(/^Kalaf/);
        expect(seo.noindex).toBe(false);
        const org = ofType(seo.jsonLd, "Organization")!;
        expect(org.taxID).toBe(BUSINESS.gstin);
        expect(org.legalName).toBe(BUSINESS.legal_name);
        expect(ofType(seo.jsonLd, "WebSite")).toBeDefined();
    });

    it("a policy page gets its own title and a clean canonical", () => {
        const seo = seoFor(ROUTES.privacy, "?utm_source=x");
        expectCommon(seo, ROUTES.privacy);
        expect(seo.title).toBe("Privacy Policy · Kalaf");
        expect(seo.noindex).toBe(false);
    });

    it("strips a trailing slash", () => {
        expect(seoFor(`${ROUTES.terms}/`).canonical).toBe(
            `${SITE_URL}${ROUTES.terms}`
        );
    });

    it("a collection lists its products and uses a product photo", () => {
        const path = collectionPath("dupattas");
        const seo = seoFor(path);
        expectCommon(seo, path);
        expect(seo.title).toContain("Dupattas");
        expect(seo.image).toMatch(/\/catalog\/.+\.(jpe?g|webp|avif|png)$/);
        const list = ofType(seo.jsonLd, "ItemList")!;
        const names = (list.itemListElement as Json[]).map((i) => i.name);
        expect(names).toEqual(
            PRODUCTS.filter((p) => p.collection === "dupattas").map(
                (p) => p.title
            )
        );
    });

    it("an unknown collection is a noindex 404", () => {
        expect(seoFor("/collections/shoes").noindex).toBe(true);
    });

    it("a product without ?colour= describes the first colour", () => {
        const path = productPath(pant.handle);
        const seo = seoFor(path);
        const v = pant.variants[0];
        expectCommon(seo, path);
        expect(seo.type).toBe("product");
        expect(seo.title).toBe(`${pant.title} · Kalaf`);
        expect(seo.url).toBe(`${SITE_URL}${path}`);
        expect(seo.image).toBe(`${SITE_URL}${v.images[0].srcLarge}`);
        expectProductJsonLd(seo.jsonLd, v, `${SITE_URL}${path}`);
    });

    it("a product with ?colour= picks that colour but keeps a clean canonical", () => {
        const v = multi.variants[multi.variants.length - 1];
        const path = productPath(multi.handle);
        const seo = seoFor(path, `?colour=${v.colourCode}`);
        expectCommon(seo, path);
        expect(seo.title).toBe(`${multi.title} — ${v.colour} · Kalaf`);
        expect(seo.url).toBe(
            `${SITE_URL}${productPath(multi.handle, v.colourCode)}`
        );
        expect(seo.image).toBe(`${SITE_URL}${v.images[0].srcLarge}`);
        expectProductJsonLd(seo.jsonLd, v, seo.url);
    });

    it("an unknown ?colour= falls back to the first colour", () => {
        const seo = seoFor(productPath(multi.handle), "?colour=ZZZ");
        expect(seo.title).toBe(`${multi.title} · Kalaf`);
        expect(seo.url).toBe(`${SITE_URL}${productPath(multi.handle)}`);
    });

    it("an old product handle resolves, canonical to the new handle", () => {
        const seo = seoFor("/products/cotton-linen-relaxed-trousers");
        const product = findProduct("cotton-linen-relaxed-trousers")!;
        expect(seo.type).toBe("product");
        expect(seo.noindex).toBe(false);
        expect(seo.canonical).toBe(`${SITE_URL}${productPath(product.handle)}`);
    });

    it("an unknown path is noindex with no JSON-LD", () => {
        const seo = seoFor("/no/such/page");
        expect(seo.noindex).toBe(true);
        expect(seo.title).toMatch(/not found/i);
        expect(seo.jsonLd).toEqual([]);
        expect(seo.image).toMatch(/^https:\/\//);
    });

    it("an unknown product handle is noindex", () => {
        expect(seoFor("/products/nothing-here").noindex).toBe(true);
    });
});

function expectProductJsonLd(ld: Json[], v: Variant, _pageUrl: string) {
    const group = ofType(ld, "ProductGroup")!;
    expect(group["@context"]).toBe("https://schema.org");
    expect(group.brand).toEqual({ "@type": "Brand", name: "Kalaf" });
    expect(group.variesBy).toBe("https://schema.org/color");
    const variants = group.hasVariant as Json[];
    // Every colour of the piece is listed, each as its own Product.
    expect(variants.length).toBeGreaterThan(0);
    variants.forEach((x) => expect(x["@type"]).toBe("Product"));
    const product = variants.find((x) => x.sku === v.sku)!;
    expect(product, `variant ${v.sku}`).toBeDefined();
    expect(product.color).toBe(v.colour);
    expect(product.url).toMatch(
        new RegExp(`^https://kalaf\\.in/products/.+\\?colour=${v.colourCode}$`)
    );
    const images = product.image as string[];
    expect(images).toHaveLength(v.images.length);
    images.forEach((src) => expect(src).toMatch(/^https:\/\/kalaf\.in\//));

    const offers = product.offers as Offer[];
    const live = Object.entries(v.links).filter(([, link]) => link);
    expect(offers).toHaveLength(live.length);
    for (const [store, link] of live) {
        const offer = offers.find((o) => o.url === link);
        expect(offer, `offer for ${store}`).toBeDefined();
        expect(offer!.priceCurrency).toBe("INR");
        const price = v.prices[store as keyof Variant["prices"]] ?? v.price;
        expect(offer!.price).toBe(price.toFixed(2));
    }

    const crumbs = ofType(ld, "BreadcrumbList")!;
    expect((crumbs.itemListElement as Json[]).length).toBe(3);
}

describe("prerenderPaths", () => {
    const paths = prerenderPaths();

    it("covers home, shop, every collection and every product", () => {
        expect(paths).toContain(ROUTES.home);
        expect(paths).toContain(ROUTES.products);
        for (const c of Object.keys(COLLECTIONS)) {
            expect(paths).toContain(collectionPath(c));
        }
        for (const p of PRODUCTS)
            expect(paths).toContain(productPath(p.handle));
    });

    it("has no duplicates, no query strings, and every path is indexable", () => {
        expect(new Set(paths).size).toBe(paths.length);
        for (const p of paths) {
            expect(p).not.toContain("?");
            expect(seoFor(p).noindex, p).toBe(false);
        }
    });

    it("sitemap.xml lists every path once", () => {
        const xml = sitemapXml("2026-01-01");
        const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
        expect(locs).toEqual(paths.map((p) => `${SITE_URL}${p}`));
    });
});

describe("head HTML", () => {
    it("escapes text and keeps JSON-LD from closing the script tag", () => {
        expect(jsonLdText([{ name: "</script><b>" }])).not.toContain("</");
        const html = headHtml({
            ...seoFor("/"),
            title: `A "quoted" <title> & more`,
        });
        expect(html).toContain(
            "<title data-seo>A &quot;quoted&quot; &lt;title&gt; &amp; more</title>"
        );
    });

    it("noindex pages get a robots tag and no canonical", () => {
        const html = headHtml(seoFor("/nope"));
        expect(html).toContain('name="robots" content="noindex"');
        expect(html).not.toContain('rel="canonical"');
    });
});

describe("llmsTxt", () => {
    it("mentions every product, the GSTIN and the contact email", () => {
        const txt = llmsTxt();
        for (const p of PRODUCTS) expect(txt).toContain(p.title);
        expect(txt).toContain(BUSINESS.gstin);
        expect(txt).toContain(BUSINESS.email);
        expect(txt).not.toMatch(/Amazon/);
    });
});
