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
                    text: "Tell us which marketplace you bought from (Amazon, Flipkart, or Myntra) and paste the order ID — that's the fastest path to a useful reply.",
                },
                {
                    kind: "list",
                    items: [
                        "The marketplace name (Amazon / Flipkart / Myntra).",
                        "The marketplace order ID, copied from Your Orders.",
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
                    text: "Returns and exchanges are handled by the marketplace where you bought the piece — start from Your Orders on Amazon, Flipkart, or Myntra. The Shipping & Returns page walks through what each marketplace covers. If you've already tried there and hit a wall, write to us and we'll chase it.",
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
