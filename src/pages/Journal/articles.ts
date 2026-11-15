// The Journal: short articles about the crafts behind Kalaf's pieces and how
// to wear and care for them. Plain data, so the pages, SEO (src/seo) and the
// tests all read the same thing.
//
// Content rules (see src/pages/README.md#journal): write about the crafts in
// general, well-established terms and hedge where traditions vary. Anything
// said about Kalaf's own pieces must come from the catalog (fabric, size,
// fit, care) — no claims about how or by whom they're made.
//
// Paragraph, list and step text may hold inline links as [label](/path).
// Internal paths only; build them from ROUTES / productPath / collectionPath.

import {
    ROUTES,
    collectionPath,
    journalPath,
    productPath,
} from "../../constants";
import { PRODUCTS, type Product, type ProductImage } from "../../data/catalog";

export type ArticleBlock =
    | { kind: "p"; text: string }
    | { kind: "list"; items: string[] }
    | { kind: "steps"; items: string[] };

export type ArticleSection = {
    id: string;
    heading: string;
    blocks: ArticleBlock[];
};

export type Article = {
    slug: string;
    title: string;
    /** Meta description and index-card summary (~150 chars). */
    description: string;
    /** Shown on the page, e.g. "14 Nov 2026". */
    date: string;
    /** ISO date for JSON-LD, e.g. "2026-11-14". */
    datePublished: string;
    category: "Craft" | "How to";
    /** Devanagari word shown large behind the header. */
    ornament: string;
    /** A catalog photo: product handle, colour code and photo index. */
    hero: { handle: string; colour: string; index: number };
    intro: string;
    sections: ArticleSection[];
    /** Product handles for the "Shop the pieces" strip. */
    related: string[];
};

// Catalog lookups by handle. Missing products give "" / 0 so a re-synced
// catalog can't crash the build; the tests fail instead.
const byHandle = (handle: string): Product | undefined =>
    PRODUCTS.find((p) => p.handle === handle);
const titleOf = (handle: string) => byHandle(handle)?.title ?? "";
const coloursOf = (handle: string) => byHandle(handle)?.variants.length ?? 0;

const BANDHANI = "bandhani-dupatta";
const BANDHANI_GOTA = "bandhani-dupatta-gota-border";
const LEHERIYA = "chiffon-leheriya-dupatta";
const PANT = "cotton-relaxed-trousers";

const DUPATTA_SIZE = byHandle(BANDHANI)?.size ?? "";
const pant = byHandle(PANT);
const PANT_LENGTH = pant?.sizeChart?.lengthIn ?? 0;
const PANT_INSEAM = pant?.sizeChart?.inseamIn ?? 0;
const PANT_SIZES = pant?.sizes.join(", ") ?? "";
const PANT_COLOURS = pant?.variants.map((v) => v.colour.toLowerCase()) ?? [];
const PANT_CARE = (pant?.care ?? []).filter((l) => !l.startsWith("Fabric:"));

const link = (label: string, path: string) => `[${label}](${path})`;
const productLink = (handle: string) =>
    link(titleOf(handle), productPath(handle));
const list = (items: string[]) =>
    items.length < 2
        ? items.join("")
        : `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
/** Single colours of a product, lower case ("royal blue"); no multicolours. */
const solidColours = (handle: string) =>
    (byHandle(handle)?.variants ?? [])
        .filter((v) => v.family !== "Multicolour")
        .map((v) => v.colour.toLowerCase());
const multicolours = (handle: string) =>
    (byHandle(handle)?.variants ?? []).filter((v) => v.family === "Multicolour")
        .length;

/** The index page's intro, also its meta description. */
export const JOURNAL_INTRO =
    "Notes on the Rajasthani crafts behind our dupattas (bandhani, leheriya and gota) and how to wear and care for our pieces.";

const DATE = "14 Nov 2026";
const ISO_DATE = "2026-11-14";
const DATE_15 = "15 Nov 2026";
const ISO_DATE_15 = "2026-11-15";

const FABRIC_SLUG = "chiffon-vs-art-silk-dupattas";
const FABRIC_TITLE = "Chiffon or art silk? Choosing a dupatta fabric";
const PAIRING_SLUG = "how-to-pair-a-dupatta-with-your-kurta";
const PAIRING_TITLE = "How to pair a dupatta with your kurta";

const GOTA_MULTI = multicolours(BANDHANI_GOTA);

// Newest first: the index features the first article.
export const ARTICLES: Article[] = [
    {
        slug: FABRIC_SLUG,
        title: FABRIC_TITLE,
        description:
            "Chiffon and art silk (taffeta) wear very differently. How the two dupatta fabrics compare on drape, weight, sheen and feel, when to wear each, and care.",
        date: DATE_15,
        datePublished: ISO_DATE_15,
        category: "Craft",
        ornament: "कपड़ा",
        hero: { handle: LEHERIYA, colour: "PI", index: 0 },
        intro: `Our dupattas come in two fabrics: light chiffon for the leheriya, and art silk (taffeta) for the bandhani. They're all ${DUPATTA_SIZE}, but the two fabrics look, feel and wear quite differently. Here is how they compare, when each one works best, and how to look after them.`,
        sections: [
            {
                id: "chiffon",
                heading: "Chiffon: light and sheer",
                blocks: [
                    {
                        kind: "p",
                        text: "Chiffon is a fine, sheer fabric woven from tightly twisted yarns. The twist gives it a faintly grainy feel between the fingers and a soft, matte surface with little shine of its own. It can be made from silk or from man-made fibres such as polyester, and either way it's one of the lightest fabrics a dupatta can be made in.",
                    },
                    {
                        kind: "p",
                        text: "Because it's so light, chiffon falls in soft, fluid folds and moves as you move. It's sheer in a single layer, so the colour of your kurta shows through a little wherever the dupatta lies flat. That lightness is also one reason leheriya is so often done on chiffon: thin cloth rolls tightly, and the dye can reach through every layer.",
                    },
                ],
            },
            {
                id: "art-silk",
                heading: "Art silk (taffeta): crisp, with a sheen",
                blocks: [
                    {
                        kind: "p",
                        text: "Art silk is short for artificial silk, a broad name for man-made fibres, such as viscose and polyester, that are made to look like silk. Taffeta is the weave: a tight, plain weave that makes a smooth, crisp cloth with a gentle sheen.",
                    },
                    {
                        kind: "p",
                        text: "Compared with chiffon, art silk taffeta has more body. It's less sheer, it feels smooth rather than grainy, and it catches the light. Rather than flowing, it holds its shape, so pleats and folds stay where you put them. Against that sheen, the small undyed dots of bandhani stand out clearly.",
                    },
                ],
            },
            {
                id: "compare",
                heading: "Side by side",
                blocks: [
                    {
                        kind: "list",
                        items: [
                            "Drape: chiffon flows and falls in soft folds; taffeta is crisper and holds a pleat.",
                            "Weight: chiffon is the lighter of the two; taffeta has a little more weight and body.",
                            "Sheen: taffeta has a soft lustre; chiffon is more matte.",
                            "Feel: chiffon is fine and slightly grainy; taffeta is smooth and crisp, and can rustle a little as you move.",
                            "Sheerness: chiffon is see-through in a single layer; taffeta is less sheer.",
                        ],
                    },
                ],
            },
            {
                id: "occasions",
                heading: "When to wear which",
                blocks: [
                    {
                        kind: "p",
                        text: "There are no fixed rules, but a few things are worth keeping in mind:",
                    },
                    {
                        kind: "list",
                        items: [
                            "In the heat, chiffon is the easier choice. It's light and airy, which is part of why leheriya has long been thought of as cloth for summer and the rains.",
                            `For open, flowing drapes, such as across both shoulders or belted like a cape, chiffon's softness shows well. For a neat drape over one shoulder, taffeta's crispness helps. There are steps for each in ${link("Four ways to drape a dupatta", journalPath("four-ways-to-drape-a-dupatta"))}.`,
                            `For festive days, both work. Taffeta's sheen looks dressy on its own, and a gota border adds shimmer to either fabric, as on our ${productLink(LEHERIYA)}.`,
                            `For everyday wear, a borderless art silk bandhani, like our ${productLink(BANDHANI)}, goes easily with a plain kurta.`,
                        ],
                    },
                ],
            },
            {
                id: "care",
                heading: "Caring for each",
                blocks: [
                    {
                        kind: "p",
                        text: "All our dupattas are tie-dyed, so the basics are the same for both fabrics: wash on its own the first few times, dry clean or hand wash gently in cold water with a mild detergent, don't wring, and dry in the shade. With a gota border, dry cleaning is the safer choice. Beyond that, a few differences:",
                    },
                    {
                        kind: "list",
                        items: [
                            "Chiffon is fine and can snag. Keep it clear of rings, bangles and brooches with sharp edges, and handle it gently when it's wet.",
                            "Taffeta holds creases as well as it holds pleats. Store it folded, and refold it now and then along different lines so the folds don't set.",
                            "Man-made fibres don't like a hot iron. Iron both fabrics on low heat, on the reverse, and keep the iron off the gota.",
                            "If you like the crinkle of bandhani, skip the iron or steam it lightly.",
                        ],
                    },
                    {
                        kind: "p",
                        text: `The full washing and storing notes are in our ${link("care guide", ROUTES.careGuide)}.`,
                    },
                ],
            },
            {
                id: "ours",
                heading: "Our dupattas, by fabric",
                blocks: [
                    {
                        kind: "p",
                        text: `In chiffon: the ${productLink(LEHERIYA)}, in ${coloursOf(LEHERIYA)} colours. In art silk (taffeta): the ${productLink(BANDHANI)}, in ${coloursOf(BANDHANI)} colours, and the ${productLink(BANDHANI_GOTA)}, in ${coloursOf(BANDHANI_GOTA)} colours. For help choosing a colour, read ${link(PAIRING_TITLE, journalPath(PAIRING_SLUG))}.`,
                    },
                ],
            },
        ],
        related: [LEHERIYA, BANDHANI, BANDHANI_GOTA],
    },
    {
        slug: PAIRING_SLUG,
        title: PAIRING_TITLE,
        description:
            "Choosing a dupatta for a kurta: colour pairings that work, when to pick a gota border, and bandhani dots or leheriya stripes for plain and printed outfits.",
        date: DATE_15,
        datePublished: ISO_DATE_15,
        category: "How to",
        ornament: "रंग",
        hero: { handle: BANDHANI, colour: "GR", index: 0 },
        intro: "The right dupatta can make a simple kurta look finished, or turn a plain suit into something festive. There's no single right answer, but a few ideas make choosing easier: start from the kurta, decide how much contrast you want, then pick the pattern and the edge.",
        sections: [
            {
                id: "kurta",
                heading: "Start with the kurta",
                blocks: [
                    {
                        kind: "p",
                        text: "Before you think about colour, look at how busy your kurta is.",
                    },
                    {
                        kind: "list",
                        items: [
                            "A plain or lightly embroidered kurta leaves room for a strong dupatta: a bold colour, an all-over pattern, a gota border.",
                            "A printed or heavily embroidered kurta usually looks best with a quieter dupatta, either a single colour or one that picks up a shade from the print.",
                            "If the kurta already has metallic detailing, such as zari or gota, a gota-bordered dupatta echoes it and ties the outfit together.",
                        ],
                    },
                ],
            },
            {
                id: "colour",
                heading: "Three ways to match colour",
                blocks: [
                    {
                        kind: "list",
                        items: [
                            "Contrast. Pair strong partners: a royal blue dupatta over a yellow kurta, pink with green, red with yellow. Bright contrasts are a familiar sight in Rajasthani dress, and they suit festive days.",
                            "Tone on tone. Choose a dupatta a shade or two deeper or lighter than the kurta: rani pink over pale pink, maroon over red. It looks calm and put together, and works well for the office or daytime events.",
                            "Pick up a colour. With a printed kurta, take one colour from the print, often not the main one, and match the dupatta to it. A multicolour dupatta works the other way round: wear it with a plain kurta in any one of its colours.",
                        ],
                    },
                ],
            },
            {
                id: "neutrals",
                heading: "White, black and beige",
                blocks: [
                    {
                        kind: "p",
                        text: "Neutral kurtas are the easiest to dress up, because almost any dupatta works with them. A white or cream kurta takes every colour, and lets a bold bandhani or leheriya be the centre of attention. A black kurta looks striking with a bright dupatta in red, yellow, pink or royal blue. Beige sits well with warm shades such as maroon, red and orange.",
                    },
                    {
                        kind: "p",
                        text: `The same idea works for the bottom half. Our ${productLink(PANT)} come in ${list(PANT_COLOURS)}, so a short kurta over them keeps the outfit simple and lets the dupatta bring the colour.`,
                    },
                ],
            },
            {
                id: "border",
                heading: "Plain edge or gota border",
                blocks: [
                    {
                        kind: "p",
                        text: "A borderless dupatta is the more versatile of the two. It goes with everyday kurtas and office wear, and it won't compete with an embroidered neckline. A gota border adds a line of shimmer that frames the dupatta, which makes it a natural choice for weddings, pujas and festivals.",
                    },
                    {
                        kind: "p",
                        text: `If you want one dupatta to wear often, borderless is an easy place to start. For a particular occasion, a border does a lot of the dressing up for you. There's more about the ribbon itself in ${link("Gota patti: the shimmer on the border", journalPath("gota-patti"))}.`,
                    },
                ],
            },
            {
                id: "pattern",
                heading: "Bandhani or leheriya",
                blocks: [
                    {
                        kind: "list",
                        items: [
                            "Bandhani's dots read as a fine texture from a distance, so they sit comfortably with plain kurtas and with small, simple prints.",
                            "Leheriya's diagonal stripes have more movement. They look best against a plain kurta; with a striped or checked kurta, the lines can clash.",
                            `The fabric matters too. Our leheriya is light chiffon and our bandhani is art silk (taffeta); ${link(FABRIC_TITLE, journalPath(FABRIC_SLUG))} explains how they differ.`,
                        ],
                    },
                ],
            },
            {
                id: "ours",
                heading: "Our colours",
                blocks: [
                    {
                        kind: "list",
                        items: [
                            `${productLink(BANDHANI)}: ${list(solidColours(BANDHANI))}.`,
                            `${productLink(BANDHANI_GOTA)}: ${list(solidColours(BANDHANI_GOTA))}${GOTA_MULTI ? `, plus ${GOTA_MULTI} multicolour combinations` : ""}.`,
                            `${productLink(LEHERIYA)}: ${list(solidColours(LEHERIYA))}.`,
                        ],
                    },
                    {
                        kind: "p",
                        text: `See them side by side in our ${link("dupattas collection", collectionPath("dupattas"))}, where you can filter by colour.`,
                    },
                ],
            },
        ],
        related: [BANDHANI, BANDHANI_GOTA, LEHERIYA, PANT],
    },
    {
        slug: "what-is-bandhani",
        title: "What is bandhani?",
        description:
            "Bandhani is the tie-dye of Rajasthan and Gujarat: cloth pinched and tied with thread before dyeing, leaving tiny dots. How it works and how to care for it.",
        date: DATE,
        datePublished: ISO_DATE,
        category: "Craft",
        ornament: "बांधनी",
        hero: { handle: BANDHANI_GOTA, colour: "RB", index: 2 },
        intro: "Bandhani is one of India's best-known textile crafts, and one of the easiest to recognise once you know what to look for: a field of tiny dots, often gathered into waves, circles or larger patterns. Here is how it's made, what the dots are, and how to look after a bandhani dupatta.",
        sections: [
            {
                id: "technique",
                heading: "Tied, then dyed",
                blocks: [
                    {
                        kind: "p",
                        text: "The name comes from bandhna, the Hindi word for “to tie”, and you'll also hear it called bandhej. It's a resist-dyeing technique. Before the cloth goes into the dye, small points of fabric are pinched up and wound tightly with thread. Wherever the thread is wrapped, the dye can't reach. When the threads are taken off, each one leaves a small undyed spot behind.",
                    },
                    {
                        kind: "p",
                        text: "For more than one colour, the cloth is usually tied, dyed, then tied again and dyed in a deeper shade, working from light colours to dark. Traditionally the tying is done by hand, one dot at a time, which is why a finely tied piece takes so much patience.",
                    },
                    {
                        kind: "p",
                        text: "Bandhani has been made for generations in Rajasthan and Gujarat, and it's part of festive and wedding dressing in both. It's often worn for weddings, pujas and festivals, though plainer pieces are just as much at home with an everyday kurta.",
                    },
                ],
            },
            {
                id: "dots",
                heading: "What the dots are",
                blocks: [
                    {
                        kind: "p",
                        text: "Each dot marks one tie. Arrange the ties in lines and you get stripes or waves; cluster them and you get flowers, circles or borders. Because every tie is made separately, the dots are rarely perfect circles. They vary a little in size and shape from one to the next, and that small unevenness is part of the look.",
                    },
                    {
                        kind: "p",
                        text: "Freshly untied bandhani also has a crinkled, puckered texture where the cloth was pinched. Some pieces keep that texture; others are pressed flat before they're sold.",
                    },
                ],
            },
            {
                id: "recognise",
                heading: "How to recognise it",
                blocks: [
                    {
                        kind: "p",
                        text: "Bandhani is popular enough that printed imitations are common. None of these signs is foolproof on its own, but together they're a good guide:",
                    },
                    {
                        kind: "list",
                        items: [
                            "The dots are slightly irregular. A print repeats the same dot exactly, again and again.",
                            "Turn it over. Dye goes right through the cloth, so the back of tie-dyed fabric usually looks much like the front. A print is often paler on the reverse.",
                            "Look for crinkles or tiny puckers around the dots, where the cloth was tied.",
                        ],
                    },
                ],
            },
            {
                id: "care",
                heading: "Looking after a bandhani dupatta",
                blocks: [
                    {
                        kind: "p",
                        text: "Tie-dye colours can bleed, especially reds, pinks and dark shades, so a little care goes a long way:",
                    },
                    {
                        kind: "list",
                        items: [
                            "Wash it on its own the first few times.",
                            "Dry clean, or hand wash gently in cold water with a mild detergent. Don't soak, scrub or bleach it.",
                            "Don't wring it. Press the water out, or roll it in a towel.",
                            "Dry it in the shade. Strong sun can fade the colours.",
                            "Iron on low heat, on the reverse. If you like the crinkle, skip the iron or steam it lightly.",
                        ],
                    },
                    {
                        kind: "p",
                        text: `There's more in our ${link("care guide", ROUTES.careGuide)}.`,
                    },
                ],
            },
            {
                id: "ours",
                heading: "Our bandhani dupattas",
                blocks: [
                    {
                        kind: "p",
                        text: `We make two, both in art silk (taffeta) and both ${DUPATTA_SIZE}. The ${productLink(BANDHANI)} is clean and borderless, in ${coloursOf(BANDHANI)} colours. The ${productLink(BANDHANI_GOTA)} adds a shimmering gota edge, in ${coloursOf(BANDHANI_GOTA)} colours. To find out more about that border, read ${link("Gota patti: the shimmer on the border", journalPath("gota-patti"))}.`,
                    },
                ],
            },
        ],
        related: [BANDHANI, BANDHANI_GOTA],
    },
    {
        slug: "what-is-leheriya",
        title: "Leheriya, the wave-dyed cloth of Rajasthan",
        description:
            "Leheriya is Rajasthan's diagonal wave-striped tie-dye, long linked with the monsoon festival of Teej. How it's made, how it looks, and how to care for it.",
        date: DATE,
        datePublished: ISO_DATE,
        category: "Craft",
        ornament: "लहरिया",
        hero: { handle: LEHERIYA, colour: "RB", index: 0 },
        intro: "If bandhani is dots, leheriya is waves. It's the Rajasthani tie-dye of fine diagonal stripes that seem to ripple across the cloth, and its name comes from lehar, the word for a wave. Here is how it's made, why it's tied to the rains, and how to look after it.",
        sections: [
            {
                id: "technique",
                heading: "Rolled, tied, dyed",
                blocks: [
                    {
                        kind: "p",
                        text: "Leheriya is a resist-dye, like bandhani, but the cloth is rolled rather than pinched. In the traditional method the fabric is rolled diagonally, from one corner towards the opposite edge, into a long rope. The rope is then bound with thread at intervals and dyed. The bound sections resist the dye, and when the cloth is opened out they show as stripes running on the bias.",
                    },
                    {
                        kind: "steps",
                        items: [
                            "Roll the cloth diagonally into a tight rope.",
                            "Bind it with thread at intervals along its length.",
                            "Dye it, then untie and open it out to reveal the stripes.",
                            "For more colours, tie and dye again, usually working from light shades to dark.",
                        ],
                    },
                    {
                        kind: "p",
                        text: "Because the cloth has to be rolled tightly and the dye has to reach through every layer, leheriya is usually done on light, thin fabrics such as chiffon, georgette or fine cotton.",
                    },
                ],
            },
            {
                id: "look",
                heading: "The look",
                blocks: [
                    {
                        kind: "p",
                        text: "Good leheriya has stripes that are even in rhythm but soft at the edges, where the dye has crept a little way under the thread. Where colours meet, they can blend slightly into each other. That softness is what gives leheriya its rippling, water-like feel, and it's one way to tell it from a crisp printed stripe.",
                    },
                    {
                        kind: "p",
                        text: "Re-rolling the cloth from the other corner and dyeing again can make the stripes cross, giving a checked pattern. Single-direction stripes, though, are the classic leheriya.",
                    },
                ],
            },
            {
                id: "teej",
                heading: "Teej and the rains",
                blocks: [
                    {
                        kind: "p",
                        text: "Leheriya is closely linked with Teej, the monsoon festival celebrated by women across Rajasthan and much of north India. Traditionally, many women wear leheriya for Teej, and green is a favourite colour for it. More broadly, leheriya has long been thought of as cloth for the rainy season and the summer: light, airy and bright.",
                    },
                    {
                        kind: "p",
                        text: "Customs vary from family to family and town to town, so think of this as a tradition rather than a rule. Leheriya is worn all year round, for weddings, festivals and everyday wear.",
                    },
                ],
            },
            {
                id: "care",
                heading: "Caring for a chiffon leheriya",
                blocks: [
                    {
                        kind: "p",
                        text: "Chiffon is light and fine, and tie-dye colours can bleed, so treat it gently:",
                    },
                    {
                        kind: "list",
                        items: [
                            "Wash it on its own the first few times, in cold water with a mild detergent, or dry clean it. With a gota border, dry cleaning is the safer choice.",
                            "Don't wring or scrub it. Press the water out gently.",
                            "Dry it in the shade, and iron on low heat on the reverse, keeping the iron off the border.",
                            "Chiffon can snag, so take care with rings, bangles and brooches with sharp edges.",
                        ],
                    },
                    {
                        kind: "p",
                        text: `See our ${link("care guide", ROUTES.careGuide)} for more.`,
                    },
                ],
            },
            {
                id: "ours",
                heading: "Our leheriya dupatta",
                blocks: [
                    {
                        kind: "p",
                        text: `Our ${productLink(LEHERIYA)} is light, flowing chiffon in rippling leheriya stripes, edged with a gota border. It's ${DUPATTA_SIZE} and comes in ${coloursOf(LEHERIYA)} colours. For ways to wear it, see ${link("Four ways to drape a dupatta", journalPath("four-ways-to-drape-a-dupatta"))}.`,
                    },
                ],
            },
        ],
        related: [LEHERIYA],
    },
    {
        slug: "gota-patti",
        title: "Gota patti: the shimmer on the border",
        description:
            "Gota is the metallic ribbon that edges Rajasthani festive wear. What gota patti is, how it's used on dupatta borders, and how to keep it looking bright.",
        date: DATE,
        datePublished: ISO_DATE,
        category: "Craft",
        ornament: "गोटा",
        hero: { handle: BANDHANI_GOTA, colour: "MU3", index: 2 },
        intro: "That gleaming band along the edge of a festive dupatta is very often gota. It's a metallic ribbon, stitched onto cloth in strips or cut into shapes, and it's been part of Rajasthani festive dress for a long time. Here is what it is, where it goes, and how to look after it.",
        sections: [
            {
                id: "what",
                heading: "What gota is",
                blocks: [
                    {
                        kind: "p",
                        text: "Gota is a narrow ribbon woven with metallic threads, usually gold or silver in colour. Traditionally it was woven with metal-wrapped threads; today it's more often made with lighter yarns that have a metallic finish, which makes it more affordable and easier to wear.",
                    },
                    {
                        kind: "p",
                        text: "Gota patti is the craft of applying that ribbon to cloth. Patti means a strip or a leaf, and the ribbon is used both ways: laid in straight lines along an edge, or cut and folded into small leaves, petals and flowers that are stitched down one by one.",
                    },
                ],
            },
            {
                id: "where",
                heading: "Where you see it",
                blocks: [
                    {
                        kind: "p",
                        text: "Gota work is a Rajasthani tradition, closely associated with Jaipur, and it turns up wherever a piece is meant to catch the light: on lehengas, sarees, odhnis and, very often, along the borders of dupattas. It's a favourite for weddings, pujas and festivals.",
                    },
                    {
                        kind: "p",
                        text: "On a dupatta, a gota border frames the cloth and gives the edge a little weight and sparkle. Because gota is a flat ribbon rather than dense embroidery, a bordered dupatta generally stays light enough to drape easily. It pairs especially well with tie-dyes like bandhani and leheriya, where the shine of the border sets off the softness of the dyed cloth.",
                    },
                ],
            },
            {
                id: "care",
                heading: "Keeping gota bright",
                blocks: [
                    {
                        kind: "p",
                        text: "Gota is the most delicate part of a bordered dupatta. Moisture, heat and crushing are what dull and bend it, so:",
                    },
                    {
                        kind: "list",
                        items: [
                            "Dry cleaning is the safer choice. If you hand wash, use cold water and a mild detergent, and keep it brief.",
                            "Never wring it. Wringing creases the ribbon and can pull at the stitches. Press the water out, or roll the dupatta in a towel.",
                            "Iron on the reverse, on low heat, and keep the iron off the gota itself.",
                            "Store it folded, in a cotton or muslin cloth rather than plastic, away from damp. Refold it now and then along different lines.",
                            "Put perfume on before you drape the dupatta, and keep it off the border.",
                        ],
                    },
                    {
                        kind: "p",
                        text: `Our ${link("care guide", ROUTES.careGuide)} has the full washing and storing notes.`,
                    },
                ],
            },
            {
                id: "ours",
                heading: "Our gota-border dupattas",
                blocks: [
                    {
                        kind: "p",
                        text: `Two of our dupattas have a gota border. The ${productLink(BANDHANI_GOTA)} is bandhani on art silk (taffeta), in ${coloursOf(BANDHANI_GOTA)} colours. The ${productLink(LEHERIYA)} is leheriya on light chiffon, in ${coloursOf(LEHERIYA)} colours. Both are ${DUPATTA_SIZE}.`,
                    },
                    {
                        kind: "p",
                        text: `New to the dyes themselves? Start with ${link("What is bandhani?", journalPath("what-is-bandhani"))} and ${link("Leheriya, the wave-dyed cloth of Rajasthan", journalPath("what-is-leheriya"))}.`,
                    },
                ],
            },
        ],
        related: [BANDHANI_GOTA, LEHERIYA],
    },
    {
        slug: "four-ways-to-drape-a-dupatta",
        title: "Four ways to drape a dupatta",
        description:
            "Four easy ways to wear a dupatta: over one shoulder, across both, over the head, and belted like a cape. Simple steps for each.",
        date: DATE,
        datePublished: ISO_DATE,
        category: "How to",
        ornament: "दुपट्टा",
        hero: { handle: BANDHANI_GOTA, colour: "MA", index: 2 },
        intro: `A dupatta can change the whole feel of an outfit, depending on how you wear it. Here are four simple drapes, from the everyday to the festive. They all work with a full-length dupatta like ours, which is ${DUPATTA_SIZE}. Stand in front of a mirror, and keep a safety pin or two handy.`,
        sections: [
            {
                id: "one-shoulder",
                heading: "1. Over one shoulder",
                blocks: [
                    {
                        kind: "p",
                        text: "The classic, and the easiest. It works with a kurta, a suit or a lehenga, and leaves both hands free.",
                    },
                    {
                        kind: "steps",
                        items: [
                            "Fold the dupatta lengthwise into a neat band, or pleat it loosely if you want it narrower.",
                            "Lay it over your left shoulder, with roughly a third hanging in front and the rest behind.",
                            "Even out the folds and pin it at the shoulder, on the inside, so it stays put.",
                        ],
                    },
                ],
            },
            {
                id: "both-shoulders",
                heading: "2. Across both shoulders",
                blocks: [
                    {
                        kind: "p",
                        text: "A soft, traditional drape that frames a neckline. It works well with suits and anarkalis, and shows off a pattern.",
                    },
                    {
                        kind: "steps",
                        items: [
                            "Hold the dupatta open across the front of your body, just below the collarbone.",
                            "Take one end back over each shoulder, so both ends fall behind you.",
                            "Adjust the front so it sits in a gentle curve, and pin it at each shoulder if you'll be moving a lot.",
                        ],
                    },
                    {
                        kind: "p",
                        text: "For a more relaxed version, reverse it: lay the dupatta around the back of your neck and let both ends fall down the front.",
                    },
                ],
            },
            {
                id: "over-the-head",
                heading: "3. Over the head",
                blocks: [
                    {
                        kind: "p",
                        text: "Often worn for pujas, weddings and visits to a temple or gurdwara.",
                    },
                    {
                        kind: "steps",
                        items: [
                            "Drape one end over your left shoulder so it hangs down the front.",
                            "Bring the rest of the dupatta up behind you and over the top of your head.",
                            "Let the other end fall over your right shoulder or arm.",
                            "Smooth fabrics can slip, so fix it at the back of the head with a hairpin or two.",
                        ],
                    },
                ],
            },
            {
                id: "cape",
                heading: "4. Belted, like a cape",
                blocks: [
                    {
                        kind: "p",
                        text: "A modern take that turns a dupatta into a light layer. It works well over a plain kurta or a simple dress.",
                    },
                    {
                        kind: "steps",
                        items: [
                            "Lay the dupatta around the back of your neck so both ends fall evenly down the front.",
                            "Open each side out so it covers your shoulders, like a cape.",
                            "Fasten a belt at your waist over the dupatta, catching both front panels.",
                            "Let the ends below the belt fall loose, and arrange the back so it hangs straight.",
                        ],
                    },
                ],
            },
            {
                id: "fabric",
                heading: "Which drape for which dupatta",
                blocks: [
                    {
                        kind: "list",
                        items: [
                            `Chiffon, like our ${productLink(LEHERIYA)}, is light and falls in soft folds. It's lovely in the open, flowing drapes: across both shoulders, or as a cape.`,
                            `Art silk (taffeta), like our ${productLink(BANDHANI)}, is a little crisper. It holds a pleat well, so it suits the one-shoulder drape.`,
                            "A gota border adds a little weight at the edge, which helps any drape hang neatly. Keep pins on the cloth, not through the gota.",
                        ],
                    },
                    {
                        kind: "p",
                        text: `Browse every colour in our ${link("dupattas collection", collectionPath("dupattas"))}.`,
                    },
                ],
            },
        ],
        related: [BANDHANI_GOTA, LEHERIYA, BANDHANI],
    },
    {
        slug: "how-to-wear-relaxed-cotton-trousers",
        title: "How to wear relaxed cotton trousers",
        description:
            "Fit notes, outfit ideas and care for Kalaf's 100% cotton relaxed trousers: elastic waist, wide straight leg, full length.",
        date: DATE,
        datePublished: ISO_DATE,
        category: "How to",
        ornament: "पतलून",
        hero: { handle: PANT, colour: "BE", index: 0 },
        intro: `Relaxed trousers sit somewhere between tailoring and comfort: neat enough for work, easy enough for a long journey. Our ${productLink(PANT)} are 100% cotton, with a wide straight leg. Here is how they fit, a few ways to wear them, and how to keep them looking good.`,
        sections: [
            {
                id: "cotton",
                heading: "Why cotton",
                blocks: [
                    {
                        kind: "p",
                        text: "Cotton breathes and absorbs moisture, which is why it's the everyday fabric of Indian summers. In a relaxed cut it feels soft and cool in warm weather, and the wide leg lets air move around you rather than clinging on a hot day. The trade-off is that cotton creases, and it can shrink if it's washed too hot, so a little care pays off.",
                    },
                ],
            },
            {
                id: "fit",
                heading: "How they fit",
                blocks: [
                    {
                        kind: "list",
                        items: [
                            "Fit: relaxed, with a wide straight leg that falls cleanly to full length.",
                            "Waist: elastic all the way round, with a front button and zip fly and belt loops, so they look tailored but give a little.",
                            "Pockets: two slant side pockets and two back welt pockets.",
                            `Length: about ${PANT_LENGTH} in, with a ${PANT_INSEAM} in inseam, in every size.`,
                            `Sizes: ${PANT_SIZES}. The size is your waist in inches.`,
                        ],
                    },
                    {
                        kind: "p",
                        text: `Choose your usual waist size. If your hips measure more than the chart shows for that size, go up one. The ${link("size guide", ROUTES.sizeGuide)} has the full waist and hip chart and how to measure.`,
                    },
                    {
                        kind: "p",
                        text: "Because the length is the same in every size, the hem will sit differently depending on your height. If you're shorter, a tailor can take it up easily; a straight leg is simple to shorten.",
                    },
                ],
            },
            {
                id: "wear",
                heading: "Ways to wear them",
                blocks: [
                    {
                        kind: "p",
                        text: "A wide leg looks best when the top half is a little neater or shorter, so the shape of the trouser shows. A few easy pairings:",
                    },
                    {
                        kind: "list",
                        items: [
                            "For work: a crisp shirt, tucked in, with a belt through the loops.",
                            "For weekends: a plain T-shirt or polo, half-tucked or loose, with sneakers or sandals.",
                            "For travel: a soft overshirt or knit, and comfortable shoes. The elastic waist makes long journeys easier.",
                            "With a kurta: a short kurta over the trousers gives an easy Indo-western look.",
                        ],
                    },
                    {
                        kind: "p",
                        text: `They come in ${list(PANT_COLOURS)}. Each goes with almost anything: black is the most formal, while white and beige feel lighter in the heat.`,
                    },
                ],
            },
            {
                id: "care",
                heading: "Care",
                blocks: [
                    {
                        kind: "p",
                        text: "Here's what the care label says:",
                    },
                    { kind: "list", items: PANT_CARE },
                    {
                        kind: "p",
                        text: `Washing them inside out and hanging them by the waistband to dry helps keep creases down. Cotton can shrink a little in hot water or a tumble dryer, so keep the water cold and skip the dryer. More in our ${link("care guide", ROUTES.careGuide)}.`,
                    },
                ],
            },
        ],
        related: [PANT],
    },
];

export function findArticle(slug: string | undefined) {
    return ARTICLES.find((a) => a.slug === slug);
}

/** The article's photo from the catalog, or null if it's gone. */
export function heroImage(
    article: Article
): (ProductImage & { alt: string }) | null {
    const product = byHandle(article.hero.handle);
    const variant = product?.variants.find(
        (v) => v.colourCode === article.hero.colour
    );
    const image = variant?.images[article.hero.index];
    if (!product || !variant || !image) return null;
    return { ...image, alt: `${product.title} in ${variant.colour}` };
}

// Inline links: "[label](/path)" in text.
const LINK = /\[([^\]]+)\]\(([^)\s]+)\)/g;

export type TextPart = string | { label: string; to: string };

/** Splits text into plain strings and { label, to } links. */
export function parseLinks(text: string): TextPart[] {
    const parts: TextPart[] = [];
    let last = 0;
    for (const m of text.matchAll(LINK)) {
        if (m.index > last) parts.push(text.slice(last, m.index));
        parts.push({ label: m[1], to: m[2] });
        last = m.index + m[0].length;
    }
    if (last < text.length) parts.push(text.slice(last));
    return parts;
}

/** Every piece of text in an article, in reading order. */
export function articleText(article: Article): string[] {
    return [
        article.intro,
        ...article.sections.flatMap((s) => [
            s.heading,
            ...s.blocks.flatMap((b) => (b.kind === "p" ? [b.text] : b.items)),
        ]),
    ];
}

/** Plain text with links reduced to their labels. */
const plain = (text: string) => text.replace(LINK, "$1");

export function wordCount(article: Article) {
    return articleText(article)
        .map(plain)
        .join(" ")
        .split(/\s+/)
        .filter(Boolean).length;
}

/** "4 min read" at ~200 words a minute. */
export function readingTime(article: Article) {
    return `${Math.max(1, Math.round(wordCount(article) / 200))} min read`;
}

/** Every internal path an article links to. */
export function articleLinks(article: Article): string[] {
    return articleText(article).flatMap((t) =>
        parseLinks(t).flatMap((p) => (typeof p === "string" ? [] : [p.to]))
    );
}
