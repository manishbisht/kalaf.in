// Post-build step: turns the SPA in dist/ into one static HTML file per route
// so GitHub Pages serves every URL directly (no server rewrites) and crawlers
// get real titles, descriptions, Open Graph tags, JSON-LD and page content.
//
// Runs after `vite build` (client → dist/) and
// `vite build --ssr src/entry-server.tsx --outDir node_modules/.tmp/ssr`.
// Writes, for every route:
//   dist/<path>.html and dist/<path>/index.html  (GitHub Pages serves /privacy
//   from either, whichever it prefers), plus dist/index.html for "/".
// And: dist/404.html (SPA fallback for unknown paths), sitemap.xml,
// robots.txt and llms.txt.

/* global console */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const ssr = await import(
    pathToFileURL(join(root, "node_modules/.tmp/ssr/entry-server.js")).href
);

const template = await readFile(join(dist, "index.html"), "utf8");
const SEO_BLOCK = /<!--seo-->[\s\S]*?<!--\/seo-->/;
const ROOT_DIV = '<div id="root"></div>';
if (!SEO_BLOCK.test(template) || !template.includes(ROOT_DIV)) {
    throw new Error("dist/index.html is missing the <!--seo--> block or #root");
}

function page(head, path, body) {
    const rootDiv =
        path === null
            ? ROOT_DIV
            : `<div id="root" data-path="${path}">${body}</div>`;
    return template.replace(SEO_BLOCK, head).replace(ROOT_DIV, rootDiv);
}

async function write(file, html) {
    await mkdir(dirname(file), { recursive: true });
    await writeFile(file, html);
}

const paths = ssr.prerenderPaths();
for (const path of paths) {
    const html = page(
        ssr.headHtml(ssr.seoFor(path)),
        path,
        await ssr.render(path)
    );
    if (path === "/") {
        await write(join(dist, "index.html"), html);
    } else {
        await write(join(dist, `${path}.html`), html);
        await write(join(dist, path, "index.html"), html);
    }
}

// Old product handles (e.g. after the pant became 100% cotton): a tiny page
// that redirects to the current URL, keeping ?colour=. A zero-second meta
// refresh plus a canonical is what GitHub Pages can offer instead of a 301,
// and search engines treat it as a permanent redirect. Without this the old
// URL would be served with HTTP 404 from 404.html.
const attr = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
for (const [from, to] of Object.entries(ssr.oldHandles)) {
    const target = `/products/${to}`;
    const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Moved</title>
<link rel="canonical" href="https://kalaf.in${attr(target)}" />
<meta name="robots" content="noindex" />
<meta http-equiv="refresh" content="0; url=${attr(target)}" />
<script>location.replace(${JSON.stringify(target)} + location.search + location.hash);</script>
</head>
<body><a href="${attr(target)}">This page has moved.</a></body>
</html>
`;
    await write(join(dist, "products", `${from}.html`), html);
    await write(join(dist, "products", from, "index.html"), html);
}

// Unknown paths get the app shell; the client router renders the NotFound page.
await write(
    join(dist, "404.html"),
    page(ssr.headHtml(ssr.notFoundSeo("/404")), null)
);

const today = new Date().toISOString().slice(0, 10);
await write(join(dist, "sitemap.xml"), ssr.sitemapXml(today));
await write(join(dist, "robots.txt"), ssr.robotsTxt());
await write(join(dist, "llms.txt"), ssr.llmsTxt());

console.log(
    `prerendered ${paths.length} routes + ${Object.keys(ssr.oldHandles).length} redirects, 404.html, sitemap.xml, robots.txt, llms.txt`
);
