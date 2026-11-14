import type { PolicyData } from "../../components/PolicyLayout";
import { BRAND } from "../../constants";
import { PRODUCTS } from "../../data/catalog";

const PANT = PRODUCTS.find((p) => p.code === "PNT");
const CHART = PANT?.sizeChart;
const DUPATTA_SIZE =
    PRODUCTS.find((p) => p.collection === "dupattas")?.size ?? "2.25 m × 1 m";

const cm = (inches: number) => `${Math.round(inches * 2.54)}`;

const LENGTH = CHART?.lengthIn ?? 40;
const INSEAM = CHART?.inseamIn ?? 30;

export const data: PolicyData = {
    eyebrow: "Guide 01",
    title: "Size guide",
    ornament: "माप",
    summary:
        "Our pant comes in waist sizes 28 to 36 with an elastic waist. Our dupattas are one size. Here are the numbers, and how to measure yourself.",
    updated: "14 Nov 2026",
    readTime: "2 min read",
    crossLinksHeader: "More guides",
    promises: [
        {
            kicker: "Waist",
            label: "Pant sizes",
            body: "Sizes 28, 30, 32, 34 and 36 are your waist in inches.",
        },
        {
            kicker: "Elastic",
            label: "Easy waist",
            body: "Elastic all the way round, so choose your usual waist size.",
        },
        {
            kicker: "One size",
            label: "Dupattas",
            body: `Every dupatta is ${DUPATTA_SIZE}. No sizing needed.`,
        },
    ],
    sections: [
        {
            id: "pant-chart",
            title: "Cotton Relaxed Trousers",
            body: [
                {
                    kind: "p",
                    text: "These are standard size measurements, not measurements taken from the finished garment. Match them to your body, measured as shown below.",
                },
                {
                    kind: "table",
                    head: [
                        "Size",
                        "Waist (in)",
                        "Hip (in)",
                        "Waist (cm)",
                        "Hip (cm)",
                    ],
                    rows: (CHART?.rows ?? []).map((r) => [
                        r.size,
                        `${r.waist}`,
                        `${r.hip}`,
                        cm(r.waist),
                        cm(r.hip),
                    ]),
                    caption:
                        "Centimetres are converted from inches and rounded.",
                },
            ],
            callout: {
                label: "Every size",
                value: `Length about ${LENGTH} in · inseam ${INSEAM} in`,
            },
        },
        {
            id: "measure",
            title: "How to measure",
            body: [
                {
                    kind: "p",
                    text: "Use a soft tape and measure over light clothing or none. Keep the tape level and snug, but not tight.",
                },
                {
                    kind: "list",
                    items: [
                        "Waist — around your waist where you normally wear your trousers.",
                        "Hip — around the fullest part of your hips, with your feet together.",
                        "Inseam — from the crotch down the inside of the leg to where you want the hem, if you'd like to compare with a pair you own.",
                    ],
                },
            ],
        },
        {
            id: "fit",
            title: "How the pant fits",
            body: [
                {
                    kind: "p",
                    text: "It's a relaxed, wide straight leg that falls cleanly to full length. The waistband is elastic all the way round, with a front button and zip fly, so it gives a little for comfort.",
                },
                {
                    kind: "list",
                    items: [
                        "Choose your usual waist size.",
                        "If your hips measure more than the chart shows for your waist size, go up one size.",
                        `The length is about ${LENGTH} in for every size. If you're shorter, a tailor can take up the hem easily.`,
                    ],
                },
            ],
        },
        {
            id: "dupattas",
            title: "Dupattas",
            body: [
                {
                    kind: "p",
                    text: `All our dupattas — bandhani, bandhani with gota border, and chiffon leheriya — are one size: ${DUPATTA_SIZE}. That's a full-length drape for suits, lehengas and festive wear.`,
                },
            ],
            callout: { label: "Size", value: DUPATTA_SIZE },
        },
        {
            id: "unsure",
            title: "Still unsure?",
            body: [
                {
                    kind: "p",
                    text: `Email ${BRAND.email} with your waist and hip measurements and we'll suggest a size.`,
                },
            ],
            callout: { label: "Write to us", value: BRAND.email },
        },
    ],
};
