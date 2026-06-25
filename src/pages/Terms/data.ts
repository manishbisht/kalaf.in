import type { PolicyData } from "../../components/PolicyLayout";
import { BRAND } from "../../constants";

export const data: PolicyData = {
    eyebrow: "Policy 03",
    title: "Terms of use",
    ornament: "नियम",
    summary:
        "Straightforward rules for using kalaf.in. Orders themselves are sold and fulfilled by Amazon, Flipkart, and Myntra under their own terms.",
    updated: "23 May 2026",
    readTime: "5 min read",
    sections: [
        {
            id: "using",
            title: "Using our site",
            body: [
                {
                    kind: "p",
                    text: "By accessing kalaf.in, you agree to use it lawfully and not to reproduce, scrape, or republish our content without permission.",
                },
                {
                    kind: "p",
                    text: "We reserve the right to restrict access to any user who violates these terms or whose behaviour we consider harmful to the site.",
                },
            ],
        },
        {
            id: "orders",
            title: "Buying through a marketplace",
            body: [
                {
                    kind: "p",
                    text: "Kalaf pieces are listed and sold on Amazon, Flipkart, and Myntra. Each purchase is a contract between you and the marketplace — payment, order acceptance, shipping, and returns are governed by that marketplace's terms.",
                },
                {
                    kind: "p",
                    text: "We dispatch the pieces from our Jaipur workshop into the marketplace fulfilment chain. Once a piece is in their hands, their courier SLA and inspection rules apply.",
                },
                {
                    kind: "p",
                    text: "We accept all payment methods supported by Amazon, Flipkart, and Myntra in India — including card, UPI, wallet, and select BNPL options. All transactions are processed by the marketplace in INR.",
                },
            ],
        },
        {
            id: "ip",
            title: "Intellectual property",
            body: [
                {
                    kind: "p",
                    text: `All photography, copy, brand marks, and design are the property of ${BRAND.legalName}`,
                },
                {
                    kind: "p",
                    text: "You may share our content on social media for non-commercial purposes with attribution. Anything else requires written permission.",
                },
            ],
        },
        {
            id: "liability",
            title: "Limitation of liability",
            body: [
                {
                    kind: "p",
                    text: "To the maximum extent permitted by law, Kalaf's liability for any claim related to these terms or your use of the site is limited to the value of the order in question.",
                },
                {
                    kind: "p",
                    text: "These terms are governed by the laws of Rajasthan, India. Any disputes are subject to the jurisdiction of courts in Jaipur.",
                },
            ],
        },
    ],
};
