import type { PolicyData } from "../../components/PolicyLayout";
import { BRAND, MARKETPLACE_ORDERS } from "../../constants";

export const data: PolicyData = {
    eyebrow: "Policy 02",
    title: "Shipping & returns",
    ornament: "नियम",
    summary:
        "Kalaf pieces are sold and fulfilled by Amazon, Flipkart, and Myntra. Each marketplace ships and accepts returns under its own policy — here's how that breaks down.",
    updated: "23 May 2026",
    readTime: "2 min read",
    promises: [
        {
            kicker: "3 ways",
            label: "Three marketplaces",
            body: "Buy from Amazon, Flipkart, or Myntra — whichever account you already shop with.",
        },
        {
            kicker: "Theirs",
            label: "Their courier, their SLA",
            body: "Shipping speed, delivery dates, and packaging are set by the marketplace, not by us.",
        },
        {
            kicker: "₹ 0",
            label: "Returns are free",
            body: "All three marketplaces offer free return pickups for fashion. Start it from Your Orders.",
        },
    ],
    sections: [
        {
            id: "ship",
            title: "Shipping",
            body: [
                {
                    kind: "p",
                    text: "Once you place an order on Amazon, Flipkart, or Myntra, that marketplace handles the courier, the tracking, and the delivery promise. We dispatch from Jaipur to their fulfilment partners; from there, their SLA takes over.",
                },
                {
                    kind: "list",
                    items: [
                        "Standard delivery is typically 4–6 working days across India on all three platforms.",
                        "Amazon Prime and Flipkart Plus accounts often see 1–3 day delivery to metro pincodes.",
                        "Live tracking sits inside each marketplace's order page — we don't send a separate email.",
                    ],
                },
            ],
            callout: {
                label: "Track an order",
                value: "Open Your Orders on the marketplace you bought from.",
            },
        },
        {
            id: "returns",
            title: "Returns",
            body: [
                {
                    kind: "p",
                    text: "Each marketplace runs its own return window and inspection process. Start the return from Your Orders on the marketplace where you bought it.",
                },
                {
                    kind: "links",
                    items: [
                        {
                            label: "Amazon",
                            href: MARKETPLACE_ORDERS.amazon,
                            sub: "7–30 day window · free pickup",
                        },
                        {
                            label: "Flipkart",
                            href: MARKETPLACE_ORDERS.flipkart,
                            sub: "7–10 day window · free pickup",
                        },
                        {
                            label: "Myntra",
                            href: MARKETPLACE_ORDERS.myntra,
                            sub: "30 day window · free pickup",
                        },
                    ],
                },
                {
                    kind: "p",
                    text: "The exact window is shown on the order page itself — check there before sending it back.",
                },
            ],
            steps: [
                "Open Your Orders on the marketplace and pick the Kalaf piece.",
                "Choose 'Return' and select a reason — they'll book a courier pickup.",
                "Pack the piece unworn, tag intact, in the original delivery bag if you can.",
                "Refund moves once the marketplace inspects and accepts the return.",
            ],
        },
        {
            id: "exchange",
            title: "Exchanges",
            body: [
                {
                    kind: "p",
                    text: "Wrong size? Amazon, Flipkart, and Myntra all support free size exchanges directly from the order page — no need to return and reorder.",
                },
                {
                    kind: "p",
                    text: "For a different colour or piece entirely, return the original for refund and place a fresh order. It's faster than waiting for an exchange to route.",
                },
            ],
        },
        {
            id: "noreturn",
            title: "What can't be returned",
            body: [
                {
                    kind: "list",
                    items: [
                        "Anything visibly worn, washed, or with the marketplace tag removed.",
                        "Pieces returned after the marketplace's return window has closed.",
                        "Items marked as final-sale on the product page — usually our last few units.",
                    ],
                },
            ],
        },
        {
            id: "damaged",
            title: "If something arrives damaged",
            body: [
                {
                    kind: "p",
                    text: "Raise it inside the marketplace first — they own the courier relationship and will replace or refund without a return shipment in most cases.",
                },
                {
                    kind: "p",
                    text: `If you can't get it sorted there, email ${BRAND.email} with the order ID, marketplace name, and a photo within 48 hours of delivery. We'll chase it on your behalf.`,
                },
            ],
            callout: { label: "Write to", value: BRAND.email },
        },
    ],
};
