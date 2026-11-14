// Per-route head data: title, description, canonical URL, Open Graph /
// Twitter cards and JSON-LD. One function (`seoFor`) feeds both the runtime
// <Seo /> component and the build-time prerender (scripts/prerender.mjs), so
// what a crawler sees in the static HTML matches what the app renders.

import {
    BRAND,
    ROUTES,
    SOCIAL,
    collectionPath,
    productPath,
} from "../constants";
import {
    COLLECTIONS,
    PRODUCTS,
    findProduct,
    formatRupees,
    storeName,
    type CollectionHandle,
    type Product,
    type Variant,
} from "../data/catalog";
import { BUSINESS } from "../data/business";
import { FAQ_ENTRIES } from "../pages/Faq/data";

export const SITE_URL = "https://kalaf.in";
export const DEFAULT_IMAGE = "/og-image.jpg";
export const LOGO = "/icon-512.png";

type JsonLd = Record<string, unknown>;

export type SeoData = {
    title: string;
    description: string;
    /** Absolute canonical URL (no query string). */
    canonical: string;
    /** Absolute URL of the page as shared (keeps ?colour=). */
    url: string;
    /** Absolute image URL for og:image / twitter:image. */
    image: string;
    type: "website" | "product";
    noindex: boolean;
    jsonLd: JsonLd[];
};

const absolute = (path: string) =>
    path.startsWith("http") ? path : `${SITE_URL}${path}`;

const clip = (text: string, max = 160) => {
    if (text.length <= max) return text;
    const cut = text.slice(0, max - 1);
    return `${cut.slice(0, cut.lastIndexOf(" "))}…`;
};

const SUFFIX = ` · ${BRAND.name}`;

// Policy and guide pages: their copy lives in the page files, so the head
// text is kept here to avoid coupling SEO to page internals.
// `brandTitle`: the title already names the brand, so no " · Kalaf" suffix.
const STATIC_PAGES: Record<
    string,
    { title: string; description: string; brandTitle?: boolean }
> = {
    [ROUTES.shippingReturns]: {
        title: "Shipping & Returns",
        description:
            "How Kalaf orders ship and how returns work. Every piece is sold and delivered by the marketplace you buy from, under its own policy.",
    },
    [ROUTES.privacy]: {
        title: "Privacy Policy",
        description:
            "What kalaf.in collects (very little), why, and your rights. Purchase data stays with the marketplace you bought from.",
    },
    [ROUTES.terms]: {
        title: "Terms of Use",
        description:
            "The rules for using kalaf.in. Orders are sold and fulfilled by the marketplaces under their own terms.",
    },
    [ROUTES.refundPolicy]: {
        title: "Refund Policy",
        description:
            "How refunds work for Kalaf pieces: issued by the marketplace you bought from, to your original payment method.",
    },
    [ROUTES.cookies]: {
        title: "Cookie Policy",
        description:
            "The few first-party cookies kalaf.in uses to understand how people find us, and how to switch them off.",
    },
    [ROUTES.sizeGuide]: {
        title: "Size Guide",
        description:
            "Waist and hip measurements for Kalaf cotton trousers, and dupatta dimensions. Find your fit before you buy.",
    },
    [ROUTES.careGuide]: {
        title: "Care Guide",
        description:
            "How to wash, dry and store cotton trousers and bandhani and leheriya dupattas so they last for years.",
    },
    [ROUTES.trackOrder]: {
        title: "Track Your Order",
        description:
            "Bought a Kalaf piece on Flipkart or Meesho? Track it from your order page on the marketplace you bought from.",
    },
    [ROUTES.contact]: {
        title: "Contact Us",
        description: `Write to the Kalaf team in Jaipur at ${BUSINESS.email}. We reply to every message within one working day.`,
    },
    [ROUTES.faq]: {
        title: "FAQ",
        description:
            "Where to buy Kalaf, why there's no checkout on kalaf.in, sizes, fabric, care, dispatch, delivery, returns, prices and how to reach us.",
    },
    // The link-in-bio page for Instagram and Facebook. Indexable, but left
    // out of the sitemap (see NOT_IN_SITEMAP).
    [ROUTES.links]: {
        title: `${BRAND.name} — links`,
        brandTitle: true,
        description:
            "Kalaf's links in one place: shop the cotton trousers and bandhani dupattas, chat on WhatsApp, or follow us on Instagram.",
    },
};

// Prerendered and indexable, but utility pages, not content for the sitemap.
const NOT_IN_SITEMAP: string[] = [ROUTES.links];

// Static pages with JSON-LD of their own.
const STATIC_JSON_LD: Record<string, () => JsonLd[]> = {
    [ROUTES.faq]: () => [faqPage()],
};

const COLLECTION_HEAD: Record<
    CollectionHandle,
    { title: string; description: string }
> = {
    pants: {
        title: "Cotton Trousers from Jaipur",
        description:
            "Relaxed 100% cotton trousers with an elastic waist and straight leg, made in Jaipur. Shop every colour on Flipkart.",
    },
    dupattas: {
        title: "Bandhani Dupattas from Jaipur",
        description:
            "Bandhani and leheriya dupattas from Jaipur, with and without a gota border. Full length, in every colour, on Flipkart and Meesho.",
    },
};

const HOME = {
    title: `${BRAND.name} — Cotton Trousers & Bandhani Dupattas from Jaipur`,
    description:
        "Kalaf is a Jaipur fashion label: relaxed 100% cotton trousers and bandhani and leheriya dupattas. Buy on Flipkart and Meesho.",
};

const SHOP_ALL = {
    title: "Shop Cotton Trousers & Bandhani Dupattas",
    description:
        "Every Kalaf piece in one place: cotton relaxed trousers and bandhani and leheriya dupattas from Jaipur. Filter by colour, fabric and size.",
};

function liveStores(variant: Variant) {
    return Object.entries(variant.links).filter(
        (entry): entry is [string, string] => Boolean(entry[1])
    );
}

function base(
    path: string,
    title: string,
    description: string,
    extra: Partial<SeoData> = {}
): SeoData {
    return {
        title,
        description: clip(description),
        canonical: absolute(path),
        url: absolute(path),
        image: absolute(DEFAULT_IMAGE),
        type: "website",
        noindex: false,
        jsonLd: [],
        ...extra,
    };
}

function breadcrumbs(items: [string, string][]): JsonLd {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map(([name, path], i) => ({
            "@type": "ListItem",
            position: i + 1,
            name,
            item: absolute(path),
        })),
    };
}

function itemList(products: Product[]): JsonLd {
    return {
        "@context": "https://schema.org",
        "@type": "ItemList",
        itemListElement: products.map((p, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: p.title,
            url: absolute(productPath(p.handle)),
        })),
    };
}

function organization(): JsonLd {
    const a = BUSINESS.address;
    return {
        "@context": "https://schema.org",
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: BRAND.name,
        legalName: BUSINESS.legal_name,
        url: SITE_URL,
        logo: absolute(LOGO),
        email: BUSINESS.email,
        ...(BUSINESS.phone ? { telephone: BUSINESS.phone } : {}),
        taxID: BUSINESS.gstin,
        address: {
            "@type": "PostalAddress",
            streetAddress: `${a.line1}, ${a.line2}`,
            addressLocality: a.city,
            addressRegion: a.state,
            postalCode: a.pincode,
            addressCountry: "IN",
        },
        sameAs: Object.values(SOCIAL),
    };
}

// FAQPage from the FAQ page's own questions and plain-text answers.
function faqPage(): JsonLd {
    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: FAQ_ENTRIES.map(({ q, a }) => ({
            "@type": "Question",
            name: q,
            acceptedAnswer: { "@type": "Answer", text: a },
        })),
    };
}

function website(): JsonLd {
    return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: BRAND.name,
        url: SITE_URL,
        publisher: { "@id": `${SITE_URL}/#organization` },
        inLanguage: "en-IN",
    };
}

function productSeo(product: Product, colour: string | null): SeoData {
    const chosen = product.variants.find((v) => v.colourCode === colour);
    const variant = chosen ?? product.variants[0];
    const path = productPath(product.handle);
    const url = absolute(productPath(product.handle, chosen?.colourCode));
    const stores = liveStores(variant);
    const storeNames = stores.map(([id]) => storeName(id));
    const collection = COLLECTIONS[product.collection];

    const title = chosen
        ? `${product.title} — ${chosen.colour}`
        : product.title;
    const where = storeNames.length ? ` on ${storeNames.join(" and ")}` : "";
    const which = chosen
        ? chosen.colour
        : product.variants.length > 1
          ? `${product.variants.length} colours`
          : product.variants[0].colour;
    const description = `${product.title} in ${which}, ${formatRupees(variant.price)}${where}. ${product.description}`;

    // One ProductGroup for the piece, with every colour as its own Product
    // variant and offers, so search engines see all colours, not just one.
    const group: JsonLd = {
        "@context": "https://schema.org",
        "@type": "ProductGroup",
        "@id": `${absolute(path)}#product`,
        name: product.title,
        description: product.description,
        productGroupID: product.code,
        brand: { "@type": "Brand", name: BRAND.name },
        ...(product.fabric ? { material: product.fabric } : {}),
        url: absolute(path),
        variesBy: "https://schema.org/color",
        hasVariant: product.variants.map((v) => variantJsonLd(product, v)),
    };

    return base(path, title + SUFFIX, description, {
        url,
        type: "product",
        image: absolute(variant.images[0]?.srcLarge ?? DEFAULT_IMAGE),
        jsonLd: [
            group,
            breadcrumbs([
                ["Home", ROUTES.home],
                [collection.title, collectionPath(product.collection)],
                [product.title, path],
            ]),
        ],
    });
}

function variantJsonLd(product: Product, v: Variant): JsonLd {
    const inStock = v.stock === null || v.stock > 0;
    return {
        "@type": "Product",
        name: `${product.title} — ${v.colour}`,
        sku: v.sku,
        color: v.colour,
        image: v.images.map((img) => absolute(img.srcLarge)),
        url: absolute(productPath(product.handle, v.colourCode)),
        offers: liveStores(v).map(([id, link]) => ({
            "@type": "Offer",
            url: link,
            priceCurrency: "INR",
            price: (v.prices[id as keyof Variant["prices"]] ?? v.price).toFixed(
                2
            ),
            availability: inStock
                ? "https://schema.org/InStock"
                : "https://schema.org/OutOfStock",
            itemCondition: "https://schema.org/NewCondition",
            seller: { "@type": "Organization", name: BUSINESS.legal_name },
        })),
    };
}

export function notFoundSeo(path: string): SeoData {
    return base(
        path,
        `Page not found${SUFFIX}`,
        "This page doesn't exist. Browse Kalaf cotton trousers and bandhani dupattas from Jaipur instead.",
        { noindex: true }
    );
}

/** Head data for a pathname (+ optional query string such as "?colour=BK"). */
export function seoFor(pathname: string, search = ""): SeoData {
    const path = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
    const params = new URLSearchParams(search);

    if (path === ROUTES.home) {
        return base(path, HOME.title, HOME.description, {
            jsonLd: [organization(), website()],
        });
    }

    if (path === ROUTES.products) {
        return base(path, SHOP_ALL.title + SUFFIX, SHOP_ALL.description, {
            jsonLd: [
                itemList(PRODUCTS),
                breadcrumbs([
                    ["Home", ROUTES.home],
                    ["Shop all", ROUTES.products],
                ]),
            ],
        });
    }

    const page = STATIC_PAGES[path];
    if (page) {
        const title = page.brandTitle ? page.title : page.title + SUFFIX;
        return base(path, title, page.description, {
            jsonLd: STATIC_JSON_LD[path]?.() ?? [],
        });
    }

    const collectionMatch = path.match(/^\/collections\/([^/]+)$/);
    if (collectionMatch && collectionMatch[1] in COLLECTIONS) {
        const handle = collectionMatch[1] as CollectionHandle;
        const head = COLLECTION_HEAD[handle];
        const products = PRODUCTS.filter((p) => p.collection === handle);
        const cover = products[0]?.variants[0]?.images[0]?.srcLarge;
        return base(path, head.title + SUFFIX, head.description, {
            image: absolute(cover ?? DEFAULT_IMAGE),
            jsonLd: [
                itemList(products),
                breadcrumbs([
                    ["Home", ROUTES.home],
                    [COLLECTIONS[handle].title, path],
                ]),
            ],
        });
    }

    const productMatch = path.match(/^\/products\/([^/]+)$/);
    const product = productMatch && findProduct(productMatch[1]);
    if (product) return productSeo(product, params.get("colour"));

    return notFoundSeo(path);
}

/** Every URL the build prerenders (and lists in sitemap.xml). */
export function prerenderPaths(): string[] {
    return [
        ROUTES.home,
        ROUTES.products,
        ...(Object.keys(COLLECTIONS) as CollectionHandle[]).map(collectionPath),
        ...PRODUCTS.map((p) => productPath(p.handle)),
        ...Object.keys(STATIC_PAGES),
    ];
}

const escapeHtml = (s: string) =>
    s
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");

/** JSON for a <script type="application/ld+json">, safe inside HTML. */
export const jsonLdText = (items: JsonLd[]) =>
    JSON.stringify(items.length === 1 ? items[0] : items).replace(
        /</g,
        "\\u003c"
    );

/** Name/property → content pairs shared by <Seo /> and the static head. */
export function metaTags(seo: SeoData): [string, string, string][] {
    return [
        ["name", "description", seo.description],
        ...(seo.noindex
            ? ([["name", "robots", "noindex"]] as [string, string, string][])
            : []),
        ["property", "og:site_name", BRAND.name],
        ["property", "og:type", seo.type],
        ["property", "og:title", seo.title],
        ["property", "og:description", seo.description],
        ["property", "og:url", seo.url],
        ["property", "og:image", seo.image],
        ["property", "og:locale", "en_IN"],
        ["name", "twitter:card", "summary_large_image"],
        ["name", "twitter:title", seo.title],
        ["name", "twitter:description", seo.description],
        ["name", "twitter:image", seo.image],
    ];
}

/** The same tags as static HTML, for prerendered files. Marked data-seo so
 *  main.tsx can swap them for React's managed copies on load. */
export function headHtml(seo: SeoData): string {
    const lines = [
        `<title data-seo>${escapeHtml(seo.title)}</title>`,
        ...metaTags(seo).map(
            ([attr, key, content]) =>
                `<meta data-seo ${attr}="${key}" content="${escapeHtml(content)}" />`
        ),
    ];
    if (!seo.noindex) {
        lines.push(
            `<link data-seo rel="canonical" href="${escapeHtml(seo.canonical)}" />`
        );
    }
    if (seo.jsonLd.length) {
        lines.push(
            `<script data-seo type="application/ld+json">${jsonLdText(seo.jsonLd)}</script>`
        );
    }
    return lines.join("\n        ");
}

/** llms.txt (llmstxt.org): a plain summary of the brand for AI assistants,
 *  built only from catalog.json and business.json. */
export function llmsTxt(): string {
    const b = BUSINESS;
    const storesFor = (products: Product[]) => {
        const s = new Set<string>();
        products.forEach((p) =>
            p.variants.forEach((v) =>
                liveStores(v).forEach(([id]) => s.add(storeName(id)))
            )
        );
        return [...s];
    };

    // "pants on Flipkart and dupattas on Flipkart and Meesho"
    const byCollection = [...new Set(PRODUCTS.map((p) => p.collection))]
        .map((c) => {
            const stores = storesFor(
                PRODUCTS.filter((p) => p.collection === c)
            );
            return stores.length ? `${c} on ${stores.join(" and ")}` : "";
        })
        .filter(Boolean)
        .join(", and ");

    const productLines = PRODUCTS.map((p) => {
        const prices = p.variants.flatMap((v) =>
            Object.values(v.prices).concat(v.price)
        );
        const lo = Math.min(...prices);
        const hi = Math.max(...prices);
        const price =
            lo === hi
                ? formatRupees(lo)
                : `${formatRupees(lo)}–${formatRupees(hi)}`;
        const stores = storesFor([p]);
        const parts = [
            p.fabric,
            p.sizes.length ? `sizes ${p.sizes.join(", ")}` : p.size,
            `colours: ${p.variants.map((v) => v.colour).join(", ")}`,
            price,
            stores.length
                ? `buy on ${stores.join(" or ")}`
                : "not on sale right now",
        ].filter(Boolean);
        return `- [${p.title}](${absolute(productPath(p.handle))}): ${parts.join("; ")}`;
    });

    const extra = b as unknown as Record<string, unknown>;
    const whatsapp = typeof extra.whatsapp === "string" ? extra.whatsapp : null;
    const help: [string, string][] = [
        ["Shipping & returns", ROUTES.shippingReturns],
        ["Size guide", ROUTES.sizeGuide],
        ["Care guide", ROUTES.careGuide],
        ["Refund policy", ROUTES.refundPolicy],
        ["Contact", ROUTES.contact],
        ["FAQ", ROUTES.faq],
    ];
    const a = b.address;

    return [
        `# ${b.trade_name}`,
        "",
        `> ${b.trade_name} is a fashion label from ${a.city}, ${a.state}, ${a.country}, run by ${b.legal_name} (${b.constitution.toLowerCase()}, GSTIN ${b.gstin}). It sells ${byCollection}. ${SITE_URL.replace("https://", "")} is a catalogue only: there is no cart or checkout on the site, and every order is placed, shipped and refunded by the marketplace.`,
        "",
        "## Products",
        "",
        ...productLines,
        "",
        "## Help",
        "",
        ...help.map(([name, path]) => `- [${name}](${absolute(path)})`),
        "",
        "## Contact",
        "",
        `- Email: ${b.email}`,
        ...(b.phone ? [`- Phone: ${b.phone}`] : []),
        ...(whatsapp ? [`- WhatsApp: ${whatsapp}`] : []),
        `- Address: ${a.line1}, ${a.line2}, ${a.city}, ${a.state} ${a.pincode}, ${a.country}`,
        "",
    ].join("\n");
}

/** The prerendered URLs that go in sitemap.xml. */
export function sitemapPaths(): string[] {
    return prerenderPaths().filter((p) => !NOT_IN_SITEMAP.includes(p));
}

export function sitemapXml(lastmod: string): string {
    const urls = sitemapPaths()
        .map(
            (p) =>
                `  <url><loc>${absolute(p)}</loc><lastmod>${lastmod}</lastmod></url>`
        )
        .join("\n");
    return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

export function robotsTxt(): string {
    return `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`;
}
