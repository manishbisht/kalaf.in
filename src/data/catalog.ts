// Typed access to the product catalog. catalog.json is generated from the
// products.kalaf.in repo by scripts/sync-catalog.py — don't edit it by hand.

import raw from "./catalog.json";

// Every store the site knows how to link to, in button order. A store only
// shows up anywhere on the site once the catalog has a link for it, so adding
// one back (Amazon, say) is a data change in the products repo, not a code one.
export const MARKETPLACES = [
    { id: "flipkart", name: "Flipkart" },
    { id: "meesho", name: "Meesho" },
    { id: "amazon", name: "Amazon" },
] as const;

export type Marketplace = (typeof MARKETPLACES)[number]["id"];
export type MarketplaceLinks = Partial<Record<Marketplace, string>>;

export function storeName(id: string) {
    return MARKETPLACES.find((m) => m.id === id)?.name ?? id;
}

export type ProductImage = { src: string; srcLarge: string };

export type Variant = {
    sku: string;
    colourCode: string;
    colour: string;
    family: string;
    price: number;
    mrp: number;
    images: ProductImage[];
    video: { src: string; poster: string } | null;
    links: MarketplaceLinks;
    // Each live store's own price (they can differ); `price` is the lowest.
    prices: Partial<Record<keyof MarketplaceLinks, number>>;
    // Sized products: Flipkart has one page per size.
    sizeLinks: Record<string, string> | null;
    // Units in stock (summed over sizes); null when the products repo has no count.
    stock: number | null;
};

export type SizeChart = {
    units: string;
    lengthIn: number | null;
    inseamIn: number | null;
    rows: { size: string; waist: number; hip: number }[];
};

export type CollectionHandle = "pants" | "dupattas";

export type Product = {
    code: string;
    handle: string;
    collection: CollectionHandle;
    title: string;
    description: string;
    features: string[];
    details: string[];
    care: string[];
    fabric: string | null;
    pattern: string | null;
    border: string | null;
    fit: string | null;
    size: string | null;
    sizes: string[];
    sizeChart: SizeChart | null;
    // Working days from order to dispatch.
    dispatchDays: number | null;
    variants: Variant[];
};

export const PRODUCTS = raw.products as Product[];

// Stores Kalaf actually sells on: those with a live link for at least one
// piece. A piece missing one of these shows it as "coming soon" (today: the
// pant on Meesho). A store nothing is live on (Amazon) isn't shown at all.
export const SOLD_ON: Marketplace[] = MARKETPLACES.map((m) => m.id).filter(
    (id) => PRODUCTS.some((p) => p.variants.some((v) => v.links[id]))
);

// Stock is null when the products repo has no count — treat that as available.
export function isSoldOut(variant: Variant) {
    return variant.stock === 0;
}

// Card-sized colour name: "Multicolour Green Yellow Red" → "Green/Yellow/Red"
// (the swatch next to it already says it's multicolour).
export function shortColour(variant: Variant) {
    const prefix = `${variant.family} `;
    if (variant.family === "Multicolour" && variant.colour.startsWith(prefix)) {
        return variant.colour.slice(prefix.length).split(/\s+/).join("/");
    }
    return variant.colour;
}

export const COLLECTIONS: Record<
    CollectionHandle,
    { title: string; eyebrow: string; devanagari: string; intro: string }
> = {
    pants: {
        title: "Pants",
        eyebrow: "Collection — pants",
        devanagari: "पतलून",
        intro: "100% cotton trousers cut for Indian summers. Elastic waist, relaxed straight leg, made in Jaipur.",
    },
    dupattas: {
        title: "Dupattas",
        eyebrow: "Collection — dupattas",
        devanagari: "दुपट्टा",
        intro: "Bandhani and leheriya dupattas from Jaipur, with and without a gota border. Full length, 2.25 m.",
    },
};

// One shoppable item per colour — what the listing grids show.
export type ListingItem = { product: Product; variant: Variant };

export const LISTING: ListingItem[] = PRODUCTS.flatMap((product) =>
    product.variants.map((variant) => ({ product, variant }))
);

// Handles that changed, so old shared links keep working.
const OLD_HANDLES: Record<string, string> = {
    "cotton-linen-relaxed-trousers": "cotton-relaxed-trousers",
};

export function findProduct(handle: string | undefined) {
    const h = handle && (OLD_HANDLES[handle] ?? handle);
    return PRODUCTS.find((p) => p.handle === h);
}

export function formatRupees(n: number) {
    return `₹${n.toLocaleString("en-IN")}`;
}

export function percentOff(price: number, mrp: number) {
    return Math.round((1 - price / mrp) * 100);
}

// Swatch colours by colour code (colors.json in the products repo).
// Multicolour pieces get one segment per colour.
const HEX: Record<string, string[]> = {
    BK: ["#1a1a1a"],
    GR: ["#2f6b3a"],
    MA: ["#6b1f2a"],
    PI: ["#e48aa8"],
    RA: ["#d6246e"],
    RB: ["#2a4fa8"],
    RED: ["#b3242c"],
    YEL: ["#e8b923"],
    WH: ["#f4f1ea"],
    BE: ["#d9c7a7"],
    MU: ["#2f6b3a", "#e8b923", "#b3242c"],
    MU1: ["#e0782a", "#6b1f2a", "#d9c3a0"],
    MU2: ["#e8b923", "#b3242c", "#1a1a1a"],
    MU3: ["#e48aa8", "#e8b923", "#2a4fa8"],
    MU4: ["#e48aa8", "#b3242c"],
};

export function swatchColours(colourCode: string) {
    return HEX[colourCode] ?? ["#c9b79c"];
}
