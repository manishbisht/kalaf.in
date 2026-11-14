import type { PolicyData } from "../../components/PolicyLayout";
import { BRAND } from "../../constants";
import { PRODUCTS } from "../../data/catalog";

// The pant's care label lines from the products repo, minus the fabric line.
const PANT_CARE = (PRODUCTS.find((p) => p.code === "PNT")?.care ?? []).filter(
    (line) => !line.startsWith("Fabric:")
);

export const data: PolicyData = {
    eyebrow: "Guide 02",
    title: "Care guide",
    ornament: "देखभाल",
    summary:
        "How to wash, dry, iron and store our cotton trousers and our bandhani and leheriya dupattas. When in doubt, be gentle.",
    updated: "14 Nov 2026",
    readTime: "3 min read",
    crossLinksHeader: "More guides",
    sections: [
        {
            id: "pant",
            title: "Cotton Relaxed Trousers",
            body: [
                {
                    kind: "p",
                    text: "The pant is 100% cotton. Here is what its care label says:",
                },
                { kind: "list", items: PANT_CARE },
                {
                    kind: "p",
                    text: "Wash it inside out and hang it to dry by the waistband to keep creases down. Cotton can shrink a little in hot water or a tumble dryer, so keep the water cold and skip the dryer.",
                },
            ],
            callout: { label: "Iron", value: "Warm, on the cotton setting." },
        },
        {
            id: "dupatta-wash",
            title: "Washing a dupatta",
            body: [
                {
                    kind: "p",
                    text: "Our bandhani dupattas are art silk (taffeta) and our leheriya dupattas are chiffon. Both are tie-dyed, and several have a gota border. Treat them gently.",
                },
                {
                    kind: "list",
                    items: [
                        "Wash it on its own the first few times. Bandhani and leheriya dyes can bleed, especially reds, pinks and dark colours.",
                        "Dry clean, or hand wash gently in cold water with a mild detergent. For pieces with a gota border, dry cleaning is the safer choice.",
                        "Don't soak it, scrub it or use bleach.",
                        "Don't wring it. Press the water out gently, or roll it in a towel.",
                    ],
                },
            ],
        },
        {
            id: "dupatta-dry",
            title: "Drying & ironing",
            body: [
                {
                    kind: "list",
                    items: [
                        "Dry in shade, spread out or over a line. Strong sun can fade tie-dye colours.",
                        "Don't tumble dry.",
                        "Iron on low heat, on the reverse side, and keep the iron off the gota border.",
                        "If you like the crinkled texture of bandhani, skip the iron or just steam lightly.",
                    ],
                },
            ],
            callout: {
                label: "Iron",
                value: "Low heat, on the reverse, avoiding the gota.",
            },
        },
        {
            id: "storing",
            title: "Storing",
            body: [
                {
                    kind: "p",
                    text: "Store dupattas folded, in a cotton or muslin cloth rather than plastic, away from damp and direct light. Refold now and then along different lines so the folds don't set.",
                },
                {
                    kind: "p",
                    text: "Gota can dull with moisture and perfume, so put perfume on before you drape the dupatta, not on the border.",
                },
            ],
        },
        {
            id: "more",
            title: "Questions",
            body: [
                {
                    kind: "p",
                    text: `If you're unsure about a particular piece or a stain, email ${BRAND.email} and we'll help.`,
                },
            ],
            callout: { label: "Write to us", value: BRAND.email },
        },
    ],
};
