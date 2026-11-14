import type { PolicyData } from "../../components/PolicyLayout";
import { BRAND } from "../../constants";

export const data: PolicyData = {
    eyebrow: "Policy 05",
    title: "Cookie policy",
    ornament: "नियम",
    summary:
        "kalaf.in has no cart, checkout or login, so it needs no cookies to work. The only cookies come from Microsoft Clarity, our analytics tool, when it's switched on.",
    updated: "14 Nov 2026",
    readTime: "2 min read",
    sections: [
        {
            id: "what",
            title: "What are cookies",
            body: [
                {
                    kind: "p",
                    text: "Cookies are small text files a website saves in your browser. They let a site recognise your browser between pages and visits.",
                },
            ],
        },
        {
            id: "use",
            title: "What we use on kalaf.in",
            body: [
                {
                    kind: "p",
                    text: "We don't set any cookies of our own. When analytics is switched on, Microsoft Clarity sets cookies so it can tell a returning browser from a new one and group page views into one visit:",
                },
                {
                    kind: "list",
                    items: [
                        "_clck — keeps a random Clarity user ID for the site. Lasts about a year.",
                        "_clsk — links the pages you view in one visit into a single session. Lasts about a day.",
                        "Clarity may also set cookies on Microsoft's own domains (such as clarity.ms) to work across sites that use it.",
                    ],
                },
                {
                    kind: "p",
                    text: "The Privacy policy explains what Clarity records. Microsoft handles the data under its own privacy statement.",
                },
                {
                    kind: "links",
                    items: [
                        {
                            label: "Microsoft Privacy Statement",
                            href: "https://privacy.microsoft.com/privacystatement",
                            sub: "Covers Microsoft Clarity",
                        },
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
                    text: "You can block or delete cookies in your browser settings at any time. kalaf.in works normally without them; we just won't see your visit in our analytics.",
                },
            ],
        },
        {
            id: "third-party",
            title: "Cookies on the marketplaces",
            body: [
                {
                    kind: "p",
                    text: "When you tap a Buy button, you leave kalaf.in for Flipkart or Meesho. Each sets its own cookies under its own policy. We don't control them and we don't receive that data.",
                },
                {
                    kind: "p",
                    text: "We don't use Google Analytics, Meta Pixel or any advertising tracker on kalaf.in.",
                },
            ],
            callout: {
                label: "Questions about cookies?",
                value: BRAND.email,
            },
        },
    ],
};
