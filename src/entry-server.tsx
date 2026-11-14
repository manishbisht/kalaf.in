// Build-time entry, bundled with `vite build --ssr` and driven by
// scripts/prerender.mjs. Renders one route to static HTML and exposes the SEO
// helpers the prerender step needs. Never shipped to the browser.

import { StrictMode } from "react";
import { prerender } from "react-dom/static";
import { StaticRouter } from "react-router-dom";
import { Shell } from "./App";

export {
    oldHandles,
    headHtml,
    llmsTxt,
    notFoundSeo,
    prerenderPaths,
    robotsTxt,
    seoFor,
    sitemapXml,
} from "./seo";

/** Body HTML for one path. `prerender` waits for every lazy page to load. */
export async function render(url: string): Promise<string> {
    const { prelude } = await prerender(
        <StrictMode>
            <StaticRouter location={url}>
                <Shell seo={false} />
            </StaticRouter>
        </StrictMode>,
        // Never split a large page out of its Suspense boundary. Otherwise
        // React writes the fallback in place and the real content in a hidden
        // <div> that an inline script swaps in later, so crawlers, no-JS
        // visitors and the first paint see an empty <main>.
        { progressiveChunkSize: Infinity }
    );
    return new Response(prelude).text();
}
