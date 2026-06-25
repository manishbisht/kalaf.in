import type { PolicyData } from "../../components/PolicyLayout";
import { BRAND } from "../../constants";

export const data: PolicyData = {
    eyebrow: "Policy 01",
    title: "Privacy policy",
    ornament: "गोपनीय",
    summary:
        "Most of your purchase data sits with the marketplace you bought from. We collect very little ourselves, and we don't sell any of it.",
    updated: "23 May 2026",
    readTime: "4 min read",
    sections: [
        {
            id: "collect",
            title: "What we collect",
            body: [
                {
                    kind: "p",
                    text: "Kalaf pieces are sold and fulfilled by Amazon, Flipkart, and Myntra. When you buy on a marketplace, your purchase data — name, payment method, account details — sits with that marketplace under its own privacy policy. We never see your payment information.",
                },
                {
                    kind: "p",
                    text: "When the marketplace passes us an order to fulfil, we receive the recipient's name and shipping address only — enough to print a dispatch label. That's the entirety of customer data we hold from a sale.",
                },
                {
                    kind: "p",
                    text: "If you subscribe to our newsletter from this website, we store your email address. If you write to us, we store the message and your reply-to email.",
                },
                {
                    kind: "p",
                    text: "We record basic browsing behaviour on kalaf.in — which pages you visit, how long you spend on them — through first-party analytics.",
                },
            ],
        },
        {
            id: "use",
            title: "How we use it",
            body: [
                {
                    kind: "list",
                    items: [
                        "To dispatch the order to the address the marketplace shared with us.",
                        "To reply to your email if you've written to us.",
                        "To send the Kalaf newsletter, if you've opted in.",
                        "To improve the website based on how people actually use it.",
                    ],
                },
            ],
        },
        {
            id: "sharing",
            title: "Sharing & disclosure",
            body: [
                {
                    kind: "p",
                    text: "We do not sell your data. We do not share it with third-party marketers.",
                },
                {
                    kind: "p",
                    text: "We share the shipping address from your marketplace order with our courier partner to deliver the piece. That's the only external sharing.",
                },
                {
                    kind: "p",
                    text: "We may be required by law to share data with government authorities. We'll inform you if we can.",
                },
            ],
        },
        {
            id: "cookies",
            title: "Cookies",
            body: [
                {
                    kind: "p",
                    text: "See our Cookie Policy for a full breakdown. In short: kalaf.in uses only first-party analytics cookies. There's no on-site cart, checkout, or payment processor here — those run on the marketplace, under the marketplace's cookie policy.",
                },
            ],
        },
        {
            id: "rights",
            title: "Your rights",
            body: [
                {
                    kind: "list",
                    items: [
                        "Request a copy of all data we hold about you.",
                        "Ask us to correct or delete it.",
                        "Withdraw consent for marketing emails at any time — click unsubscribe or email us.",
                    ],
                },
            ],
            callout: { label: "Write to", value: BRAND.email },
        },
    ],
};
