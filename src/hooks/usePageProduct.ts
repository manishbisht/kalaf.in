import { matchPath, useLocation, useSearchParams } from "react-router-dom";
import { findProduct, type Product, type Variant } from "../data/catalog";
import { ROUTES, productPath } from "../constants";
import { SITE_URL } from "../seo";

export { SITE_URL };

// What the current page is about, for links that hand context to another app
// (WhatsApp chat, Ask AI): the product and colour on a product page, and the
// page's public URL on kalaf.in either way (never localhost or a hash URL).
export function usePageProduct(): {
    product: Product | null;
    variant: Variant | null;
    url: string;
    // The pathname without a trailing slash (/links/ → /links), matching how
    // main.tsx and the prerender name pages.
    path: string;
} {
    const { pathname } = useLocation();
    const [params] = useSearchParams();
    const path = pathname.replace(/(.)\/+$/, "$1");
    const url = `${SITE_URL}${path === "/" ? "" : path}`;
    const match = matchPath(ROUTES.product, path);
    const product = (match && findProduct(match.params.handle)) || null;
    if (!product) return { product: null, variant: null, url, path };
    const variant =
        product.variants.find((v) => v.colourCode === params.get("colour")) ??
        product.variants[0];
    // Link the product's current handle (old handles still resolve here),
    // and the colour only when the page asked for one.
    const colour = params.get("colour") ? variant.colourCode : undefined;
    return {
        product,
        variant,
        path,
        url: `${SITE_URL}${productPath(product.handle, colour)}`,
    };
}
