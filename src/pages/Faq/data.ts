import type { PolicyData } from "../../components/PolicyLayout";
import { BRAND, ROUTES } from "../../constants";
import { BUSINESS } from "../../data/business";
import {
    MARKETPLACES,
    PRODUCTS,
    type CollectionHandle,
} from "../../data/catalog";

// Every answer is built from the catalog and BRAND, so it stays true when the
// products repo changes. The answers are plain text because the same strings
// go into the FAQPage JSON-LD (src/seo).

// "a", "a or b", "a, b or c"
function joinWords(words: string[], last: "and" | "or") {
    if (words.length < 2) return words.join("");
    return `${words.slice(0, -1).join(", ")} ${last} ${words[words.length - 1]}`;
}

const inCollection = (c: CollectionHandle) =>
    PRODUCTS.filter((p) => p.collection === c);

// Stores with a live link for at least one piece in the collection.
const storesFor = (c: CollectionHandle) =>
    MARKETPLACES.filter((m) =>
        inCollection(c).some((p) => p.variants.some((v) => v.links[m.id]))
    ).map((m) => m.name);

const PANT = PRODUCTS.find((p) => p.code === "PNT");
const DUPATTAS = inCollection("dupattas");
const PANT_STORES = joinWords(storesFor("pants"), "or");
const DUPATTA_STORES = joinWords(storesFor("dupattas"), "or");
const ALL_STORES = joinWords(
    MARKETPLACES.filter((m) =>
        PRODUCTS.some((p) => p.variants.some((v) => v.links[m.id]))
    ).map((m) => m.name),
    "and"
);

const PANT_SIZES = joinWords(PANT?.sizes ?? [], "and");
const DUPATTA_SIZE = DUPATTAS[0]?.size;

// Working days from order to dispatch (the slowest piece in the collection).
const dispatchDays = (c: CollectionHandle) =>
    Math.max(0, ...inCollection(c).map((p) => p.dispatchDays ?? 0));
const PANT_DAYS = dispatchDays("pants");
const DUPATTA_DAYS = dispatchDays("dupattas");
const days = (n: number) => `${n} working ${n === 1 ? "day" : "days"}`;

// "Bandhani Dupatta and …: artificial silk (taffeta). Chiffon …: chiffon."
const DUPATTA_FABRICS = [
    ...new Set(DUPATTAS.map((p) => p.fabric).filter((f) => f !== null)),
]
    .map(
        (fabric) =>
            `${joinWords(
                DUPATTAS.filter((p) => p.fabric === fabric).map((p) => p.title),
                "and"
            )}: ${fabric.toLowerCase()}.`
    )
    .join(" ");

// Does any piece cost a different amount on different stores right now?
const PRICES_DIFFER = PRODUCTS.some((p) =>
    p.variants.some((v) => new Set(Object.values(v.prices)).size > 1)
);

// "WhatsApp or call +91 …, or email hello@kalaf.in"
const NUMBERS =
    BRAND.whatsapp && BRAND.whatsapp === BRAND.phone
        ? [`WhatsApp or call ${BRAND.phone}`]
        : [
              BRAND.whatsapp && `WhatsApp ${BRAND.whatsapp}`,
              BRAND.phone && `call ${BRAND.phone}`,
          ].filter((x): x is string => Boolean(x));
const CONTACT = [...NUMBERS, `email ${BRAND.email}`].join(", or ");

export const data: PolicyData = {
    eyebrow: "Help",
    title: "Questions & answers",
    ornament: "प्रश्न",
    summary: `Quick answers about buying Kalaf on ${ALL_STORES}, sizes, fabric, delivery and returns. Can't find yours? Write to us.`,
    updated: "14 Nov 2026",
    readTime: "3 min read",
    crossLinksHeader: "More guides",
    sections: [
        {
            id: "buying",
            title: "Buying",
            body: [
                {
                    kind: "qa",
                    q: "Where can I buy Kalaf?",
                    a: `On the marketplaces. Our pant is sold on ${PANT_STORES}, and our dupattas on ${DUPATTA_STORES}. Every Buy button on kalaf.in takes you to that piece's listing on the store.`,
                    links: [{ label: "Shop all", href: ROUTES.products }],
                },
                {
                    kind: "qa",
                    q: "Why can't I check out on kalaf.in?",
                    a: `kalaf.in is our catalogue, not a shop. We sell through ${ALL_STORES}, so you place your order, pay and get delivery, returns and refunds there, under the marketplace's own policies.`,
                },
                {
                    kind: "qa",
                    q: "Can the price be different on each store?",
                    a: `Yes. Each store sets its own price and runs its own offers${PRICES_DIFFER ? ", so the same piece can be priced differently on each; when it is, each Buy button shows that store's price" : ""}. The prices on kalaf.in are the stores' listed prices, and the price on the marketplace at checkout is the one you pay.`,
                },
                {
                    kind: "qa",
                    q: "How do I pay?",
                    a: "You pay the marketplace, with whichever payment options it offers at checkout. We never take payment on kalaf.in.",
                },
            ],
        },
        {
            id: "sizes",
            title: "Sizes, fabric & care",
            body: [
                {
                    kind: "qa",
                    q: "What sizes does the pant come in?",
                    a: `Waist sizes ${PANT_SIZES}, in inches. The waistband is elastic all the way round, so choose your usual waist size. The size guide has the waist and hip chart and how to measure.`,
                    links: [{ label: "Size guide", href: ROUTES.sizeGuide }],
                },
                ...(DUPATTA_SIZE
                    ? [
                          {
                              kind: "qa" as const,
                              q: "How big are the dupattas?",
                              a: `Every dupatta is one size: ${DUPATTA_SIZE}, a full-length drape.`,
                          },
                      ]
                    : []),
                {
                    kind: "qa",
                    q: "What are Kalaf pieces made of?",
                    a: [
                        PANT?.fabric && `${PANT.title}: ${PANT.fabric}.`,
                        DUPATTA_FABRICS,
                    ]
                        .filter(Boolean)
                        .join(" "),
                },
                {
                    kind: "qa",
                    q: "How do I wash and care for Kalaf pieces?",
                    a: "The care guide covers washing, drying, ironing and storing both the pant and the dupattas.",
                    links: [{ label: "Care guide", href: ROUTES.careGuide }],
                },
            ],
        },
        {
            id: "orders",
            title: "Orders & delivery",
            body: [
                {
                    kind: "qa",
                    q: "How soon will my order ship?",
                    a: `We pack every order in ${BUSINESS.address.city} and hand it to the marketplace's courier within ${days(PANT_DAYS)} for the pant and ${days(DUPATTA_DAYS)} for dupattas. The marketplace shows the expected delivery date when you order.`,
                },
                {
                    kind: "qa",
                    q: "Who handles delivery, returns and refunds?",
                    a: "The marketplace you bought from, under its own policy. Start a return from your orders there; refunds go back through the marketplace. If you get stuck, write to us with the order ID and we'll follow it up.",
                    links: [
                        {
                            label: "Shipping & returns",
                            href: ROUTES.shippingReturns,
                        },
                        { label: "Refund policy", href: ROUTES.refundPolicy },
                    ],
                },
                {
                    kind: "qa",
                    q: "How do I track my order?",
                    a: "From your orders on the marketplace you bought from. Each store tracks its own deliveries.",
                    links: [{ label: "Track order", href: ROUTES.trackOrder }],
                },
            ],
        },
        {
            id: "kalaf",
            title: "About Kalaf",
            body: [
                {
                    kind: "qa",
                    q: "How do I contact you?",
                    a: `${CONTACT.charAt(0).toUpperCase()}${CONTACT.slice(1)}. We aim to reply within one working day; our hours are ${BRAND.workingHours}.`,
                    links: [{ label: "Contact us", href: ROUTES.contact }],
                },
                {
                    kind: "qa",
                    q: "Where is Kalaf based?",
                    a: `In ${BRAND.location}. Kalaf is run by ${BRAND.legalName}, a ${BRAND.constitution.toLowerCase()}, from ${BRAND.address}.`,
                },
            ],
        },
    ],
};

/** Every question and plain-text answer, in page order (for JSON-LD). */
export const FAQ_ENTRIES = data.sections.flatMap((s) =>
    s.body.flatMap((b) => (b.kind === "qa" ? [{ q: b.q, a: b.a }] : []))
);
