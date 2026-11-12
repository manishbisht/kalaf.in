// Centralised brand/site constants. Change once, propagates everywhere.

export const BRAND = {
    name: "Kalaf",
    wordmark: "kalaf.in",
    devanagari: "कलफ",
    legalName: "Kalaf Apparels",
    cin: "U17299RJ2024PTC0000",
    location: "Jaipur, Rajasthan, India",
    email: "hello@kalaf.in",
    phone: "+91 141 400 0000",
    workingHours: "Mon–Sat, 10am–7pm IST.",
    copyrightYear: new Date().getFullYear(),
} as const;

export const SOCIAL = {
    facebook: "https://facebook.com/kalaf.india",
    instagram: "https://www.instagram.com/kalaf.india",
    linkedin: "https://www.linkedin.com/company/kalafindia/",
    x: "https://x.com/kalafindia",
} as const;

// Where to send people who bought on a marketplace and want to track an order.
export const MARKETPLACE_ORDERS = {
    amazon: "https://www.amazon.in/your-orders/orders",
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
    products: "/products",
    product: "/products/:handle",
    collection: "/collections/:handle",
} as const;

export const productPath = (handle: string, colour?: string) =>
    `/products/${handle}${colour ? `?colour=${colour}` : ""}`;
export const collectionPath = (handle: string) => `/collections/${handle}`;
