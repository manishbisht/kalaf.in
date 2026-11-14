import type { PolicyData } from "../../components/PolicyLayout";
import { BRAND, MARKETPLACE_ORDERS } from "../../constants";

export const data: PolicyData = {
    eyebrow: "Policy 04",
    title: "Refund policy",
    ornament: "वापसी",
    summary:
        "Kalaf products are sold through Flipkart and Meesho. Refunds are issued by the marketplace you bought from, under its own return and refund policy.",
    updated: "14 Nov 2026",
    readTime: "2 min read",
    promises: [
        {
            kicker: "Theirs",
            label: "Marketplace processed",
            body: "The marketplace takes your payment, so it also issues the refund.",
        },
        {
            kicker: "Their rules",
            label: "Window & eligibility",
            body: "What can be returned, and for how long, is set by the marketplace and shown on your order page.",
        },
        {
            kicker: "We help",
            label: "If it gets stuck",
            body: "If something goes wrong with a refund, write to us and we'll follow it up with the marketplace.",
        },
    ],
    sections: [
        {
            id: "eligibility",
            title: "Eligibility",
            body: [
                {
                    kind: "p",
                    text: "Flipkart and Meesho each decide what's returnable and for how long. Your order page shows the exact window for your item. As a rule, a return needs to be:",
                },
                {
                    kind: "list",
                    items: [
                        "Unused, unwashed and in its original condition.",
                        "With all tags and the original packaging.",
                        "Requested inside the return window shown on the order page.",
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
                    text: "Open your orders on the marketplace you bought from and choose Return on the Kalaf item. The marketplace arranges the rest.",
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
            steps: [
                "Open the order on the marketplace and select Return.",
                "Pick a reason and confirm the pickup details.",
                "Hand the item, unused and with tags, to the courier.",
                "The marketplace issues the refund once it accepts the return.",
            ],
        },
        {
            id: "timeline",
            title: "Timeline",
            body: [
                {
                    kind: "p",
                    text: "How long a refund takes, and how it's paid back, depends on the marketplace and how you paid. Your order page shows the refund status and expected date.",
                },
            ],
            callout: {
                label: "Refund status",
                value: "Shown on your marketplace order page.",
            },
        },
        {
            id: "damaged",
            title: "Damaged or wrong item",
            body: [
                {
                    kind: "p",
                    text: "If an item arrives damaged, or isn't what you ordered, report it on the marketplace as soon as you can. Marketplaces often have a short window for this, so take photos when you open the parcel.",
                },
                {
                    kind: "p",
                    text: `If you can't get it sorted there, write to ${BRAND.email} with the marketplace, the order ID and a photo, and we'll follow it up for you.`,
                },
            ],
            callout: { label: "Write to us", value: BRAND.email },
        },
    ],
};
