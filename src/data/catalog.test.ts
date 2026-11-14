import { describe, expect, it } from "vitest";
import {
    COLLECTIONS,
    LISTING,
    MARKETPLACES,
    PRODUCTS,
    SOLD_ON,
    findProduct,
    formatRupees,
    isSoldOut,
    percentOff,
    shortColour,
    storeName,
    swatchColours,
    type Variant,
} from "./catalog";

const variant = (over: Partial<Variant>): Variant => ({
    ...PRODUCTS[0].variants[0],
    ...over,
});

describe("findProduct", () => {
    it("finds every product by its handle", () => {
        for (const p of PRODUCTS) expect(findProduct(p.handle)).toBe(p);
    });

    it("maps the pre-cotton pant handle to the current one", () => {
        expect(findProduct("cotton-linen-relaxed-trousers")?.handle).toBe(
            "cotton-relaxed-trousers"
        );
    });

    it("returns undefined for unknown or missing handles", () => {
        expect(findProduct("no-such-thing")).toBeUndefined();
        expect(findProduct(undefined)).toBeUndefined();
        expect(findProduct("")).toBeUndefined();
    });
});

describe("formatRupees", () => {
    it("uses the rupee sign and Indian digit grouping", () => {
        expect(formatRupees(998)).toBe("₹998");
        expect(formatRupees(1000)).toBe("₹1,000");
        expect(formatRupees(123456)).toBe("₹1,23,456");
        expect(formatRupees(10000000)).toBe("₹1,00,00,000");
    });
});

describe("percentOff", () => {
    it("rounds the discount to a whole percent", () => {
        expect(percentOff(998, 3500)).toBe(71);
        expect(percentOff(1000, 1500)).toBe(33);
        expect(percentOff(949, 1500)).toBe(37);
    });

    it("is 0 when price equals MRP", () => {
        expect(percentOff(1500, 1500)).toBe(0);
    });
});

describe("swatchColours", () => {
    it("returns one hex for a plain colour and segments for multicolour", () => {
        expect(swatchColours("BK")).toEqual(["#1a1a1a"]);
        expect(swatchColours("MU").length).toBeGreaterThan(1);
    });

    it("falls back to sand for an unknown code", () => {
        expect(swatchColours("NOPE")).toEqual(["#c9b79c"]);
    });
});

describe("shortColour", () => {
    it("drops the Multicolour prefix and joins the colours", () => {
        expect(
            shortColour(
                variant({
                    family: "Multicolour",
                    colour: "Multicolour Green Yellow Red",
                })
            )
        ).toBe("Green/Yellow/Red");
    });

    it("leaves plain colours alone", () => {
        expect(
            shortColour(variant({ family: "Pink", colour: "Rani Pink" }))
        ).toBe("Rani Pink");
    });
});

describe("isSoldOut", () => {
    it("is true only for a stock count of zero", () => {
        expect(isSoldOut(variant({ stock: 0 }))).toBe(true);
        expect(isSoldOut(variant({ stock: 3 }))).toBe(false);
        // No count in the products repo: treat as available.
        expect(isSoldOut(variant({ stock: null }))).toBe(false);
    });
});

describe("LISTING", () => {
    it("has exactly one item per variant, in catalog order", () => {
        const expected = PRODUCTS.flatMap((p) => p.variants.map((v) => v.sku));
        expect(LISTING.map((i) => i.variant.sku)).toEqual(expected);
    });

    it("pairs each variant with the product it belongs to", () => {
        for (const { product, variant: v } of LISTING) {
            expect(product.variants).toContain(v);
        }
    });
});

describe("COLLECTIONS", () => {
    it("covers every product's collection", () => {
        for (const p of PRODUCTS)
            expect(COLLECTIONS[p.collection]).toBeDefined();
    });
});

describe("stores", () => {
    it("names known stores and passes unknown ids through", () => {
        expect(storeName("flipkart")).toBe("Flipkart");
        expect(storeName("meesho")).toBe("Meesho");
        expect(storeName("ajio")).toBe("ajio");
    });

    it("SOLD_ON lists exactly the stores some piece has a live link on", () => {
        const live = MARKETPLACES.map((m) => m.id).filter((id) =>
            PRODUCTS.some((p) => p.variants.some((v) => v.links[id]))
        );
        expect(SOLD_ON).toEqual(live);
        expect(SOLD_ON.length).toBeGreaterThan(0);
    });

    it("SOLD_ON keeps button order (Flipkart, Meesho, Amazon)", () => {
        const order = MARKETPLACES.map((m) => m.id);
        const idx = SOLD_ON.map((id) => order.indexOf(id));
        expect(idx).toEqual([...idx].sort((a, b) => a - b));
    });
});
