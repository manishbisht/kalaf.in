import type { PolicyData } from "../../components/PolicyLayout";
import { BRAND } from "../../constants";

export const data: PolicyData = {
    eyebrow: "Guide 02",
    title: "Care guide",
    ornament: "देखभाल",
    summary:
        "These pieces are made to last years. A little attention to washing and storing goes a long way.",
    updated: "23 May 2026",
    readTime: "3 min read",
    crossLinksHeader: "More guides",
    sections: [
        {
            id: "washing",
            title: "Washing",
            body: [
                {
                    kind: "p",
                    text: "Hand wash in cold water or machine wash on the delicate cycle at 30°C maximum.",
                },
                {
                    kind: "p",
                    text: "Use a mild detergent — avoid anything with bleach, optical brighteners, or fabric softener. These break down natural fibres faster than washing itself.",
                },
                {
                    kind: "list",
                    items: [
                        "Turn the garment inside out before washing.",
                        "Wash dark and light pieces separately on the first wash.",
                        "Do not wring — press gently to remove water.",
                    ],
                },
            ],
        },
        {
            id: "drying",
            title: "Drying",
            body: [
                {
                    kind: "p",
                    text: "Lay flat to dry in shade. Direct sunlight fades natural dyes and weakens the weave over time.",
                },
                {
                    kind: "p",
                    text: "Do not tumble dry. The heat shrinks the fabric and distorts the cut.",
                },
            ],
        },
        {
            id: "ironing",
            title: "Ironing",
            body: [
                {
                    kind: "p",
                    text: "Iron on a medium setting, inside out, while slightly damp. Most wrinkles release without a steam iron.",
                },
                {
                    kind: "p",
                    text: "For embroidered or printed pieces, iron only on the reverse to protect the surface.",
                },
            ],
            callout: {
                label: "Temperature",
                value: "Medium heat — cotton setting.",
            },
        },
        {
            id: "storing",
            title: "Storing",
            body: [
                {
                    kind: "p",
                    text: "Fold and store flat where possible. Hanging long kurtas and heavy jackets is fine, but knitwear should always be folded to avoid stretching the shoulders.",
                },
                {
                    kind: "p",
                    text: "Breathable cotton bags (like our packaging) work better than plastic for long-term storage — natural fibres need airflow.",
                },
            ],
        },
        {
            id: "more",
            title: "When it needs more",
            body: [
                {
                    kind: "p",
                    text: "For stubborn stains or if the piece needs professional care, a dry cleaner who handles natural-fibre garments is your best option. Avoid those that use perchloroethylene.",
                },
                {
                    kind: "p",
                    text: `We're happy to advise on specific pieces — email ${BRAND.email}.`,
                },
            ],
            callout: { label: "Specific questions?", value: BRAND.email },
        },
    ],
};
