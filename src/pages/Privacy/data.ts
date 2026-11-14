import type { PolicyData } from "../../components/PolicyLayout";
import { BRAND } from "../../constants";

export const data: PolicyData = {
    eyebrow: "Policy 01",
    title: "Privacy policy",
    ornament: "गोपनीय",
    summary:
        "kalaf.in has no accounts, no checkout and no sign-up forms. Your purchase data sits with Flipkart or Meesho. We hold very little ourselves, and we don't sell any of it.",
    updated: "14 Nov 2026",
    readTime: "4 min read",
    sections: [
        {
            id: "who",
            title: "Who we are",
            body: [
                {
                    kind: "p",
                    text: `kalaf.in is run by ${BRAND.legalName}, a ${BRAND.constitution.toLowerCase()} based in ${BRAND.location} (GSTIN ${BRAND.gstin}). We make and sell Kalaf products through Flipkart and Meesho.`,
                },
            ],
        },
        {
            id: "collect",
            title: "What we collect",
            body: [
                {
                    kind: "p",
                    text: "When you buy on a marketplace, your account, payment and order details sit with that marketplace under its own privacy policy. We never see your payment information.",
                },
                {
                    kind: "p",
                    text: "To pack and ship an order, the marketplace gives us what's on the shipping label: the recipient's name, delivery address and the order details. We use it only to send that order.",
                },
                {
                    kind: "p",
                    text: "If you email, call or WhatsApp us, we keep the conversation and your contact details so we can reply and follow up.",
                },
                {
                    kind: "p",
                    text: "This website itself has no forms, accounts or cart, so it doesn't ask you for any personal details.",
                },
            ],
        },
        {
            id: "analytics",
            title: "Analytics: Microsoft Clarity",
            body: [
                {
                    kind: "p",
                    text: "When analytics is switched on, kalaf.in uses Microsoft Clarity to understand how people use the site. Clarity records how you move through pages — clicks, taps, scrolling and mouse movement — so we can look at session replays and heatmaps and fix what's confusing.",
                },
                {
                    kind: "list",
                    items: [
                        "It also collects technical details such as your browser, device, screen size, approximate location from your IP address, and the pages you visited.",
                        "This site has no forms, so there's no typed text for Clarity to record.",
                        "Clarity sets cookies to recognise a returning browser and to group page views into one visit. The Cookie policy lists them.",
                        "Microsoft processes this data under its own privacy statement and may use it to improve its services.",
                    ],
                },
                {
                    kind: "links",
                    items: [
                        {
                            label: "Microsoft Privacy Statement",
                            href: "https://privacy.microsoft.com/privacystatement",
                            sub: "How Microsoft handles Clarity data",
                        },
                    ],
                },
            ],
        },
        {
            id: "others",
            title: "Other services the site uses",
            body: [
                {
                    kind: "p",
                    text: "The site loads its fonts from Google Fonts and Fontshare, which means your browser asks their servers for the font files and they see your IP address. We don't use Google Analytics, Meta Pixel or any advertising tracker.",
                },
                {
                    kind: "p",
                    text: "When you tap a Buy button or a social link, you leave kalaf.in. Flipkart, Meesho, Instagram, Facebook, LinkedIn, X and WhatsApp each handle your data under their own policies.",
                },
            ],
        },
        {
            id: "sharing",
            title: "Sharing & disclosure",
            body: [
                {
                    kind: "p",
                    text: "We do not sell your data and we don't share it with marketers.",
                },
                {
                    kind: "p",
                    text: "Shipping details go to the courier the marketplace assigns, to deliver your order. We may also have to share data with government authorities when the law requires it.",
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
                        "Ask for a copy of the data we hold about you.",
                        "Ask us to correct or delete it, where the law allows.",
                        "Block or clear cookies in your browser at any time; the site works without them.",
                    ],
                },
                {
                    kind: "p",
                    text: "Email us and we'll acknowledge your request within 48 hours. For data held by Flipkart or Meesho, contact them directly.",
                },
            ],
            callout: { label: "Write to", value: BRAND.email },
        },
    ],
};
