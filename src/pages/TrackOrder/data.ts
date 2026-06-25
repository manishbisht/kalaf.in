import type { PolicyData } from "../../components/PolicyLayout";
import { BRAND, MARKETPLACE_ORDERS } from "../../constants";

export const data: PolicyData = {
    eyebrow: "Orders",
    title: "Track order",
    ornament: "पार्सल",
    summary:
        "Kalaf pieces are sold and shipped by Amazon, Flipkart, and Myntra. Each one handles its own tracking — open the marketplace you bought from.",
    updated: "23 May 2026",
    readTime: "1 min read",
    crossLinksHeader: "More guides",
    sections: [
        {
            id: "where",
            title: "Where you bought it is where you track it",
            body: [
                {
                    kind: "p",
                    text: "Tap the marketplace you ordered from to open its order history. You'll need to be signed in with the account you used to place the order.",
                },
                {
                    kind: "links",
                    items: [
                        {
                            label: "Amazon",
                            href: MARKETPLACE_ORDERS.amazon,
                            sub: "Your Orders",
                        },
                        {
                            label: "Flipkart",
                            href: MARKETPLACE_ORDERS.flipkart,
                            sub: "My Orders",
                        },
                        {
                            label: "Myntra",
                            href: MARKETPLACE_ORDERS.myntra,
                            sub: "My Orders",
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
                        "Order placed — the marketplace has your order and is sharing it with us for dispatch.",
                        "Dispatched / Shipped — the courier has picked it up; the tracking number is live in the marketplace app.",
                        "Out for delivery — it's on a vehicle in your area today.",
                        "Delivered — the courier has marked it as delivered at your address.",
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
                    text: "Standard delivery on each marketplace is typically 4–6 working days across India; Prime / Plus accounts often see 2–3 days to metros.",
                },
                {
                    kind: "p",
                    text: "Delays beyond 7 working days are rare. If your tracking hasn't updated in 48 hours, raise it inside the marketplace's order page first — they hold the courier relationship.",
                },
            ],
        },
        {
            id: "help",
            title: "Still stuck?",
            body: [
                {
                    kind: "p",
                    text: `Write to us at ${BRAND.email} with the marketplace name, the order ID, and a screenshot of the tracking page. We'll chase it with the marketplace on your behalf.`,
                },
            ],
            callout: { label: "Write to us", value: BRAND.email },
        },
    ],
};
