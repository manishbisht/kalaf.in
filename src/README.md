# src/

The app. Back to the index: [AGENTS.md](../AGENTS.md).

| Path               | What it is                                                                   |
| ------------------ | ---------------------------------------------------------------------------- |
| `main.tsx`         | Browser entry: old hash links, Clarity, hydrate or render.                   |
| `App.tsx`          | `BrowserRouter` + `Shell` (the layout and every `<Route>`).                  |
| `entry-server.tsx` | Build-only SSR entry used by `scripts/prerender.mjs`. Never shipped.         |
| `tokens.css`       | Design tokens (CSS custom properties) and the web-font imports.              |
| `index.css`        | Reset and global utility classes.                                            |
| `constants.ts`     | `BRAND`, `SOCIAL`, `ROUTES` and link helpers.                                |
| `env.ts`           | The only place that reads `import.meta.env`.                                 |
| `vite-env.d.ts`    | Vite client types + the `ImportMetaEnv` shape.                               |
| `hooks/`           | `usePageProduct`: the product/colour on the current page and its public URL. |
| `components/`      | Shared components → [components/README.md](components/README.md).            |
| `pages/`           | One folder per route → [pages/README.md](pages/README.md).                   |
| `data/`            | Generated catalog + business data → [data/README.md](data/README.md).        |
| `seo/`             | Head tags, JSON-LD, sitemap, llms.txt → [seo/README.md](seo/README.md).      |

## Entry points

- **`main.tsx`** imports `tokens.css` then `index.css`, rewrites old HashRouter links (`/#/products/x?colour=BK`) to real paths with `history.replaceState`, starts Clarity when `ENV.clarityProjectId` is set, and removes the static `[data-seo]` head tags the prerender wrote (`<Seo />` renders the live ones). It calls `hydrateRoot` only when `#root[data-path]` equals the current path, there's no query string and `#root` has content. Otherwise (`?colour=`, shop filters, `404.html`, old hash links) it uses `createRoot`, because the prerendered HTML is for the plain URL.
- **`App.tsx`** lazy-loads every page (one chunk per route) and exports `Shell`: `<Seo />`, `ScrollToTop`, `<Nav dark={…}>`, the `<Routes>`, `<Footer />` and `<WhatsAppButton />`. `DARK_NAV` lists the paths whose page opens with a dark hero (the policy and guide pages). `ScrollToTop` scrolls to the top on every pathname change and fires `Clarity.event("page_view")`.
- **`entry-server.tsx`** renders `<StaticRouter><Shell seo={false} /></StaticRouter>` with `react-dom/static`'s `prerender` (which waits for lazy pages) and re-exports the SEO helpers the prerender script needs. `seo={false}` because the script writes head tags itself.

Because pages are prerendered and then hydrated, **render must be pure**: anything browser-only goes in an effect.

## Conventions

- **Folder per unit**: every component and page is a folder with `index.tsx` and, if styled, `style.module.css`. Bigger units split helpers into sibling files (`Footer/LinkColumn.tsx`, `PolicyLayout/types.ts`). No flat `Foo.tsx` under `components/` or `pages/`.
- **Exports**: components are named (`export function Nav`), pages are default (`export default function Privacy`). `PolicyLayout` is a default export with named types and cross-link sets.
- **Styling**: component styles in `style.module.css` as `styles.foo`; global utilities as plain class strings; dynamic values as inline `style={{}}`. Use tokens (`var(--ink)`), not raw hex/px.
- **Formatting**: 4 spaces, double quotes, semicolons, `trailingComma: "es5"` (`.prettierrc`), enforced by ESLint.

## Design tokens (`tokens.css`)

- **Colours**: `--ink #000`, `--charcoal #1a1a1a`, `--off-white #f5f5f5`, `--bone #ede8df`, `--paper #fff`, `--sand #c9b79c`, `--olive #6b6a47`, `--smoke #9a9a98`; borders `--line` (light backgrounds) and `--line-dark` (dark). Semantic aliases `--fg`, `--bg`, `--border`, `--accent` flip inside `.surface-dark`.
- **Fonts**: `--font-display` (Clash Display), `--font-head` (Space Grotesk), `--font-body` (Inter), `--font-devan` (Tiro Devanagari Hindi). Type scale `--t-hero` … `--t-eyebrow`.
- **Spacing / layout**: `--s-1` (4px) … `--s-40` (160px); `--container-max 1440px`; `--page-pad 80px` (`-md` 40, `-sm` 20).
- **Motion**: `--ease` cubic-bezier(0.22, 1, 0.36, 1); `--dur-fast` 200ms, `--dur-base` 400ms, `--dur-slow` 800ms, `--dur-cinem` 1200ms.
- **Other**: `--r-0` (radius is 0 by design), `--z-nav` / `--z-modal` / `--z-toast`.

Global utilities in `index.css`: `.container`, `.section`, `.section-tight`, `.section-head`, `.btn` + `.btn-primary` / `.btn-secondary` / `.btn-ghost`, `.chip` / `.chip-dark`, `.img-zoom`, `.fade-up` (+ `.d1`–`.d4` delays), `.t-eyebrow`.

## Constants (`constants.ts`)

- `BRAND`: `name`, `wordmark`, `devanagari`, `legalName`, `constitution`, `gstin`, `address`, `location`, `email`, `phone`, `whatsapp`, `workingHours`, `copyrightYear`. Business fields come from `data/business.json`; Kalaf Apparels is a partnership firm, so there's no CIN. Put brand values in copy with template literals: `` `Email ${BRAND.email}` ``.
- `telHref(phone)`, `whatsappHref(phone)`: `tel:` and `wa.me` links from a formatted number.
- `SOCIAL`: Facebook, Instagram, LinkedIn, X URLs.
- `MARKETPLACE_ORDERS`: where buyers track a marketplace order (Track Order page).
- `ROUTES` (every route path) and `productPath(handle, colour?)` / `collectionPath(handle)`.

## Env vars (`env.ts`)

| `ENV` key          | `.env` variable           | Meaning                                        |
| ------------------ | ------------------------- | ---------------------------------------------- |
| `clarityProjectId` | `VITE_CLARITY_PROJECT_ID` | Clarity project ID; blank turns analytics off. |
| `buildVersion`     | `VITE_BUILD_VERSION`      | CalVer stamp from CI (`YYYY.MM.DD.HHMM` UTC).  |
| `commitSha`        | `VITE_COMMIT_SHA`         | Full commit SHA from CI.                       |

`buildVersion` and `commitSha` show in the footer's build stamp ("Build dev · local" locally). To add a variable: (1) add it to `.env` with a comment (committed, public values only), (2) add it to `ImportMetaEnv` in `vite-env.d.ts`, (3) add it to `ENV` in `env.ts`, (4) import `ENV` where it's used. If CI must set it, add it to the build step's `env:` in `.github/workflows/deploy.yml`.

## Analytics (Microsoft Clarity)

`main.tsx` calls `Clarity.init` only when `ENV.clarityProjectId` is set (CI passes it from the `CLARITY_PROJECT_ID` repo secret; blank locally, so dev sends nothing). The SDK injects its own script at runtime. Custom signals today: `page_view` events from `ScrollToTop`, plus click events from [`analytics.ts`](analytics.ts):

| Event            | Tags                                                 | Fired by         |
| ---------------- | ---------------------------------------------------- | ---------------- |
| `buy_click`      | `store`, `sku`, `product` (SKU/product may be blank) | `BuyButtons`     |
| `whatsapp_click` | `page`: the product SKU, else the pathname           | `WhatsAppButton` |
| `ask_ai_click`   | `assistant`: Claude, ChatGPT or Perplexity           | `AskAI`          |
| `links_click`    | `target`: which button on `/links`                   | `pages/Links`    |

Add new events there with `trackEvent(name, tags)`, and wire them with `{...trackClicks(() => …)}`, which counts left and middle clicks but not right-clicks. `trackEvent` is a no-op without `ENV.clarityProjectId`, swallows Clarity errors and never prevents the default, so tracking can't block or break a link.

## hooks/

`usePageProduct()` returns `{ product, variant, url }` for the current page: the product and chosen colour on `/products/:handle` (else nulls), and the page's public `https://kalaf.in…` URL. `WhatsAppButton` and `AskAI` use it to pre-fill their messages.
