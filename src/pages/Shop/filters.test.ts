import { describe, expect, it } from "vitest";
import { LISTING, type ListingItem } from "../../data/catalog";
import {
    FILTER_GROUPS,
    facetOptions,
    matches,
    readSelection,
    sortItems,
    type Selection,
} from "./filters";

const params = (q: string) => new URLSearchParams(q);
const group = (key: string) => FILTER_GROUPS.find((g) => g.key === key)!;
const filter = (sel: Selection) => LISTING.filter((i) => matches(i, sel));
const skus = (items: ListingItem[]) => items.map((i) => i.variant.sku);

const pants = LISTING.filter((i) => i.product.collection === "pants");
const dupattas = LISTING.filter((i) => i.product.collection === "dupattas");

describe("readSelection", () => {
    it("is empty with no query", () => {
        expect(readSelection(params(""))).toEqual({});
    });

    it("reads comma-separated values per group", () => {
        expect(
            readSelection(params("?colour=Red,Pink&category=Dupattas"))
        ).toEqual({ colour: ["Red", "Pink"], category: ["Dupattas"] });
    });

    it("ignores values no piece has, like a store nothing is sold on", () => {
        expect(readSelection(params("?store=Amazon"))).toEqual({});
        expect(readSelection(params("?store=Amazon,Flipkart"))).toEqual({
            store: ["Flipkart"],
        });
        expect(readSelection(params("?colour=Chartreuse"))).toEqual({});
    });

    it("ignores unknown keys and empty values", () => {
        expect(readSelection(params("?sort=price-asc&foo=bar"))).toEqual({});
        expect(readSelection(params("?colour=,,Red,"))).toEqual({
            colour: ["Red"],
        });
    });

    it("is case-sensitive, matching the labels the filter panel writes", () => {
        expect(readSelection(params("?colour=red"))).toEqual({});
    });
});

describe("matches", () => {
    it("everything matches an empty selection", () => {
        expect(filter({})).toHaveLength(LISTING.length);
    });

    it("filters by category", () => {
        expect(skus(filter({ category: ["Pants"] }))).toEqual(skus(pants));
        expect(skus(filter({ category: ["Dupattas"] }))).toEqual(
            skus(dupattas)
        );
    });

    it("filters by style (product title)", () => {
        const title = dupattas[0].product.title;
        const got = filter({ style: [title] });
        expect(got.length).toBeGreaterThan(0);
        expect(got.every((i) => i.product.title === title)).toBe(true);
    });

    it("filters by colour family, OR within a group", () => {
        const got = filter({ colour: ["Red", "Black"] });
        expect(got.length).toBeGreaterThan(0);
        expect(
            got.every((i) => ["Red", "Black"].includes(i.variant.family))
        ).toBe(true);
        expect(got.length).toBe(
            LISTING.filter((i) => ["Red", "Black"].includes(i.variant.family))
                .length
        );
    });

    it("filters by fabric", () => {
        const fabric = pants[0].product.fabric!;
        expect(skus(filter({ fabric: [fabric] }))).toEqual(
            skus(LISTING.filter((i) => i.product.fabric === fabric))
        );
    });

    it("filters by size (only sized pieces have sizes)", () => {
        const size = pants[0].product.sizes[0];
        const got = filter({ size: [size] });
        expect(got.length).toBeGreaterThan(0);
        expect(got.every((i) => i.product.sizes.includes(size))).toBe(true);
    });

    it("filters by store, using only live links", () => {
        const got = filter({ store: ["Meesho"] });
        expect(got.every((i) => Boolean(i.variant.links.meesho))).toBe(true);
        expect(got.length).toBe(
            LISTING.filter((i) => i.variant.links.meesho).length
        );
    });

    it("ANDs across groups", () => {
        const got = filter({ category: ["Dupattas"], colour: ["Black"] });
        expect(got.length).toBeGreaterThan(0);
        expect(
            got.every(
                (i) =>
                    i.product.collection === "dupattas" &&
                    i.variant.family === "Black"
            )
        ).toBe(true);
        expect(filter({ category: ["Pants"], colour: ["Red"] })).toEqual(
            LISTING.filter(
                (i) =>
                    i.product.collection === "pants" &&
                    i.variant.family === "Red"
            )
        );
    });

    it("can skip one group (for facet counts)", () => {
        const item = pants[0];
        expect(matches(item, { category: ["Dupattas"] })).toBe(false);
        expect(matches(item, { category: ["Dupattas"] }, "category")).toBe(
            true
        );
    });
});

describe("facetOptions", () => {
    it("counts every value, ignoring the group's own selection", () => {
        const opts = facetOptions(LISTING, group("category"), {
            category: ["Pants"],
        });
        expect(opts).toEqual(
            expect.arrayContaining([
                { value: "Pants", count: pants.length },
                { value: "Dupattas", count: dupattas.length },
            ])
        );
    });

    it("narrows counts by the other groups but keeps zero-count options", () => {
        const opts = facetOptions(LISTING, group("colour"), {
            category: ["Pants"],
        });
        // A colour some dupatta comes in but no pant does.
        const absent = dupattas
            .map((i) => i.variant.family)
            .find((f) => !pants.some((p) => p.variant.family === f))!;
        expect(opts.find((o) => o.value === absent)).toEqual({
            value: absent,
            count: 0,
        });
        const total = opts.reduce((n, o) => n + o.count, 0);
        expect(total).toBe(pants.length);
    });

    it("never offers a store nothing is live on", () => {
        const values = facetOptions(LISTING, group("store"), {}).map(
            (o) => o.value
        );
        expect(values).not.toContain("Amazon");
        expect(values).toContain("Flipkart");
    });
});

describe("sortItems", () => {
    const prices = (items: ListingItem[]) => items.map((i) => i.variant.price);

    it("featured keeps catalog order and doesn't mutate the input", () => {
        const input = [...LISTING];
        expect(sortItems(input, "featured")).toEqual(LISTING);
        expect(input).toEqual(LISTING);
    });

    it("sorts by price ascending and descending", () => {
        const asc = prices(sortItems(LISTING, "price-asc"));
        expect(asc).toEqual([...asc].sort((a, b) => a - b));
        const desc = prices(sortItems(LISTING, "price-desc"));
        expect(desc).toEqual([...desc].sort((a, b) => b - a));
    });

    it("sorts by title then colour name", () => {
        const names = sortItems(LISTING, "name").map(
            (i) => `${i.product.title} ${i.variant.colour}`
        );
        expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));
    });

    it("treats an unknown sort key as featured", () => {
        expect(sortItems(LISTING, "bogus")).toEqual(LISTING);
    });

    it("moves sold-out pieces last, keeping their relative order", () => {
        const soldOut = (i: ListingItem): ListingItem => ({
            ...i,
            variant: { ...i.variant, stock: 0 },
        });
        const items = [
            soldOut(LISTING[0]),
            LISTING[1],
            soldOut(LISTING[2]),
            LISTING[3],
        ];
        for (const sort of ["featured", "price-asc", "price-desc", "name"]) {
            const out = sortItems(items, sort);
            expect(out.map((i) => i.variant.stock === 0)).toEqual([
                false,
                false,
                true,
                true,
            ]);
        }
        expect(skus(sortItems(items, "featured"))).toEqual(
            skus([LISTING[1], LISTING[3], LISTING[0], LISTING[2]])
        );
    });

    it("treats an unknown stock count as in stock", () => {
        const items = [
            { ...LISTING[0], variant: { ...LISTING[0].variant, stock: 0 } },
            { ...LISTING[1], variant: { ...LISTING[1].variant, stock: null } },
        ];
        expect(sortItems(items, "featured")[0].variant.stock).toBeNull();
    });
});
