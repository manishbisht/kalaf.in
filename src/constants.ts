// Centralised brand/site constants. Change once, propagates everywhere.

import { BUSINESS, BUSINESS_ADDRESS } from "./data/business";

// Legal and contact details come from src/data/business.json (synced from the
// products repo). Kalaf Apparels is a partnership firm, not a company, so there's no company
// registration number to show.
export const BRAND = {
    name: BUSINESS.trade_name,
    wordmark: "kalaf.in",
    devanagari: "कलफ",
    legalName: BUSINESS.legal_name,
    constitution: BUSINESS.constitution,
    gstin: BUSINESS.gstin,
    address: BUSINESS_ADDRESS,
    location: `${BUSINESS.address.city}, ${BUSINESS.address.state}, ${BUSINESS.address.country}`,
    email: BUSINESS.email,
    phone: BUSINESS.phone,
    whatsapp: BUSINESS.whatsapp,
    workingHours: "Mon–Sat, 10am–7pm IST",
    copyrightYear:
        typeof __BUILD_YEAR__ === "number"
            ? __BUILD_YEAR__
            : new Date().getFullYear(),
} as const;

// "+91 79768 47772" → "tel:+917976847772" and "https://wa.me/917976847772".
export const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;
export const whatsappHref = (phone: string) =>
    `https://wa.me/${phone.replace(/\D/g, "")}`;

export const SOCIAL = {
    facebook: "https://facebook.com/kalaf.india",
    instagram: "https://www.instagram.com/kalaf.india",
    linkedin: "https://www.linkedin.com/company/kalafindia/",
    x: "https://x.com/kalafindia",
} as const;

// Where to send people who bought on a marketplace and want to track an order.
export const MARKETPLACE_ORDERS = {
    flipkart: "https://www.flipkart.com/account/orders",
    meesho: "https://www.meesho.com/",
} as const;

export const ROUTES = {
    home: "/",
    shippingReturns: "/shipping-returns",
    privacy: "/privacy",
    terms: "/terms",
    refundPolicy: "/refund-policy",
    cookies: "/cookies",
    sizeGuide: "/size-guide",
    careGuide: "/care-guide",
    trackOrder: "/track-order",
    contact: "/contact",
    faq: "/faq",
    links: "/links",
    products: "/products",
    product: "/products/:handle",
    collection: "/collections/:handle",
} as const;

export const productPath = (handle: string, colour?: string) =>
    `/products/${handle}${colour ? `?colour=${colour}` : ""}`;
export const collectionPath = (handle: string) => `/collections/${handle}`;
