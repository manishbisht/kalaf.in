import type { PolicyData } from "../../components/PolicyLayout";
import { BRAND, MARKETPLACE_ORDERS } from "../../constants";

export const data: PolicyData = {
    eyebrow: "Policy 04",
    title: "Refund policy",
    ornament: "वापसी",
    summary:
        "Kalaf pieces are sold through Amazon, Flipkart, and Myntra. Refunds are issued by the marketplace where you bought the piece, against the original payment method.",
    updated: "23 May 2026",
    readTime: "2 min read",
    promises: [
        {
            kicker: "Theirs",
            label: "Marketplace processed",
            body: "The refund is initiated and paid by the marketplace, not by us — that's how marketplace seller-of-record works.",
        },
        {
            kicker: "Same",
            label: "Original payment method",
            body: "The amount returns to the card, UPI, or wallet you originally paid with.",
        },
        {
            kicker: "5–7 d",
            label: "Typical timeline",
            body: "From the day the marketplace accepts the return to the day the money lands in your account.",
        },
    ],
    sections: [
        {
            id: "eligibility",
            title: "Eligibility",
            body: [
                {
                    kind: "p",
                    text: "Each marketplace defines what's returnable and the window it accepts returns within. The exact rules sit on each order page — but the standards across all three are consistent:",
                },
                {
                    kind: "list",
                    items: [
                        "Unworn and in original condition.",
                        "Original packaging and the marketplace tag intact — not the brand label sewn into the garment.",
                        "Inside the marketplace's return window (typically 7–30 days from delivery).",
                        "Not marked as final-sale on the product page.",
                    ],
                },
            ],
        },
        {
            id: "request",
            title: "How to request a refund",
            body: [
                {
                    kind: "p",
                    text: "Open Your Orders on the marketplace you bought from and choose 'Return' or 'Refund' on the Kalaf piece. The marketplace handles the rest.",
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
            steps: [
                "Open the order on the marketplace and select Return / Refund.",
                "Pick a reason and confirm the pickup address.",
                "Hand the piece (unworn, tag intact) to the courier when they arrive.",
                "Refund is initiated once the return is inspected and accepted.",
            ],
        },
        {
            id: "timeline",
            title: "Timeline",
            body: [
                {
                    kind: "p",
                    text: "Standard refund processing is 5–7 working days from the day the marketplace accepts the return. Bank settlement adds another 1–3 days depending on the payment method.",
                },
                {
                    kind: "p",
                    text: "The refund always goes back to the original payment method — you can't redirect it to a different card or wallet.",
                },
            ],
            callout: { label: "Refund arrives in", value: "5–10 days total." },
        },
        {
            id: "exceptions",
            title: "What can't be refunded",
            body: [
                {
                    kind: "list",
                    items: [
                        "Items marked Final Sale on the product page.",
                        "Anything visibly worn, washed, or with the marketplace tag removed.",
                        "Returns submitted after the marketplace's return window has closed.",
                    ],
                },
                {
                    kind: "p",
                    text: `If a piece arrives damaged, raise it inside the marketplace within 48 hours. If you can't get it sorted there, write to ${BRAND.email} with the order ID and a photo and we'll chase it for you.`,
                },
            ],
            callout: {
                label: "Damaged on arrival?",
                value: `${BRAND.email} — within 48 hours.`,
            },
        },
    ],
};
