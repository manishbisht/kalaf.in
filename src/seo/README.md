# src/seo/

Everything that goes in a page's `<head>` plus the site-wide text files for crawlers. One function feeds both the browser and the build-time prerender, so the static HTML and the live app always agree. Back to the index: [AGENTS.md](../../AGENTS.md).

## Files

- **`index.ts`**: `seoFor(pathname, search?)` → `SeoData` (`title`, `description` clipped to 160 chars, `canonical`, `url`, `image`, `type`, `noindex`, `jsonLd[]`). Also `prerenderPaths()`, `headHtml()`, `metaTags()`, `jsonLdText()`, `notFoundSeo()`, `sitemapXml()`, `robotsTxt()`, `llmsTxt()`, and `SITE_URL = "https://kalaf.in"`.
- **`Seo.tsx`**: `<Seo />`, rendered once by the App shell. It renders `<title>`, `<meta>` and `<link rel="canonical">`, which React 19 hoists into `<head>`, and keeps JSON-LD in one managed `<script id="seo-jsonld">` (JSON-LD isn't hoisted).

## What each page gets

| Path                   | Title / description from                              | JSON-LD                                                        |
| ---------------------- | ----------------------------------------------------- | -------------------------------------------------------------- |
| `/`                    | `HOME`                                                | Organization (legal name, GSTIN, address, socials) + WebSite   |
| `/products`            | `SHOP_ALL`                                            | ItemList + BreadcrumbList                                      |
| `/collections/:handle` | `COLLECTION_HEAD`; image = first photo                | ItemList + BreadcrumbList                                      |
| `/products/:handle`    | built from the catalog (title, colour, price, stores) | Product (offers per live store, availability) + BreadcrumbList |
| `/faq`                 | `STATIC_PAGES`                                        | FAQPage (questions and answers from `pages/Faq/data.ts`)       |
| policy / guide pages   | `STATIC_PAGES`                                        | none                                                           |
| anything else          | `notFoundSeo` (`noindex`)                             | none                                                           |

- Titles end with ` · Kalaf` (except home). Canonical is `https://kalaf.in<path>` with no query string; `url` keeps `?colour=` so a shared colour link previews that colour.
- `og:image` defaults to `/og-image.jpg`; product pages use the variant's photo. The Organization logo is `/icon-512.png`.
- Store names in descriptions come from live links only, so Amazon never appears.

## Prerender and crawler files

`scripts/prerender.mjs` (see [scripts/README.md](../../scripts/README.md)) calls `seoFor(path)` and `headHtml()` for each path from `prerenderPaths()` (home, `/products`, each collection, each product, every `STATIC_PAGES` path) and writes the tags into the `<!--seo-->…<!--/seo-->` block of `index.html`, each marked `data-seo`. `main.tsx` removes those on load so `<Seo />` doesn't duplicate them, and the SSR render passes `seo={false}` to `Shell` for the same reason.

It also writes:

- `sitemap.xml`: every prerendered URL except `NOT_IN_SITEMAP` (`sitemapPaths()`), `lastmod` = build date.
- `robots.txt`: allow all, plus the sitemap URL.
- `llms.txt` ([llmstxt.org](https://llmstxt.org) format): a plain-text summary of the brand, each product (sizes, colours, price, where to buy), help and policy links and contact details, built **only** from `catalog.json` and `business.json`. The Ask AI links point assistants at it. Keep it factual.

## Adding a page

Add its path to `STATIC_PAGES` with a `title` (no suffix) and a `description` (~150 chars, factual). That gives it head tags, prerenders it and puts it in the sitemap. For JSON-LD of its own, add a builder to `STATIC_JSON_LD` (the FAQ does). `brandTitle: true` drops the ` · Kalaf` suffix when the title already names the brand (`/links`: "Kalaf — links"). A utility page that should be prerendered and indexable but not listed in the sitemap goes in `NOT_IN_SITEMAP` (`/links`); `sitemapPaths()` is `prerenderPaths()` minus those. A page with a different shape (like a collection) needs its own branch in `seoFor` and an entry in `prerenderPaths()`. Also follow the page checklist in [pages/README.md](../pages/README.md#adding-a-page).
