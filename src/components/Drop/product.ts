// The pant as it is listed on the marketplaces. Source of truth is the
// products.kalaf.in sheet (Pants tab) — keep prices and links in sync with it.

export type Marketplace = "amazon" | "flipkart" | "meesho";

export type Colourway = {
    id: string;
    name: string;
    swatch: string;
    sku: string;
    image: string;
    // Per-colour listing links. A missing link means "not live yet".
    links: Partial<Record<Marketplace, string>>;
};

export const PANT = {
    name: "Cotton Linen Relaxed Trousers",
    fabric: "Cotton-linen blend",
    fit: "Relaxed, wide straight leg",
    sizes: ["28", "30", "32", "34", "36"],
    price: 2999,
    mrp: 5000,
} as const;

// Flipkart links open the size-32 variant; the size picker is on that page.
export const COLOURWAYS: Colourway[] = [
    {
        id: "white",
        name: "White",
        swatch: "#f4f1ea",
        sku: "PNT_WH",
        image: "/pant-white.png",
        links: {
            flipkart:
                "https://www.flipkart.com/product/p/itme?pid=TROHSRF2WR8FANUF",
            meesho: "https://www.meesho.com/s/p/j0jjab",
        },
    },
    {
        id: "beige",
        name: "Beige",
        swatch: "#c9b79c",
        sku: "PNT_BE",
        image: "/pant-front.png",
        links: {
            flipkart:
                "https://www.flipkart.com/product/p/itme?pid=TROHSRF2VER6CRJP",
            meesho: "https://www.meesho.com/s/p/j0jjaa",
        },
    },
    {
        id: "black",
        name: "Black",
        swatch: "#1a1a1a",
        sku: "PNT_BK",
        image: "/pant-black.png",
        links: {
            flipkart:
                "https://www.flipkart.com/product/p/itme?pid=TROHSRF2SMV4QBTF",
            meesho: "https://www.meesho.com/s/p/j0jjac",
        },
    },
];

export const DEFAULT_COLOURWAY = COLOURWAYS[0];

export function formatRupees(n: number) {
    return `₹${n.toLocaleString("en-IN")}`;
}
