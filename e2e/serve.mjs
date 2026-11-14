// Serves the built site in dist/ the way GitHub Pages does, for the
// Playwright tests (playwright.config.ts starts it). No dependencies.
//
// For a request path it tries, in order: the exact file, `<path>.html`, then
// `<path>/index.html` (a trailing slash goes straight to `<path>/index.html`).
// Anything else gets dist/404.html with status 404, like GitHub Pages.
//
//   node e2e/serve.mjs            # http://127.0.0.1:4317
//   PORT=5000 node e2e/serve.mjs
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { dirname, extname, join, normalize, sep } from "node:path";
import { fileURLToPath } from "node:url";

const dist = join(dirname(fileURLToPath(import.meta.url)), "..", "dist");
const port = Number(process.env.PORT) || 4317;

const TYPES = {
    ".html": "text/html; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".mjs": "text/javascript; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".webmanifest": "application/manifest+json; charset=utf-8",
    ".txt": "text/plain; charset=utf-8",
    ".xml": "application/xml; charset=utf-8",
    ".svg": "image/svg+xml",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".avif": "image/avif",
    ".webp": "image/webp",
    ".ico": "image/x-icon",
    ".mp4": "video/mp4",
    ".woff2": "font/woff2",
};

try {
    await stat(join(dist, "index.html"));
    await stat(join(dist, "404.html"));
} catch {
    console.error(
        "dist/ isn't built (no dist/index.html or dist/404.html). Run the full build first: yarn build"
    );
    process.exit(1);
}

const isFile = async (path) => {
    try {
        return (await stat(path)).isFile();
    } catch {
        return false;
    }
};

// The file GitHub Pages would serve for a URL path, or null for a 404.
async function resolve(urlPath) {
    let path;
    try {
        path = decodeURIComponent(urlPath);
    } catch {
        return null;
    }
    const base = normalize(join(dist, path));
    if (base !== dist && !base.startsWith(dist + sep)) return null;
    const candidates = path.endsWith("/")
        ? [join(base, "index.html")]
        : [base, `${base}.html`, join(base, "index.html")];
    for (const file of candidates) {
        if (await isFile(file)) return file;
    }
    return null;
}

createServer(async (req, res) => {
    const { pathname } = new URL(req.url ?? "/", "http://localhost");
    const file = await resolve(pathname);
    const status = file ? 200 : 404;
    const target = file ?? join(dist, "404.html");
    const body = await readFile(target);
    res.writeHead(status, {
        "Content-Type": TYPES[extname(target)] ?? "application/octet-stream",
        "Content-Length": body.length,
        "Cache-Control": "no-store",
    });
    res.end(req.method === "HEAD" ? undefined : body);
}).listen(port, "127.0.0.1", () => {
    console.log(`Serving dist/ at http://127.0.0.1:${port}`);
});
