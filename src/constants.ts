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

// Marketplace storefront URLs. Update each to the brand's seller-page URL
// once the listings are live; the search-results URLs below are a usable
// placeholder until then.
export const MARKETPLACES = {
    amazon: "https://www.amazon.in/s?k=kalaf",
    flipkart: "https://www.flipkart.com/search?q=kalaf",
    myntra: "https://www.myntra.com/kalaf",
} as const;

// Where to send people who bought on a marketplace and want to track an order.
export const MARKETPLACE_ORDERS = {
    amazon: "https://www.amazon.in/your-orders/orders",
    flipkart: "https://www.flipkart.com/account/orders",
    myntra: "https://www.myntra.com/my/orders",
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
} as const;
