import type { ListingItem } from "../../data/catalog";

// Each filter group reads one value off an item. Selected values live in the
// URL (?colour=Red,Pink&store=flipkart) so filtered views can be shared.
export type FilterGroup = {
    key: string;
    label: string;
    values: (item: ListingItem) => string[];
};

const STORE_LABEL: Record<string, string> = {
    flipkart: "Flipkart",
    meesho: "Meesho",
    amazon: "Amazon",
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
        values: ({ variant }) =>
            Object.keys(variant.links).map((s) => STORE_LABEL[s] ?? s),
    },
];

export type Selection = Record<string, string[]>;

export function readSelection(params: URLSearchParams): Selection {
    const sel: Selection = {};
    for (const g of FILTER_GROUPS) {
        const raw = params.get(g.key);
        if (raw) sel[g.key] = raw.split(",").filter(Boolean);
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
    return out;
}
