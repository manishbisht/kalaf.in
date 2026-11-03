// Dupattas as listed on the marketplaces. Source of truth is the
// products.kalaf.in sheet (Dupattas tab) — keep prices and links in sync.
// A missing link means that colour is not live on that marketplace yet
// (Flipkart "In QC", Amazon "On hold").

import type { MarketplaceLinks } from "../BuyButtons";

export type DupattaColour = {
    sku: string;
    name: string;
    // One hex for a solid colour; several for multicolour pieces.
    hex: string[];
    links: MarketplaceLinks;
};

export type Dupatta = {
    id: string;
    name: string;
    pattern: "bandhani" | "leheriya";
    gota: boolean;
    fabric: string;
    colours: DupattaColour[];
};

export const DUPATTA_DETAILS = {
    price: 1000,
    mrp: 1500,
    size: "2.25\u00a0m × 1\u00a0m",
} as const;

const HEX = {
    black: "#1a1a1a",
    green: "#2f6b3a",
    pink: "#e48aa8",
    rani: "#d6246e",
    royalBlue: "#2a4fa8",
    red: "#b3242c",
    maroon: "#6b1f2a",
    yellow: "#e8b923",
    orange: "#e0782a",
    beige: "#d9c3a0",
};

const meesho = (code: string) => `https://www.meesho.com/s/p/${code}`;
const flipkart = (pid: string) =>
    `https://www.flipkart.com/product/p/itme?pid=${pid}`;

export const DUPATTAS: Dupatta[] = [
    {
        id: "bandhani-gota",
        name: "Bandhani Dupatta with Gota Border",
        pattern: "bandhani",
        gota: true,
        fabric: "Artificial silk (taffeta)",
        colours: [
            {
                sku: "DUAG_MU",
                name: "Multicolour Green Yellow Red",
                hex: [HEX.green, HEX.yellow, HEX.red],
                links: {
                    flipkart: flipkart("DUPHSG6FPHKZZFSU"),
                    meesho: meesho("itwm7x"),
                    amazon: "https://www.amazon.in/dp/B0HPB15B6W",
                },
            },
            {
                sku: "DUAG_MU1",
                name: "Multicolour Orange Maroon Beige",
                hex: [HEX.orange, HEX.maroon, HEX.beige],
                links: { meesho: meesho("j0d020") },
            },
            {
                sku: "DUAG_MU2",
                name: "Multicolour Yellow Red Black",
                hex: [HEX.yellow, HEX.red, HEX.black],
                links: { meesho: meesho("j04eaa") },
            },
            {
                sku: "DUAG_MU3",
                name: "Multicolour Pink Yellow Blue",
                hex: [HEX.pink, HEX.yellow, HEX.royalBlue],
                links: { meesho: meesho("j0d022") },
            },
            {
                sku: "DUAG_MU4",
                name: "Multicolour Pink Red",
                hex: [HEX.pink, HEX.red],
                links: { meesho: meesho("j04eaf") },
            },
            {
                sku: "DUAG_RED",
                name: "Red",
                hex: [HEX.red],
                links: { meesho: meesho("j04eac") },
            },
            {
                sku: "DUAG_MA",
                name: "Maroon",
                hex: [HEX.maroon],
                links: { meesho: meesho("j04ead") },
            },
            {
                sku: "DUAG_RA",
                name: "Rani Pink",
                hex: [HEX.rani],
                links: { meesho: meesho("j04eab") },
            },
            {
                sku: "DUAG_PI",
                name: "Pink",
                hex: [HEX.pink],
                links: { meesho: meesho("j0d021") },
            },
            {
                sku: "DUAG_YEL",
                name: "Yellow",
                hex: [HEX.yellow],
                links: { meesho: meesho("j04eah") },
            },
            {
                sku: "DUAG_GR",
                name: "Green",
                hex: [HEX.green],
                links: { meesho: meesho("j04eae") },
            },
            {
                sku: "DUAG_RB",
                name: "Royal Blue",
                hex: [HEX.royalBlue],
                links: { meesho: meesho("j0d01z") },
            },
            {
                sku: "DUAG_BK",
                name: "Black",
                hex: [HEX.black],
                links: { meesho: meesho("j04eag") },
            },
        ],
    },
    {
        id: "bandhani",
        name: "Bandhani Dupatta",
        pattern: "bandhani",
        gota: false,
        fabric: "Artificial silk (taffeta)",
        colours: [
            {
                sku: "DUA_RED",
                name: "Red",
                hex: [HEX.red],
                links: {
                    flipkart: flipkart("DUPHSQBQRMQPEDWU"),
                    meesho: meesho("itzfl0"),
                },
            },
            {
                sku: "DUA_PI",
                name: "Pink",
                hex: [HEX.pink],
                links: {
                    flipkart: flipkart("DUPHSQBQKQZSNXQV"),
                    meesho: meesho("itzfl2"),
                },
            },
            {
                sku: "DUA_GR",
                name: "Green",
                hex: [HEX.green],
                links: {
                    flipkart: flipkart("DUPHSQBQGAFNJS7T"),
                    meesho: meesho("itzfl4"),
                },
            },
            {
                sku: "DUA_RB",
                name: "Royal Blue",
                hex: [HEX.royalBlue],
                links: {
                    flipkart: flipkart("DUPHSQBQGZB7TNXF"),
                    meesho: meesho("itzfl3"),
                },
            },
            {
                sku: "DUA_BK",
                name: "Black",
                hex: [HEX.black],
                links: {
                    flipkart: flipkart("DUPHSQBQJCWDF3FX"),
                    meesho: meesho("itzfl1"),
                },
            },
        ],
    },
    {
        id: "chiffon-leheriya",
        name: "Chiffon Leheriya Dupatta with Gota Border",
        pattern: "leheriya",
        gota: true,
        fabric: "Chiffon",
        colours: [
            {
                sku: "DUCHI_RED",
                name: "Red",
                hex: [HEX.red],
                links: { meesho: meesho("j04wvg") },
            },
            {
                sku: "DUCHI_PI",
                name: "Pink",
                hex: [HEX.pink],
                links: { meesho: meesho("j04wve") },
            },
            {
                sku: "DUCHI_YEL",
                name: "Yellow",
                hex: [HEX.yellow],
                links: { meesho: meesho("j04wvd") },
            },
            {
                sku: "DUCHI_RB",
                name: "Royal Blue",
                hex: [HEX.royalBlue],
                links: { meesho: meesho("j04wvc") },
            },
            {
                sku: "DUCHI_BK",
                name: "Black",
                hex: [HEX.black],
                links: { meesho: meesho("j04wvf") },
            },
        ],
    },
];
