import type { PolicyData } from "../../components/PolicyLayout";
import { BRAND } from "../../constants";

export const data: PolicyData = {
    eyebrow: "Support",
    title: "Contact us",
    ornament: "संपर्क",
    summary:
        "We're a small team in Jaipur. Email is fastest. We reply to every message within one working day.",
    updated: "23 May 2026",
    readTime: "1 min read",
    crossLinksHeader: "More guides",
    promises: [
        {
            kicker: "1 d",
            label: "Response time",
            body: "We reply to all emails within one working day, Monday to Saturday.",
        },
        {
            kicker: "Human",
            label: "Support",
            body: "Every reply comes from a real person on the team — not a bot.",
        },
        {
            kicker: "Jaipur",
            label: "Based in",
            body: "We're a small team in Jaipur. IST is our timezone — 10am–7pm, Mon–Sat.",
        },
    ],
    sections: [
        {
            id: "write",
            title: "Write to us",
            body: [
                {
                    kind: "p",
                    text: "Email is the fastest way to reach the team. We don't run a phone line — email lets us give you a considered, accurate reply rather than a rushed one.",
                },
            ],
            callout: { label: "Email", value: BRAND.email },
        },
        {
            id: "include",
            title: "What to include",
            body: [
                {
                    kind: "p",
                    text: "Include your order number in any message about an existing order. It speeds up the reply considerably.",
                },
                {
                    kind: "list",
                    items: [
                        "Order number (starts with KLF-)",
                        "The email address you placed the order with.",
                        "A brief description of what you need.",
                    ],
                },
            ],
        },
        {
            id: "returns",
            title: "Returns & exchanges",
            body: [
                {
                    kind: "p",
                    text: "See our Shipping & Returns page for the full process. If you'd like to start a return, reply directly to your order confirmation email — that's the fastest route.",
                },
            ],
        },
        {
            id: "hours",
            title: "Response time",
            body: [
                {
                    kind: "p",
                    text: "We reply to all emails within one working day. On weekends and public holidays, we're back to you the next working day.",
                },
            ],
            callout: {
                label: "Working hours",
                value: BRAND.workingHours,
            },
        },
    ],
};
