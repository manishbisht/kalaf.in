// Typed access to the product catalog. catalog.json is generated from the
// products.kalaf.in repo by scripts/sync-catalog.py — don't edit it by hand.

import raw from "./catalog.json";
import type { MarketplaceLinks } from "../components/BuyButtons";

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
    // Sized products: Flipkart has one page per size.
    sizeLinks: Record<string, string> | null;
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
    variants: Variant[];
};

export const PRODUCTS = raw.products as Product[];

export const COLLECTIONS: Record<
    CollectionHandle,
    { title: string; eyebrow: string; devanagari: string; intro: string }
> = {
    pants: {
        title: "Pants",
        eyebrow: "Collection — pants",
        devanagari: "पतलून",
        intro: "Cotton-linen trousers cut for Indian summers. Elastic waist, relaxed straight leg, made in Jaipur.",
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

export function findProduct(handle: string | undefined) {
    return PRODUCTS.find((p) => p.handle === handle);
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
