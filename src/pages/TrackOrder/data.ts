import type { PolicyData } from "../../components/PolicyLayout";
import { BRAND, MARKETPLACE_ORDERS } from "../../constants";

export const data: PolicyData = {
    eyebrow: "Orders",
    title: "Track order",
    ornament: "पार्सल",
    summary:
        "Kalaf orders are placed and delivered through Flipkart and Meesho. Each one has its own tracking, so open the marketplace you bought from.",
    updated: "14 Nov 2026",
    readTime: "1 min read",
    crossLinksHeader: "More guides",
    sections: [
        {
            id: "where",
            title: "Where you bought it is where you track it",
            body: [
                {
                    kind: "p",
                    text: "Tap the marketplace you ordered from to open your orders. Sign in with the account you used to place the order.",
                },
                {
                    kind: "links",
                    items: [
                        {
                            label: "Flipkart",
                            href: MARKETPLACE_ORDERS.flipkart,
                            sub: "My Orders · pants & dupattas",
                        },
                        {
                            label: "Meesho",
                            href: MARKETPLACE_ORDERS.meesho,
                            sub: "My Orders · dupattas",
                        },
                    ],
                },
            ],
        },
        {
            id: "statuses",
            title: "What each status means",
            body: [
                {
                    kind: "list",
                    items: [
                        "Ordered — the marketplace has your order and has passed it to us to pack.",
                        "Shipped — we've handed it to the courier, and tracking is live on the marketplace.",
                        "Out for delivery — it's with the courier in your area today.",
                        "Delivered — the courier has marked it delivered at your address.",
                    ],
                },
            ],
        },
        {
            id: "delays",
            title: "If there's a delay",
            body: [
                {
                    kind: "p",
                    text: "The marketplace shows the expected delivery date on your order page. If it has passed, or tracking hasn't moved for a couple of days, raise it on the marketplace first — they manage the courier.",
                },
            ],
        },
        {
            id: "help",
            title: "Still stuck?",
            body: [
                {
                    kind: "p",
                    text: `Write to us at ${BRAND.email} with the marketplace, the order ID and a screenshot of the tracking page. We'll follow it up with the marketplace for you.`,
                },
            ],
            callout: { label: "Write to us", value: BRAND.email },
        },
    ],
};
