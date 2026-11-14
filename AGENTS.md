# Kalaf.in — Agent Notes

kalaf.in is the website of **Kalaf**, a fashion label from Jaipur (Kalaf Apparels, a partnership firm) that makes cotton trousers and bandhani and leheriya dupattas. The site is a **catalogue only**: no accounts, cart or checkout. Every "Buy" button goes to the piece's listing on Flipkart or Meesho. Product data, photos, videos and business details come from the private **manishbisht/products.kalaf.in** repo through `scripts/sync-catalog.py`. Stack: Vite 8 + React 19 + TypeScript 6 (strict), React Router 7 with `BrowserRouter`, CSS Modules, ESLint 10 + Prettier, Yarn Classic. Every route is prerendered to static HTML at build time and hosted on GitHub Pages at https://kalaf.in. This file is the index: read it first, then the README of the folder you're working in.

## Run / build

`package.json` wants Node 26.x and local Node is older, so `yarn <script>` fails the engine guard. Install with `--ignore-engines` and call the binaries directly:

```bash
yarn install --ignore-engines
node_modules/.bin/vite                    # dev server
node_modules/.bin/tsc -b                  # typecheck
node_modules/.bin/eslint .                # lint + Prettier check (--fix to autofix)
node_modules/.bin/prettier --write .      # format only

# Full build = the 4 steps of `yarn build`:
node_modules/.bin/tsc -b
node_modules/.bin/vite build
node_modules/.bin/vite build --ssr src/entry-server.tsx --outDir node_modules/.tmp/ssr
node scripts/prerender.mjs                # per-route HTML, 404.html, sitemap.xml, robots.txt, llms.txt
```

## Hard rules

- **No border-radius, shadows or gradients** on cards, buttons or panels. The one exception is the round green WhatsApp badge (WhatsApp's own mark). Small round colour swatches and dots are fine.
- **Internal navigation uses `<Link to={…}>`** from `react-router-dom`, never `<a href="/…">`.
- **Shared values live in [`src/constants.ts`](src/constants.ts)**: brand and business details (`BRAND`), social URLs, routes (`ROUTES`, `productPath`, `collectionPath`). Don't hard-code an email, phone, route or URL that's already there.
- **Env vars only through [`src/env.ts`](src/env.ts)**. Nothing else reads `import.meta.env`.
- **Render must stay pure.** Prerendered pages hydrate, so anything that differs between build and browser (dates, `window`, `navigator`, random values) goes in an effect, not in render.
- **Never hand-edit generated files**: `src/data/catalog.json`, `src/data/business.json` and `public/catalog/`. Change the products repo or `scripts/sync-catalog.py` and re-sync.
- **Never commit `dist/`** (gitignored; CI builds it).
- **No Amazon.** The owner asked (2 Nov 2026) for nothing about Amazon on the site. Don't add an Amazon link, button, filter or mention.
- **No fabricated claims.** No made-up reviews, ratings, press, awards, customer counts or certifications. Copy must match the products repo and how Kalaf actually sells.
- **Commit titles read like a changelog**: CI turns them into release notes.

## Gotchas

- **Contractions in strings.** `'We don't ship'` ends the string at the apostrophe. Use double quotes or backticks; policy data files are full of contractions.
- **`verbatimModuleSyntax`** is on: type-only imports need `import type` or `import { x, type Y }`. Don't strip the keyword.
- **`noUnusedLocals` / `noUnusedParameters`** are on: prefix intentionally unused names with `_`.
- **JSX entities**: ESLint flags a raw `'` in JSX text. Write `&apos;`.
- **rolldown-vite errors** are very verbose (each character tinted). The useful line is `╭─[ path:line:col ]─` near the bottom.
- **`.env` is committed** and holds only public values; `.env.*.local` files are ignored. Never put a secret in `.env`.

## Where things are

| Folder                            | README                                               | What's there / when to read it                                                                                             |
| --------------------------------- | ---------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `src/`                            | [src/README.md](src/README.md)                       | Entry points (hydrate vs createRoot), App shell, design tokens, global CSS utilities, constants, env vars, Clarity, hooks. |
| `src/components/`                 | [src/components/README.md](src/components/README.md) | Every shared component; PolicyLayout in depth; BuyButtons' store rule; Nav, Footer, WhatsApp, Ask AI, Icons.               |
| `src/pages/`                      | [src/pages/README.md](src/pages/README.md)           | Routes table, Shop (filters/sort in the URL), Product page, NotFound, policy pages as data wrappers, adding a page.        |
| `src/data/`                       | [src/data/README.md](src/data/README.md)             | Generated catalog and business JSON, their types and helpers, swatch colours, old-handle redirects.                        |
| `src/seo/`                        | [src/seo/README.md](src/seo/README.md)               | Titles, meta, canonical, Open Graph, JSON-LD, sitemap/robots/llms.txt; what to add for a new page.                         |
| `scripts/`, `public/`, `.github/` | [scripts/README.md](scripts/README.md)               | Catalog sync, prerender, the static files in `public/`, and the GitHub Pages deploy with CalVer releases.                  |

`public/` and `.github/` have no README on purpose: Vite copies everything in `public/` to the live site, and GitHub would show `.github/README.md` as the repo's front page.

Root config: `vite.config.ts` (CSS in one file, no `public/` copy for the SSR build), `index.html` (fonts, icons, the `<!--seo-->` block the prerender fills), `tsconfig.json` → `tsconfig.app.json` (src, strict) + `tsconfig.node.json` (vite config), `eslint.config.js` (ts-eslint, react, hooks, Prettier as a rule), `.prettierrc`, `.env`.

## Recent session log

- Bootstrapped Vite + React with CSS Modules, ESLint + Prettier, then migrated everything to strict TypeScript.
- Built the policy and guide pages as data wrappers around `PolicyLayout`; moved brand, social and route literals into `src/constants.ts` and env reads into `src/env.ts`.
- Added Microsoft Clarity (env-gated) and the GitHub Pages deploy with CalVer release tags.
- Added the real catalog from products.kalaf.in: shop, collection and product pages with photos, videos and per-store buy links (12 Nov 2026: pant 100% cotton, pants' Flipkart link → pants.kalaf.in, Meesho blocked for pants).
- 14 Nov 2026: real business details (legal name, GSTIN, address, WhatsApp) synced from the products repo; real URLs with `BrowserRouter`, prerendered pages, per-page SEO, JSON-LD, sitemap and llms.txt.
- 14 Nov 2026: honest copy and real product photos on the home page, policies matched to how Kalaf sells, size and care guides rewritten for the pant and dupattas.
- 14 Nov 2026: shop/product UX (size chart, availability and dispatch time, swipe gallery with lightbox, share, sold-out last), buy-click tracking in Clarity, Amazon hidden.
- 14 Nov 2026: floating WhatsApp chat button and Ask AI links (Claude, ChatGPT, Perplexity) on product pages and in the footer.
- 14 Nov 2026: Journal (`/journal`, `/journal/:slug`): craft, draping and care articles from `pages/Journal/articles.ts`, with Article JSON-LD, sitemap and llms.txt entries, linked from the Nav and Footer.
