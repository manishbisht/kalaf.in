import type { PolicyData } from "../../components/PolicyLayout";
import { BRAND } from "../../constants";

export const data: PolicyData = {
    eyebrow: "Policy 03",
    title: "Terms of use",
    ornament: "नियम",
    summary:
        "Straightforward rules for using kalaf.in. Orders are placed on Flipkart or Meesho and follow that marketplace's terms.",
    updated: "14 Nov 2026",
    readTime: "3 min read",
    sections: [
        {
            id: "who",
            title: "Who we are",
            body: [
                {
                    kind: "p",
                    text: `kalaf.in is run by ${BRAND.legalName}, a ${BRAND.constitution.toLowerCase()} (GSTIN ${BRAND.gstin}), ${BRAND.address}.`,
                },
            ],
        },
        {
            id: "using",
            title: "Using our site",
            body: [
                {
                    kind: "p",
                    text: "By using kalaf.in, you agree to use it lawfully and not to copy, scrape or republish our content without permission.",
                },
                {
                    kind: "p",
                    text: "We may restrict access for anyone who breaks these terms or harms the site.",
                },
            ],
        },
        {
            id: "orders",
            title: "Buying through a marketplace",
            body: [
                {
                    kind: "p",
                    text: "You can't buy on kalaf.in itself. Our pant is sold on Flipkart, and our dupattas on Flipkart and Meesho. Payment, order acceptance, delivery, returns and refunds follow the terms of the marketplace you buy from.",
                },
                {
                    kind: "p",
                    text: "We pack and dispatch your order from Jaipur. The marketplace's courier delivers it. Payment is taken by the marketplace, in rupees, using the methods it offers.",
                },
            ],
        },
        {
            id: "products",
            title: "Product information",
            body: [
                {
                    kind: "p",
                    text: "We try to show every product accurately. Colours can look a little different on different screens, and bandhani and leheriya are tie-dyed, so the pattern varies slightly from piece to piece.",
                },
                {
                    kind: "p",
                    text: "Prices and stock on this site are updated from our marketplace listings but can lag behind. The price and details on the marketplace at checkout are the ones that apply.",
                },
            ],
        },
        {
            id: "ip",
            title: "Intellectual property",
            body: [
                {
                    kind: "p",
                    text: `All photography, copy, brand marks and design on this site belong to ${BRAND.legalName}.`,
                },
                {
                    kind: "p",
                    text: "You may share our content on social media for non-commercial purposes with credit to Kalaf. Anything else needs our written permission.",
                },
            ],
        },
        {
            id: "liability",
            title: "Limitation of liability",
            body: [
                {
                    kind: "p",
                    text: "To the extent the law allows, our liability for any claim about these terms or your use of the site is limited to the price you paid for the product in question.",
                },
                {
                    kind: "p",
                    text: "These terms are governed by the laws of India. Any disputes are subject to the jurisdiction of the courts in Jaipur, Rajasthan.",
                },
            ],
        },
    ],
};
