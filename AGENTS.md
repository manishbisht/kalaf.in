# Kalaf.in — Agent Notes

A Vite + React 19 single-page app for **Kalaf**, a premium Indian fashion brand from Jaipur. Frontend-only — no backend yet. Deployed to GitHub Pages via CI. This file is the orientation doc for any agent picking up work in this repo.

## Tech stack

- **Vite 8** + **React 19** (no Next.js, no SSR — built as a static SPA)
- **TypeScript 6** (strict mode, project references)
- **React Router DOM v7**, **HashRouter** (paths look like `/#/privacy`) — chosen so GitHub Pages serves it as a single static `index.html` without server rewrites
- **CSS Modules** (`*.module.css`) + global tokens/utilities
- **ESLint v10** flat config + **typescript-eslint** + **eslint-plugin-prettier** (Prettier runs as an ESLint rule)
- **Yarn Classic 1.x** enforced via `preinstall` script
- **@microsoft/clarity** for behavioural analytics (env-gated)

## Run / build

`package.json` declares `engines.node: 26.x` but local Node is older — every yarn command needs `--ignore-engines`, and `yarn <script>` often fails the engine guard. The reliable pattern:

```bash
yarn install --ignore-engines
node_modules/.bin/vite                    # dev server
node_modules/.bin/tsc -b                  # typecheck only
node_modules/.bin/vite build              # bundle (skips typecheck)
node_modules/.bin/eslint .                # lint + prettier check
node_modules/.bin/eslint . --fix          # autofix formatting
node_modules/.bin/prettier --write .      # format only
```

The `build` npm script chains both: `tsc -b && vite build`.

Don't run `yarn <script>` directly in this environment — call binaries from `node_modules/.bin/` instead.

## Folder structure

```
.github/workflows/deploy.yml   ← GitHub Pages deploy (CalVer-tagged release)
.env                           ← VITE_CLARITY_PROJECT_ID (blank locally)
tsconfig.json                  ← root, references the two below
tsconfig.app.json              ← src/ — strict TS, verbatimModuleSyntax, noUnused*
tsconfig.node.json             ← vite.config.ts
eslint.config.js               ← flat config: ts-eslint + react + hooks + prettier
.prettierrc                    ← 4-space, double quotes, semicolons, trailingComma:"es5"

src/
  tokens.css                   ← design tokens (colors, type, spacing, motion)
  index.css                    ← global utilities (.container, .section, .btn*, .t-eyebrow, .img-zoom, .chip, .fade-up)
  vite-env.d.ts                ← /// <reference types="vite/client" /> + ImportMetaEnv augmentation
  env.ts                       ← single read-point for every VITE_* var (export const ENV)
  constants.ts                 ← BRAND, SOCIAL, ROUTES (single source of truth)
  main.tsx                     ← entry — imports tokens.css then index.css; gates Clarity.init on ENV
  App.tsx                      ← HashRouter + Routes + ScrollToTop
  components/
    Nav/        index.tsx + style.module.css
    Hero/       …
    Drop/       …
    Process/    …
    WhyKalaf/   …
    Lookbook/   …
    Newsletter/ …
    Footer/     …
    Cart/       …
    Icons/      index.tsx (inline SVG set; no css module; IconName string-union for type-safe lookups)
    PolicyLayout/  ← shared layout for all policy/guide pages
  pages/
    Home/                 ← composes the marketing components
    ShippingReturns/      ← data-only wrapper around PolicyLayout
    Privacy/              ← ”
    Terms/                ← ”
    RefundPolicy/         ← ”
    CookiePolicy/         ← ”
    SizeGuide/            ← ”
    CareGuide/            ← ”
    TrackOrder/           ← ”
    Contact/              ← ”
```

## Conventions

**Folder-per-unit**: every component and page is a directory containing `index.tsx` and (where styles exist) `style.module.css`. No flat `Foo.tsx` files.

**Export style**:
- Components: named exports — `export function Nav(...)`. Import as `import { Nav } from "../../components/Nav"`.
- Pages: default exports — `export default function Privacy()`. Import as `import Privacy from "./pages/Privacy"`.
- `PolicyLayout` is a default export (layout, semantically page-shell). Its data types and cross-link sets are named exports: `import PolicyLayout, { POLICY_CROSS_LINKS, HELP_CROSS_LINKS, type PolicyData } from "..."`.

**Styling**:
- Component-scoped → `style.module.css`, referenced as `styles.foo`.
- Global utilities → live in `src/index.css`, applied as plain class strings (`"container"`, `"t-eyebrow"`, `"btn btn-primary"`).
- Conditional/dynamic → inline `style={{}}`.
- The brand has **no border-radius on cards**, **no shadows**, **no gradients**. Don't introduce them.

**Formatting**: 4-space indent, double quotes, semicolons (`.prettierrc`). Auto-applied on `eslint --fix`. Don't fight the formatter.

**Internal navigation must use `<Link to={ROUTES.foo}>`** from `react-router-dom`. Plain `<a href="/x">` causes a full reload and breaks SPA state. Plain `<a>` doesn't navigate.

**Repeated values go in `src/constants.ts`**. Currently centralised: email/phone/legal name/CIN/location/wordmark/devanagari/working hours/copyright year (`BRAND`); the four social URLs (`SOCIAL`); all 10 route paths (`ROUTES`). Don't duplicate any of these — import the constant.

## Routes (`src/App.tsx`)

| Path constant | URL | Page |
|---|---|---|
| `ROUTES.home` | `/` | Home (marketing) |
| `ROUTES.shippingReturns` | `/shipping-returns` | Policy 02 |
| `ROUTES.privacy` | `/privacy` | Policy 01 |
| `ROUTES.terms` | `/terms` | Policy 03 |
| `ROUTES.refundPolicy` | `/refund-policy` | Policy 04 |
| `ROUTES.cookies` | `/cookies` | Policy 05 |
| `ROUTES.sizeGuide` | `/size-guide` | Guide 01 |
| `ROUTES.careGuide` | `/care-guide` | Guide 02 |
| `ROUTES.trackOrder` | `/track-order` | Orders |
| `ROUTES.contact` | `/contact` | Support |

URLs are hash-based (`/#/privacy` etc.) because of `HashRouter`. Internal `<Link>` calls work transparently.

A `ScrollToTop` helper in `App.tsx` resets `window.scrollTo(0, 0)` on every `pathname` change. Without it, routing from a page footer lands the user at the bottom of the next page.

## PolicyLayout — the shared shell

All 9 non-home pages are thin data-only wrappers around `components/PolicyLayout`. Each page file is:

```tsx
import PolicyLayout, {
    POLICY_CROSS_LINKS,
    type PolicyData,
} from "../../components/PolicyLayout";
import { BRAND } from "../../constants";

const data: PolicyData = {
    eyebrow: "Policy 0X",
    title: "Page title",
    ornament: "देव",                          // Devanagari background flourish in the hero
    summary: "…",
    updated: "23 May 2026",
    readTime: "N min read",
    crossLinksHeader: "The other policies",    // optional — defaults to "The other policies"
    promises: [{ kicker, label, body }, …],    // optional 3-card band on bone bg
    sections: [
        {
            id: "slug",
            title: "Section",
            body: [
                { kind: "p", text: "…" },
                { kind: "list", items: ["…", "…"] },
            ],
            steps: ["…", "…"],                  // optional bone-box numbered steps
            callout: { label, value },           // optional left-ruled callout
        },
    ],
};

export default function Page() {
    return <PolicyLayout data={data} currentSlug="slug" crossLinks={POLICY_CROSS_LINKS} />;
}
```

`PolicyLayout` owns: dark hero w/ breadcrumb, optional promises strip, sticky-TOC body with scroll-spy, signature block, cross-link strip (current page dimmed + "You are here"), Nav (dark mode), Footer, Cart drawer.

**Why explicit `const data: PolicyData = …`?** Without the annotation, TS widens literals (`kind: "p"` → `string`), breaking the `PolicyBodyBlock` discriminated union match.

Two cross-link sets are exported by `PolicyLayout/index.tsx`:
- `POLICY_CROSS_LINKS` (5 items) — legal pages
- `HELP_CROSS_LINKS` (4 items) — guides

To add a new policy/guide page: create `src/pages/Foo/index.tsx` with a typed `data` object → render `<PolicyLayout>` → add a `ROUTES` entry → add a `<Route>` in `App.tsx` → add the entry to the relevant cross-link set.

## Constants (`src/constants.ts`)

Three exports, all `as const`:

- `BRAND` — `name`, `wordmark`, `devanagari`, `legalName`, `cin`, `location`, `email`, `phone`, `workingHours`, `copyrightYear`. Used by Footer/Nav/PolicyLayout and all policy page data. Body text with embedded brand values uses template literals (e.g. `` `Email ${BRAND.email} with a photo…` ``).
- `SOCIAL` — `facebook`, `instagram`, `linkedin`, `x` URLs. Used only by Footer's social row.
- `ROUTES` — all 10 page paths. Used by `App.tsx` routes, `PolicyLayout` cross-links, `Footer` Help/Policies columns.

A grep for hardcoded `hello@kalaf.in`, `Kalaf Atelier`, route literals etc. should return zero matches in `src/`.

## Design tokens (`src/tokens.css`)

- **Colors** — `--ink #000`, `--charcoal #1a1a1a`, `--off-white #f5f5f5`, `--bone #ede8df`, `--paper`, `--sand #c9b79c`, `--olive`, `--smoke #9a9a98`. Borders: `--line` (light bg), `--line-dark` (dark bg).
- **Fonts** — `--font-display` (Clash Display), `--font-head` (Space Grotesk), `--font-body` (Inter), `--font-devan` (Tiro Devanagari Hindi).
- **Motion** — `--ease` cubic-bezier(0.22, 1, 0.36, 1); durations `--dur-fast` 200ms, `--dur-base` 400ms, `--dur-slow` 800ms.
- **Layout** — `--container-max 1440px`, `--page-pad 80px` (md 40, sm 20).

Use these via `var(--token)` rather than hardcoding hex/px values.

## Footer, Nav, Cart

- **Footer**: rendered identically on every page. Help and Policies columns route via `<Link to={ROUTES.…}>`; Shop and Brand columns are static placeholders. Social row: Instagram → Facebook → LinkedIn → X, all with `href` from `SOCIAL`, `target="_blank"`, `rel="noopener noreferrer"`.
- **Nav**: wordmark links to `ROUTES.home`. The four primary nav links (Shop / Collections / Lookbook / Journal) are still inert — no routes exist for them. `Nav` accepts a `dark` prop; Home uses light Nav, policy pages pass `dark` so the Nav blends into the ink hero.
- **Cart**: `SAMPLE_CART` is hardcoded in the component. Open state is owned by the parent page (`cartOpen` / `setCartOpen` + `<Nav onBagClick={…}>`). Checkout button has no destination yet.

## Env vars (`src/env.ts`)

All `import.meta.env.VITE_*` reads go through `src/env.ts`. App code imports `ENV` from there; nothing else should touch `import.meta.env` directly. When adding a new env var:

1. Add it to `.env` with a comment (the file is committed; only public values).
2. Add the key to `ImportMetaEnv` in `src/vite-env.d.ts` so TS knows about it.
3. Add it to `ENV` in `src/env.ts`.
4. Import `ENV` in the consumer; never read `import.meta.env` directly.

Current keys:
- `ENV.clarityProjectId` — Clarity project ID; blank → analytics off.
- `ENV.buildVersion` — CalVer stamp set by CI (`YYYY.MM.DD.HHMM` UTC).
- `ENV.commitSha` — full SHA set by CI.

`buildVersion` and `commitSha` are wired through but not yet rendered anywhere — they're there for a future build-stamp / debug overlay.

## Analytics — Microsoft Clarity

`src/main.tsx` reads `ENV.clarityProjectId`; if set, calls `Clarity.init(id)` before render. If blank (typical local dev), it's a no-op. The Clarity SDK injects a script tag at runtime, so the bundle stays slim regardless.

In CI (`.github/workflows/deploy.yml`), the ID is passed in from the `CLARITY_PROJECT_ID` repo secret at build time.

For custom tracking later:
```ts
import Clarity from "@microsoft/clarity";
Clarity.event("checkout_started");
Clarity.identify("user-123");
Clarity.setTag("plan", "pro");
```

**HashRouter caveat**: hash-only URL changes may not register as page views in Clarity's auto-tracker. If page-view counts look low, fire `Clarity.event("page_view")` from the existing `ScrollToTop` effect in `App.tsx`.

## CI / deploy (`.github/workflows/deploy.yml`)

Push to `main` → build → deploy to GitHub Pages → tag a CalVer release.

Three env vars are injected at build time:
- `VITE_CLARITY_PROJECT_ID` — from `secrets.CLARITY_PROJECT_ID`
- `VITE_BUILD_VERSION` — `YYYY.MM.DD.HHMM` UTC, also used as the release tag `vYYYY.MM.DD.HHMM`
- `VITE_COMMIT_SHA` — full SHA

`VITE_BUILD_VERSION` and `VITE_COMMIT_SHA` flow into `ENV.buildVersion` / `ENV.commitSha` but no UI consumes them yet — they're staged for a future build-stamp or debug overlay.

Release tagging uses `gh release create … --generate-notes`, so commit titles since the previous tag matter — write them like a changelog.

## Gotchas

- **Hash-quoted strings vs ASCII apostrophes**. Don't write `'We don't ship Sundays'` — the `'` terminates the JS string. Use double quotes (`"We don't…"`) or backtick templates. Policy data files are full of contractions; this bites repeatedly.
- **`verbatimModuleSyntax: true`** in tsconfig means type-only imports must use `import type` (or inline `import { foo, type Bar }`). Don't strip the keyword in a "cleanup" pass.
- **`noUnusedLocals` / `noUnusedParameters` are on**. Prefix intentionally-unused identifiers with `_` to silence (e.g. `(_e) => …`).
- **JSX entities**: ESLint flags raw `'` inside JSX text. Use `&apos;` (already done in `Drop` and `Lookbook`).
- **Build tool is rolldown-vite**, which emits unusually verbose syntax-error output (each char tinted). The relevant line is `╭─[ path:line:col ]─` near the bottom of the error block.
- **`--charcoal` footer + `--ink` cross-link strip** read as one large dark block on policy pages. That's intentional; don't split them.
- **`.env` is committed; `.env.*.local` are not** (see `.gitignore`). Clarity project IDs are public anyway (they ship in the script tag), so committing them is fine — but never put a secret in plain `.env`.
- **Don't `yarn <script>`** in tooling/automation. The engine guard fails on Node < 26. Call `node_modules/.bin/<tool>` directly.

## Recent session log

- Bootstrapped Vite/React, refactored into CSS Modules folder pattern, added ESLint+Prettier, bumped deps to latest.
- Built `ShippingReturns` from a design handoff (`PolicyV2.jsx`).
- Extracted that page's shell into `components/PolicyLayout` and created 8 more pages (Privacy, Terms, RefundPolicy, CookiePolicy, SizeGuide, CareGuide, TrackOrder, Contact) as thin data wrappers.
- Wired all 10 routes in `App.tsx` with a `ScrollToTop` helper.
- Converted Footer and Nav internal anchors to `<Link>` so navigation actually works.
- Wired Prettier into ESLint via `eslint-plugin-prettier/recommended`.
- **TypeScript migration**: every `.jsx` → `.tsx`, strict mode + project references, `PolicyData` discriminated union exported from `PolicyLayout`. Removed Hero's dead countdown code along the way.
- Switched `BrowserRouter` → `HashRouter` for GitHub Pages hosting.
- Extracted brand/social/route literals into `src/constants.ts`.
- Replaced Pinterest/TikTok/YouTube icons with Facebook/LinkedIn/X; wired real social URLs.
- Added `@microsoft/clarity` with env-gated init.
- Added GitHub Pages deploy workflow with CalVer release tagging and three injected build env vars.
- Funnelled all `import.meta.env.VITE_*` reads through `src/env.ts` (single `ENV` export).
