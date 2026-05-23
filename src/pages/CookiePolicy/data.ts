import type { PolicyData } from "../../components/PolicyLayout";
import { BRAND } from "../../constants";

export const data: PolicyData = {
    eyebrow: "Policy 05",
    title: "Cookie policy",
    ornament: "नियम",
    summary:
        "We use a small number of cookies to keep the store working and to understand how people find us.",
    updated: "23 May 2026",
    readTime: "3 min read",
    sections: [
        {
            id: "what",
            title: "What are cookies",
            body: [
                {
                    kind: "p",
                    text: "Cookies are small text files saved in your browser when you visit a website. They let a site remember things between pages and sessions — like what's in your cart.",
                },
                {
                    kind: "p",
                    text: "Cookies can't run code or carry viruses. They're just text.",
                },
            ],
        },
        {
            id: "use",
            title: "What we use",
            body: [
                {
                    kind: "list",
                    items: [
                        "Session cookie — keeps your bag intact while you browse. Expires when you close the browser.",
                        "Preference cookie — remembers your region and size if you've set them. Lasts 90 days.",
                        "Analytics cookies — first-party only. We use a privacy-first analytics tool that doesn't fingerprint or sell data.",
                    ],
                },
            ],
        },
        {
            id: "managing",
            title: "Managing cookies",
            body: [
                {
                    kind: "p",
                    text: "You can block or delete cookies in your browser settings at any time. Blocking session cookies will stop your cart from working correctly.",
                },
                {
                    kind: "p",
                    text: "You can opt out of analytics cookies using the toggle in our cookie banner, or by emailing us.",
                },
            ],
        },
        {
            id: "third-party",
            title: "Third-party cookies",
            body: [
                {
                    kind: "p",
                    text: "Our payment processor (Razorpay) may set its own cookies during checkout. See Razorpay's cookie policy for details.",
                },
                {
                    kind: "p",
                    text: "We do not use Google Analytics, Meta Pixel, or any other third-party advertising tracker on kalaf.in.",
                },
            ],
            callout: {
                label: "Questions about cookies?",
                value: BRAND.email,
            },
        },
    ],
};
