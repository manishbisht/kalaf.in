# src/pages/

One folder per route, each with a default-exported page. `App.tsx` lazy-loads them and wraps them in the shell (Seo, Nav, Footer, WhatsApp button), so a page renders only its own content. Back to the index: [AGENTS.md](../../AGENTS.md).

## Routes

URLs are real paths (`BrowserRouter`); every route below is prerendered to static HTML at build time (see [scripts/README.md](../../scripts/README.md)).

| `ROUTES` key      | Path                   | Page              | Nav   |
| ----------------- | ---------------------- | ----------------- | ----- |
| `home`            | `/`                    | `Home`            | light |
| `products`        | `/products`            | `Shop` (all)      | light |
| `collection`      | `/collections/:handle` | `Shop` (one)      | light |
| `product`         | `/products/:handle`    | `Product`         | light |
| `journal`         | `/journal`             | `Journal`         | light |
| `journalArticle`  | `/journal/:slug`       | `JournalArticle`  | light |
| `privacy`         | `/privacy`             | `Privacy`         | dark  |
| `shippingReturns` | `/shipping-returns`    | `ShippingReturns` | dark  |
| `terms`           | `/terms`               | `Terms`           | dark  |
| `refundPolicy`    | `/refund-policy`       | `RefundPolicy`    | dark  |
| `cookies`         | `/cookies`             | `CookiePolicy`    | dark  |
| `sizeGuide`       | `/size-guide`          | `SizeGuide`       | dark  |
| `careGuide`       | `/care-guide`          | `CareGuide`       | dark  |
| `trackOrder`      | `/track-order`         | `TrackOrder`      | dark  |
| `contact`         | `/contact`             | `Contact`         | dark  |
| `faq`             | `/faq`                 | `Faq`             | dark  |
| `links`           | `/links`               | `Links`           | light |
| (none)            | `*`                    | `NotFound`        | light |

Link with `ROUTES.*`, `productPath(handle, colour?)`, `collectionPath(handle)` and `journalPath(slug)` from `src/constants.ts`.

## Home

Composes the marketing components in order: `Hero`, `Drop`, `Process`, `WhyKalaf`, `Lookbook`, `Newsletter` (see [components/README.md](../components/README.md)). Only the pant is featured.

## Shop (`/products`, `/collections/:handle`)

One page for both. The handle is `pants` or `dupattas`; an unknown handle shows "Collection not found". The grid shows one `ProductCard` per colour (`LISTING`).

- **Filters and sort live in the query string** so filtered views can be shared: `?colour=Red,Pink&store=Flipkart&sort=price-asc`. Groups (in `filters.ts`): category, style, colour (colour family), fabric, size, store ("Available on", only stores with a live link). Values in an old link that no longer exist (e.g. `?store=Amazon`) are ignored. Updates use `setParams(…, { replace: true })`.
- **Sorts**: featured (default), price low→high, price high→low, name. Sold-out pieces always go last.
- `FilterPanel.tsx` is the sidebar; at 900px and below it becomes a drawer (focus on open, Esc closes, page scroll locked). The narrow-screen check uses `useSyncExternalStore` with a server value of `false`, so the prerendered HTML hydrates cleanly. `Share.tsx` does the same for `navigator.share`.

## Product (`/products/:handle?colour=CODE`)

`findProduct` resolves the handle (old handles redirect, see [data/README.md](../data/README.md)); an unknown one shows "Product not found". `?colour=` picks the variant (default: the first), and the colour swatches switch it with `replace`.

- **`Gallery.tsx`**: horizontal scroll-snap strip (swipe on phones; thumbnails, arrows and ←/→ on desktop). The video, if any, sits second and plays only while visible. Clicking a photo opens **`Lightbox.tsx`**, a native `<dialog>` that loads only the 1200w photo on screen; closing it lands the strip on the last photo viewed and focuses that slide's button (`restoreFocus={false}`), not the original opener, which may now be hidden.
- **Sizes and size chart**: size buttons plus a collapsible waist/hip table from `product.sizeChart`. If `variant.sizeLinks` has a link for the chosen size, the Flipkart button uses it. The pants have no size links today (one owner link for all sizes), so sizes are information only.
- **Availability**: "In stock · dispatched from Jaipur in N working days", or "Sold out in {colour}" (plus "try another colour" if any are in stock). Stock `null` means unknown: only the dispatch time is shown.
- **`BuyButtons`** with per-store prices and the SKU for click tracking, then a one-line note that prices are as listed by each store and the price at the marketplace's checkout applies (prices come from the products repo, so they can lag a store's change or offer); **`Share.tsx`** (system share sheet where available, else copy link, plus WhatsApp); details, features and care lists; `AskAI`; up to four related in-stock colours from the same collection.

## Links (`/links`)

The link-in-bio page for the Instagram and Facebook bios: wordmark, one line about Kalaf, then full-width square buttons (pants on Flipkart from the pant's catalog link, dupattas, all products, WhatsApp, Instagram) and the email. A button whose target is missing (no Flipkart link, no WhatsApp number) is left out. Each click fires Clarity's `links_click` tagged with its `target`. It's indexable but kept out of `sitemap.xml` (`NOT_IN_SITEMAP` in `src/seo`).

## Journal (`/journal`, `/journal/:slug`)

Short articles about the crafts (bandhani, leheriya, gota), draping and the pant. All content is data in **`Journal/articles.ts`** (`ARTICLES`): slug, title, description, date (`date` shown, `datePublished` ISO), category, a Devanagari ornament, a hero photo picked from the catalog (`{ handle, colour, index }`), intro, sections of blocks (`p`, `list`, `steps`) and the related product handles. Text can hold inline links as `[label](/path)`, built from `ROUTES` / `productPath` / `collectionPath` / `journalPath`; `JournalArticle/RichText.tsx` renders them as `<Link>`s. Reading time is computed from the word count.

- `Journal/` is the index: the newest article featured, the rest in a grid.
- `JournalArticle/` is one article: header with photo, a contents rail, the sections, "Shop the pieces" (`ProductCard`s, one in-stock colour per related product in turn, up to four) and "More from the journal". An unknown slug renders `NotFound`.
- SEO (title, Article + BreadcrumbList JSON-LD, prerender, sitemap, llms.txt) comes from the same data in `src/seo`.
- `articles.test.ts` checks every related handle, hero photo and inline link exists, and keeps each article at 400–700 words.

**Content rules.** Write about the crafts in general, well-established terms and hedge where traditions vary ("often", "traditionally"). Say nothing about how or by whom Kalaf's own pieces are made beyond what the catalog states (fabric, size, fit, care); no artisan stories, dyes, timings, statistics or quotes. To add an article, append to `ARTICLES` and run the tests.

## NotFound

Catch-all for unknown paths: a 404 message with links to the shop and both collections. Its head is `noindex`. GitHub Pages serves `dist/404.html` for unknown URLs, and the client router then renders the right page (for example an old product handle) or this one.

## Policy and guide pages

`Privacy`, `ShippingReturns`, `Terms`, `RefundPolicy`, `CookiePolicy` (`POLICY_CROSS_LINKS`) and `SizeGuide`, `CareGuide`, `TrackOrder`, `Contact`, `Faq` (`HELP_CROSS_LINKS`) are data wrappers: `data.ts` exports a typed `PolicyData` object and `index.tsx` renders `<PolicyLayout data={data} currentSlug="…" crossLinks={…} />`. The size and care guides build their numbers from the catalog (size chart, dupatta size, care lists); Contact and Track Order use `BRAND` and `MARKETPLACE_ORDERS`. The FAQ is `qa` blocks whose answers are built from `PRODUCTS` and `BRAND` (stores per collection from live links, sizes, fabrics, dispatch days, contact details); `FAQ_ENTRIES` feeds the same plain-text answers to the FAQPage JSON-LD, so keep answers factual and free of markup. Copy must describe how Kalaf really sells: on Flipkart and Meesho, under each marketplace's own shipping, return and refund policy. Bump `updated` when you change a policy. See [components/README.md](../components/README.md#policylayout) for the data shape.

## Adding a page

1. Create `src/pages/Foo/index.tsx` (default export). For a policy or guide page, add `data.ts` with `export const data: PolicyData = …`.
2. Add the path to `ROUTES` in `src/constants.ts`.
3. Add a lazy import and a `<Route>` in `src/App.tsx`. If the page opens with a dark hero, add its path to `DARK_NAV`.
4. For a policy or guide page, add it to `POLICY_CROSS_LINKS` or `HELP_CROSS_LINKS` (`components/PolicyLayout/links.ts`) and, if wanted, the Footer's Help or Policies column.
5. Add its title and description to `STATIC_PAGES` in `src/seo/index.ts`. That also prerenders it and lists it in `sitemap.xml` ([seo/README.md](../seo/README.md)).
