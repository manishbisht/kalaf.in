import type { PolicyData } from "../../components/PolicyLayout";
import { BRAND } from "../../constants";

export const data: PolicyData = {
    eyebrow: "Policy 05",
    title: "Cookie policy",
    ornament: "नियम",
    summary:
        "kalaf.in is a brand site — no cart, no checkout, no payments here. We use a small number of first-party cookies to understand how people find us.",
    updated: "23 May 2026",
    readTime: "3 min read",
    sections: [
        {
            id: "what",
            title: "What are cookies",
            body: [
                {
                    kind: "p",
                    text: "Cookies are small text files saved in your browser when you visit a website. They let a site remember things between pages and sessions — like which page you came from or whether you've dismissed a banner.",
                },
                {
                    kind: "p",
                    text: "Cookies can't run code or carry viruses. They're just text.",
                },
            ],
        },
        {
            id: "use",
            title: "What we use on kalaf.in",
            body: [
                {
                    kind: "list",
                    items: [
                        "Preference cookie — remembers small UI choices, like whether you've dismissed a banner. Lasts 90 days.",
                        "Analytics cookies — first-party only, via Microsoft Clarity. We use them to understand how people navigate the site. No fingerprinting, no data sold.",
                    ],
                },
                {
                    kind: "p",
                    text: "There's no cart, checkout, or payment here, so no session-cart or payment-processor cookies are set on this domain.",
                },
            ],
        },
        {
            id: "managing",
            title: "Managing cookies",
            body: [
                {
                    kind: "p",
                    text: "You can block or delete cookies in your browser settings at any time. The site will continue to work normally without them.",
                },
                {
                    kind: "p",
                    text: "You can opt out of analytics cookies using the toggle in our cookie banner, or by emailing us.",
                },
            ],
        },
        {
            id: "third-party",
            title: "Cookies on the marketplaces",
            body: [
                {
                    kind: "p",
                    text: "When you tap a marketplace button here, you leave kalaf.in and land on Amazon, Flipkart, or Myntra. Each of those sites sets its own cookies under its own policy. We have no control over what they store, and we don't receive that data.",
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
