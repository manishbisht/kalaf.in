# src/components/

Shared components, one folder each (`index.tsx` + optional `style.module.css` + helper files), all named exports except `PolicyLayout`. Back to the index: [AGENTS.md](../../AGENTS.md).

## The set

| Component        | What it does                                                                                                                       |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `Nav`            | Top bar on every page (rendered by the App shell). `dark` for pages with a dark hero.                                              |
| `Footer`         | Footer on every page: shop, contact, help and policy links, socials, Ask AI, legal line, build stamp.                              |
| `WhatsAppButton` | Floating "Chat with us" badge, bottom-right on every page except `/links` (it has its own WhatsApp button).                        |
| `AskAI`          | "Ask AI about this page" links to Claude, ChatGPT and Perplexity, in the footer (page-aware).                                      |
| `CatalogImage`   | Catalog photos (shop, product, home, journal): `<picture>` with AVIF + JPEG fallback. `sizes` for 600w/1200w; lazy below the fold. |
| `BuyButtons`     | One button per live marketplace, plus "coming soon" placeholders. Clicks are logged to Clarity (`src/analytics.ts`).               |
| `ProductCard`    | Shop-grid tile for one colour; second photo on hover; "Sold out"/"% off" badge; `eager` for the first row.                         |
| `Swatch`         | Round colour dot; multicolour codes render as segments (colours from `swatchColours`).                                             |
| `PolicyLayout`   | The shell every policy and guide page renders (below).                                                                             |
| `ErrorBoundary`  | Catches a page that throws (or won't load) and shows "Something went wrong" with Reload and Home buttons.                          |
| `Icons`          | Inline SVG set: `<Icon name="arrowUpRight" size={16} />`; `IconName` is a string union, so typos fail tsc.                         |
| `Hero`           | Home: the pant's three colourways, worn; "Buy" goes to the first colour with a Flipkart link.                                      |
| `Drop`           | Home: the pant (catalog code `PNT`) with video, colour swatches, facts and `BuyButtons`.                                           |
| `Process`        | Home: how pieces are made, illustrated with catalog photos and the dispatch time from the catalog.                                 |
| `WhyKalaf`       | Home: feature cards (fabric, fit, craft, made in Jaipur, small batches, where to buy).                                             |
| `Lookbook`       | Home: catalog photos, each linking to that product in that colour.                                                                 |
| `Newsletter`     | Home: there's no mailing list (no backend), so it points people to the social accounts.                                            |

Home-page components read the catalog directly, so they update when the catalog is re-synced. Keep their copy factual: no invented reviews, numbers or claims.

## Nav

Desktop: Shop all / Pants / Dupattas / Journal on the left, the `kalaf.in` wordmark (home link) centred, all inside `<nav aria-label="Main">`; the left links are `NavLink`s, so the current one gets `aria-current="page"`. On mobile the left links hide and a single "Shop" link shows on the right. An announcement strip under it says where each collection is sold. `App.tsx` passes `dark` for paths in `DARK_NAV` (the policy and guide pages); home, shop, product and 404 use the light Nav.

## Footer

Same on every page. Columns (a `<nav aria-label="Footer">`, each titled with an `h2`): brand blurb + `SocialRow` (Instagram, Facebook, LinkedIn, X from `SOCIAL`, opened in a new tab with `rel="noopener noreferrer"`) + `<AskAI dark />`; Shop (with the Journal); Get in touch (email, WhatsApp and phone when `BRAND` has them); Help; Policies. Internal links use `<Link>`. The bottom row shows the legal name, constitution, GSTIN and address; `BuildStamp` prints `ENV.buildVersion` and the short commit SHA.

## WhatsAppButton and AskAI

Both use `usePageProduct()` (`src/hooks/`) to pre-fill a message. On a product page it names the piece, colour and public URL; elsewhere it's a general question. `WhatsAppButton` renders nothing if `BRAND.whatsapp` is empty and links to `whatsappHref(BRAND.whatsapp)?text=…`, inside an `<aside aria-label="WhatsApp chat">` landmark. Its round green badge is the only element allowed a border-radius. `AskAI`'s prompt points the assistant at the page URL and `https://kalaf.in/llms.txt`.

## BuyButtons: the store rule

`<BuyButtons links prices sku compact />` shows a store **only when `links` has a URL for it**. The first live store is `btn-primary`, the rest `btn-secondary`; links open in a new tab. When the stores charge different prices, each button shows its own price. A store with no link for this piece shows as "{Store} — coming soon" **only if** Kalaf sells something else there (`SOLD_ON` in `src/data/catalog.ts`; today: the pant on Meesho). A store nothing is live on is never shown, which is how Amazon stays hidden. Clicks fire Clarity's `buy_click` event via `trackBuyClick` from `src/analytics.ts` (no-op without a Clarity ID, never blocks the link). Links come from the catalog only; never hand-type a marketplace URL.

## PolicyLayout

Default export; every policy and guide page is a thin wrapper around it. It renders the dark hero (breadcrumb, eyebrow, title, Devanagari ornament, summary, updated date, read time), an optional three-card promises band, the body with a sticky table of contents and scroll-spy, a signature block (wordmark, legal name, constitution, location, GSTIN, effective date) and a cross-link strip to sibling pages (current one dimmed, "You are here"). Nav and Footer come from the App shell, not from here.

```tsx
import PolicyLayout, {
    POLICY_CROSS_LINKS, // or HELP_CROSS_LINKS
    type PolicyData,
} from "../../components/PolicyLayout";

// data.ts
export const data: PolicyData = {
    eyebrow: "Policy 0X",
    title: "Page title",
    ornament: "देव", // Devanagari flourish in the hero
    summary: "…",
    updated: "14 Nov 2026",
    readTime: "3 min read",
    crossLinksHeader: "More guides", // optional; default "The other policies"
    promises: [{ kicker: "…", label: "…", body: "…" }], // optional band
    sections: [
        {
            id: "slug", // TOC anchor (#sec-slug)
            title: "Section",
            body: [
                { kind: "p", text: "…" },
                { kind: "list", items: ["…"] },
                { kind: "links", items: [{ label: "…", href: "…", sub: "…" }] },
                {
                    kind: "table",
                    caption: "…",
                    head: ["Size", "Waist"],
                    rows: [["28", "28 in"]],
                },
            ],
            steps: ["…"], // optional numbered steps
            callout: { label: "…", value: "…" }, // optional
        },
    ],
};

// index.tsx
<PolicyLayout
    data={data}
    currentSlug="privacy"
    crossLinks={POLICY_CROSS_LINKS}
/>;
```

- **Annotate `const data: PolicyData`.** Without it TypeScript widens `kind: "p"` to `string` and the `PolicyBodyBlock` union stops matching.
- **Body blocks**: `p`, `list`, `links` (internal `/…` hrefs route with `<Link>`; external `http…` hrefs open in a new tab), `qa` (an FAQ entry: question heading, plain-text answer, optional links) and `table` (first column is the row header; used for the size chart).
- **Cross-link sets** (`links.ts`): `POLICY_CROSS_LINKS` (privacy, returns, terms, refund, cookies) and `HELP_CROSS_LINKS` (size-guide, care-guide, track-order, contact, faq). `currentSlug` must match a `slug` there.
- **Adding a page**: see [src/pages/README.md](../pages/README.md#adding-a-page).
- On policy pages the `--ink` cross-link strip runs into the `--charcoal` footer as one dark block. That's intentional.
