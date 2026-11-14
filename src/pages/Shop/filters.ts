import {
    LISTING,
    isSoldOut,
    storeName,
    type ListingItem,
} from "../../data/catalog";

// Each filter group reads one value off an item. Selected values live in the
// URL (?colour=Red,Pink&store=flipkart) so filtered views can be shared.
export type FilterGroup = {
    key: string;
    label: string;
    values: (item: ListingItem) => string[];
};

export const FILTER_GROUPS: FilterGroup[] = [
    {
        key: "category",
        label: "Category",
        values: ({ product }) => [
            product.collection === "pants" ? "Pants" : "Dupattas",
        ],
    },
    {
        key: "style",
        label: "Style",
        values: ({ product }) => [product.title],
    },
    {
        key: "colour",
        label: "Colour",
        values: ({ variant }) => [variant.family],
    },
    {
        key: "fabric",
        label: "Fabric",
        values: ({ product }) => (product.fabric ? [product.fabric] : []),
    },
    {
        key: "size",
        label: "Size",
        values: ({ product }) => product.sizes,
    },
    {
        key: "store",
        label: "Available on",
        // Only stores with a live link, so a store nothing is sold on never
        // appears as an option.
        values: ({ variant }) =>
            Object.entries(variant.links)
                .filter(([, url]) => url)
                .map(([s]) => storeName(s)),
    },
];

export type Selection = Record<string, string[]>;

// Values any piece in the catalog has, per group. Values in an old link that
// no longer exist (e.g. ?store=Amazon) are ignored rather than shown as a
// filter that matches nothing.
const KNOWN = new Map(
    FILTER_GROUPS.map((g) => [g.key, new Set(LISTING.flatMap(g.values))])
);

export function readSelection(params: URLSearchParams): Selection {
    const sel: Selection = {};
    for (const g of FILTER_GROUPS) {
        const raw = params.get(g.key);
        const known = KNOWN.get(g.key);
        const values = (raw ?? "").split(",").filter((v) => v && known?.has(v));
        if (values.length) sel[g.key] = values;
    }
    return sel;
}

export function matches(item: ListingItem, sel: Selection, skip?: string) {
    return FILTER_GROUPS.every((g) => {
        if (g.key === skip) return true;
        const chosen = sel[g.key];
        if (!chosen?.length) return true;
        const vals = g.values(item);
        return chosen.some((c) => vals.includes(c));
    });
}

// Options for a group with counts, given the other active filters. Groups
// with only one possible option are hidden (nothing to choose).
export function facetOptions(
    items: ListingItem[],
    group: FilterGroup,
    sel: Selection
) {
    const all = new Map<string, number>();
    for (const item of items) {
        for (const v of group.values(item)) all.set(v, all.get(v) ?? 0);
    }
    for (const item of items) {
        if (!matches(item, sel, group.key)) continue;
        for (const v of group.values(item)) all.set(v, (all.get(v) ?? 0) + 1);
    }
    return [...all.entries()].map(([value, count]) => ({ value, count }));
}

export const SORTS = [
    { key: "featured", label: "Featured" },
    { key: "price-asc", label: "Price: low to high" },
    { key: "price-desc", label: "Price: high to low" },
    { key: "name", label: "Name: A to Z" },
] as const;

// Applies the chosen sort, then moves sold-out pieces to the end (the sort is
// stable, so they keep their order among themselves).
export function sortItems(items: ListingItem[], sort: string) {
    const out = [...items];
    if (sort === "price-asc")
        out.sort((a, b) => a.variant.price - b.variant.price);
    if (sort === "price-desc")
        out.sort((a, b) => b.variant.price - a.variant.price);
    if (sort === "name")
        out.sort((a, b) =>
            `${a.product.title} ${a.variant.colour}`.localeCompare(
                `${b.product.title} ${b.variant.colour}`
            )
        );
    out.sort(
        (a, b) => Number(isSoldOut(a.variant)) - Number(isSoldOut(b.variant))
    );
    return out;
}
