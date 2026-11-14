// Checks over the generated data files (catalog.json, business.json). These
// catch a bad `scripts/sync-catalog.py` run before it ships: missing media,
// broken prices, links the owner doesn't want live, a mistyped GSTIN.

import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { PRODUCTS, swatchColours, type Variant } from "./catalog";
import { BUSINESS } from "./business";

const PUBLIC = join(process.cwd(), "public");
const VARIANTS = PRODUCTS.flatMap((p) =>
    p.variants.map((v) => ({ product: p, v }))
);
const each = <T>(items: T[], fn: (item: T) => void) => items.forEach(fn);

function mediaPaths(v: Variant) {
    return [
        ...v.images.flatMap((img) => [img.src, img.srcLarge]),
        ...(v.video ? [v.video.src, v.video.poster] : []),
    ];
}

function liveLinks(v: Variant) {
    return [
        ...Object.entries(v.links),
        ...Object.entries(v.sizeLinks ?? {}).map(
            ([size, url]) => [`size ${size}`, url] as const
        ),
    ].filter(([, url]) => url);
}

describe("catalog.json", () => {
    it("has products, each with at least one colour", () => {
        expect(PRODUCTS.length).toBeGreaterThan(0);
        each(PRODUCTS, (p) =>
            expect(p.variants.length, p.handle).toBeGreaterThan(0)
        );
    });

    it("product handles are unique", () => {
        const handles = PRODUCTS.map((p) => p.handle);
        expect(new Set(handles).size).toBe(handles.length);
    });

    it("handles are URL-safe slugs", () => {
        each(PRODUCTS, (p) =>
            expect(p.handle).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/)
        );
    });

    it("SKUs are unique, and colour codes are unique within a product", () => {
        const skus = VARIANTS.map(({ v }) => v.sku);
        expect(new Set(skus).size).toBe(skus.length);
        each(PRODUCTS, (p) => {
            const codes = p.variants.map((v) => v.colourCode);
            expect(new Set(codes).size, p.handle).toBe(codes.length);
        });
    });

    it("every variant has at least one image", () => {
        each(VARIANTS, ({ v }) =>
            expect(v.images.length, v.sku).toBeGreaterThan(0)
        );
    });

    it("every image, video and poster exists under public/", () => {
        const missing = VARIANTS.flatMap(({ v }) => mediaPaths(v)).filter(
            (path) => !existsSync(join(PUBLIC, path))
        );
        expect(
            missing,
            "media listed in catalog.json but missing from public/ (re-run scripts/sync-catalog.py)"
        ).toEqual([]);
    });

    it("media paths are site-absolute", () => {
        each(
            VARIANTS.flatMap(({ v }) => mediaPaths(v)),
            (path) => expect(path).toMatch(/^\/catalog\//)
        );
    });

    it("prices are positive and never above MRP", () => {
        each(VARIANTS, ({ v }) => {
            expect(v.price, v.sku).toBeGreaterThan(0);
            expect(v.price, v.sku).toBeLessThanOrEqual(v.mrp);
            for (const [store, price] of Object.entries(v.prices)) {
                expect(price, `${v.sku} on ${store}`).toBeGreaterThan(0);
                expect(price, `${v.sku} on ${store}`).toBeLessThanOrEqual(
                    v.mrp
                );
            }
        });
    });

    it("per-store prices only exist for live stores, and `price` is the lowest", () => {
        each(VARIANTS, ({ v }) => {
            const stores = Object.keys(v.prices);
            for (const s of stores) {
                expect(
                    v.links[s as keyof Variant["links"]],
                    `${v.sku}: price for ${s} but no link`
                ).toBeTruthy();
            }
            if (stores.length) {
                expect(v.price, v.sku).toBe(
                    Math.min(...Object.values(v.prices))
                );
            }
        });
    });

    it("has nothing live on Amazon", () => {
        const onAmazon = VARIANTS.filter(({ v }) => v.links.amazon).map(
            ({ v }) => v.sku
        );
        expect(
            onAmazon,
            "The owner asked (2 Nov 2026) for nothing to be live on Amazon for now. " +
                "If that has changed, update this test; otherwise remove the Amazon " +
                "URL from the products repo or mark it not live, and re-sync."
        ).toEqual([]);
    });

    it("every live buy link is https", () => {
        each(VARIANTS, ({ v }) => {
            for (const [store, url] of liveLinks(v)) {
                expect(url, `${v.sku} ${store}`).toMatch(/^https:\/\/[^\s]+$/);
            }
        });
    });

    it("every colour code in use has a swatch colour", () => {
        const fallback = JSON.stringify(swatchColours("\u0000not-a-code"));
        const missing = [
            ...new Set(VARIANTS.map(({ v }) => v.colourCode)),
        ].filter((code) => JSON.stringify(swatchColours(code)) === fallback);
        expect(
            missing,
            "add these codes to HEX in src/data/catalog.ts"
        ).toEqual([]);
        each(VARIANTS, ({ v }) =>
            swatchColours(v.colourCode).forEach((hex) =>
                expect(hex).toMatch(/^#[0-9a-f]{6}$/i)
            )
        );
    });

    it("sized products have a size chart row for every size", () => {
        each(
            PRODUCTS.filter((p) => p.sizeChart),
            (p) => {
                const rows = p.sizeChart!.rows.map((r) => r.size);
                for (const s of p.sizes) expect(rows, p.handle).toContain(s);
            }
        );
    });

    it("every product has a title, description and fabric", () => {
        each(PRODUCTS, (p) => {
            expect(p.title.trim(), p.handle).not.toBe("");
            expect(p.description.trim(), p.handle).not.toBe("");
            expect(p.fabric, p.handle).toBeTruthy();
        });
    });
});

// Indian GSTIN check digit: base-36 Luhn ("mod 36") over the first 14 chars.
function gstinCheckDigit(gstin: string) {
    const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let sum = 0;
    for (let i = 0; i < 14; i++) {
        const p = chars.indexOf(gstin[i]) * (i % 2 ? 2 : 1);
        sum += Math.floor(p / 36) + (p % 36);
    }
    return chars[(36 - (sum % 36)) % 36];
}

describe("business.json", () => {
    it("GSTIN has the Indian GSTIN format and a valid check digit", () => {
        expect(BUSINESS.gstin).toMatch(
            /^\d{2}[A-Z]{5}\d{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/
        );
        expect(gstinCheckDigit(BUSINESS.gstin)).toBe(BUSINESS.gstin[14]);
    });

    it("GSTIN state code is Rajasthan (08), where the business is registered", () => {
        expect(BUSINESS.address.state).toBe("Rajasthan");
        expect(BUSINESS.gstin.slice(0, 2)).toBe("08");
    });

    it("has a 6-digit PIN code, an email and names", () => {
        expect(BUSINESS.address.pincode).toMatch(/^[1-9]\d{5}$/);
        expect(BUSINESS.email).toMatch(/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i);
        expect(BUSINESS.legal_name.trim()).not.toBe("");
        expect(BUSINESS.trade_name.trim()).not.toBe("");
    });

    it("phone and WhatsApp numbers, when set, are +91 numbers", () => {
        for (const n of [BUSINESS.phone, BUSINESS.whatsapp]) {
            if (n) expect(n.replace(/\s/g, "")).toMatch(/^\+91[6-9]\d{9}$/);
        }
    });
});
