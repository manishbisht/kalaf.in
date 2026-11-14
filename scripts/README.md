# scripts/, public/ and deploy

Build-side tooling: the catalog sync, the prerender step, the static files in `public/`, and the GitHub Pages deploy. Back to the index: [AGENTS.md](../AGENTS.md).

## sync-catalog.py

Pulls products, media and business details from the private **manishbisht/products.kalaf.in** repo (checked out next to this one). Its layout: `catalog/<PRODUCT>/product.json`, `catalog/<PRODUCT>/<SKU>/variant.json`, `<SKU>/images/*.jpg`, `catalog/<PRODUCT>/videos/<SKU>_video.mp4`, plus `colors.json` and `business.json` at the root.

```bash
../products.kalaf.in/.venv/bin/python scripts/sync-catalog.py ../products.kalaf.in          # changed media only
../products.kalaf.in/.venv/bin/python scripts/sync-catalog.py ../products.kalaf.in --force  # redo all media (~3 min)
```

Use the products repo's venv, which has Pillow; `ffmpeg` must be on `PATH` (the script exits without it). It writes:

- `src/data/catalog.json`: products and colours (see [src/data/README.md](../src/data/README.md)).
- `src/data/business.json`: only the public fields of the products repo's `business.json` (`BUSINESS_FIELDS`: legal name, trade name, constitution, GSTIN, address, email, phone, WhatsApp). Everything else there stays private.
- `public/catalog/<PRODUCT>/`: `<SKU>_<n>-600.jpg` and `-1200.jpg` for each photo, plus AVIF copies (`-600.avif`, `-1200.avif`, q50, ~40% of the JPEG's bytes; the JPEGs stay for og:image and JSON-LD), `<SKU>_video.mp4` (720w H.264, no audio) and `<SKU>_video-poster.jpg`.

**Media caching**: each source file's SHA-1 is stored in `public/catalog/.sources.json`; a photo or video is re-encoded only when its source changed or an output is missing.

**`PRODUCTS` dict** (top of the script): website-only fields per product code, in display order: URL `handle`, `collection`, and optionally `title` (beats the products repo's `short_name`/`name`), `description` (used only when the products repo has none) and `links` overrides. To add a product, add it here. Features come from `features` or `flipkart_key_features`, care from `material_care`, the size chart, sizes, stock and `dispatch_days` from the product and variant JSON.

**Buy links**: a store gets a link only when the products repo has a `url` for it **and** its `status` doesn't match `NOT_LIVE` (blocked / removed / delisted / inactive / suspended). So listings that are blocked or pulled never show a button (the pants' Meesho listing is blocked; nothing is live on Amazon). Each variant's `prices` holds each live store's price and `price` is the lowest.

**Link overrides**: `"links"` in a `PRODUCTS` entry replaces a store's URL, but only while that store is live in the products repo. The pant (`PNT`) uses `{"flipkart": "https://pants.kalaf.in/kalaf.in"}`, the owner's own link (12 Nov 2026), for every colour. Because it covers every size, the pant's `sizeLinks` is empty and the product page shows sizes as information only. Remove the override to go back to per-size Flipkart pages (`sizes.*.flipkart_url`), where choosing a size switches the Flipkart link.

Never hand-add an Amazon link: the owner asked (2 Nov 2026) for nothing to be live on Amazon.

## prerender.mjs

The last step of the build, after `vite build` (client → `dist/`) and `vite build --ssr src/entry-server.tsx --outDir node_modules/.tmp/ssr`. It imports the SSR bundle and, for each path in `prerenderPaths()`:

- renders the page body (`render(path)` in `src/entry-server.tsx`) into `<div id="root" data-path="…">`, and that path's head tags into the `<!--seo-->` block of `dist/index.html` (it throws if the block or `#root` is missing);
- writes it to both `dist/<path>.html` and `dist/<path>/index.html` (GitHub Pages serves `/privacy` from either), or `dist/index.html` for `/`.

Old product handles (`OLD_HANDLES` in `src/data/catalog.ts`, exported to the script as `oldHandles`) get a tiny redirect page at the old path: a zero-second meta refresh plus a canonical to the current URL, keeping `?colour=`. That's the closest GitHub Pages gets to a 301; without it the old URL would come back with HTTP 404.

Then it writes `dist/404.html` (empty app shell with `noindex`; GitHub Pages serves it for unknown paths and the client router takes over), `sitemap.xml`, `robots.txt` and `llms.txt`. See [src/seo/README.md](../src/seo/README.md). `vite.config.ts` sets `build.cssCodeSplit: false` so prerendered pages are styled before their JS loads, and skips the `public/` copy for the SSR build.

## public/

Copied as-is to the site root by Vite, so **don't put a README or anything private here**.

- `catalog/`: **generated** product photos and videos (above). Don't edit or add files by hand.
- `favicon.svg`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png` (also the Organization logo in JSON-LD), `site.webmanifest`: icons and the web-app manifest, linked from `index.html`.
- `og-image.jpg`: default share image for pages without their own photo.
- `CNAME`: `kalaf.in`, the custom domain for GitHub Pages.

## Deploy (`.github/workflows/deploy.yml`)

Push to `main` (or run it manually) → `yarn install --frozen-lockfile` → `yarn build` (typecheck, client build, SSR build, prerender) on Node 26 → upload `dist/` → deploy to GitHub Pages → create a GitHub release.

- **CalVer**: the build computes `YYYY.MM.DD.HHMM` (UTC). The release tag is `vYYYY.MM.DD.HHMM`, made with `gh release create … --generate-notes`, so commit titles since the last tag become the release notes. Write them like a changelog.
- **Injected at build time**: `VITE_BUILD_VERSION` (the CalVer), `VITE_COMMIT_SHA` (full SHA) and `VITE_CLARITY_PROJECT_ID` from the `CLARITY_PROJECT_ID` repo secret. They reach the app through `ENV` in `src/env.ts`; the footer's build stamp shows the first two.
- `dist/` is gitignored. Never commit it.

## Automatic catalog sync (`.github/workflows/sync-catalog.yml`)

Runs `sync-catalog.py` against the products repo daily at 08:00 IST (and on demand from the Actions tab). When anything changed it opens or updates a `catalog-sync` pull request touching only `src/data/*.json` and `public/catalog/`; merging it deploys. It does nothing until the repo has a `PRODUCTS_REPO_TOKEN` secret: a fine-grained token with read-only Contents access to `manishbisht/products.kalaf.in`. It sparse-checks out only `catalog/`, `colors.json` and `business.json`, so `documents/` never reaches CI.

Pull requests (yours, and the sync PR once re-run from the Actions tab, since PRs opened by the workflow token don't trigger other workflows) run `.github/workflows/ci.yml`: lint, tests, build and the prerendered-site test.
