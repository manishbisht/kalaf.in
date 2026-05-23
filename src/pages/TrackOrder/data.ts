import type { PolicyData } from "../../components/PolicyLayout";
import { BRAND } from "../../constants";

export const data: PolicyData = {
    eyebrow: "Orders",
    title: "Track order",
    ornament: "पार्सल",
    summary:
        "Every shipment leaves Jaipur with a live tracking link. Here's how to find it and what each status means.",
    updated: "23 May 2026",
    readTime: "2 min read",
    crossLinksHeader: "More guides",
    sections: [
        {
            id: "find",
            title: "Finding your link",
            body: [
                {
                    kind: "p",
                    text: "Your tracking link arrives in a separate 'Your order has shipped' email, usually within 30 minutes of the courier scanning the package.",
                },
                {
                    kind: "p",
                    text: "You can also find it by logging into your account and opening the relevant order.",
                },
            ],
            callout: {
                label: "Didn't get the email?",
                value: `Check your spam folder. Still missing — email ${BRAND.email}.`,
            },
        },
        {
            id: "statuses",
            title: "Order statuses",
            body: [
                {
                    kind: "list",
                    items: [
                        "Processing — we've received your order and are preparing it for dispatch.",
                        "Dispatched — the courier has picked it up and a tracking number is active.",
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
                    text: "Standard delivery takes 4–6 working days across India. Express is 2–3 working days to most metro pincodes.",
                },
                {
                    kind: "p",
                    text: "Delays beyond 7 working days are rare. If your tracking hasn't updated in 48 hours, email us with your order number and we'll chase the courier.",
                },
            ],
        },
        {
            id: "missing",
            title: "Can't find your order?",
            body: [
                {
                    kind: "p",
                    text: `Email ${BRAND.email} with your order number (starts with KLF-) and the email address you placed the order with. We'll trace it.`,
                },
            ],
            callout: { label: "Write to us", value: BRAND.email },
        },
    ],
};
