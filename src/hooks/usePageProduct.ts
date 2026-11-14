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
} {
    const { pathname } = useLocation();
    const [params] = useSearchParams();
    const url = `${SITE_URL}${pathname === "/" ? "" : pathname}`;
    const match = matchPath(ROUTES.product, pathname);
    const product = (match && findProduct(match.params.handle)) || null;
    if (!product) return { product: null, variant: null, url };
    const variant =
        product.variants.find((v) => v.colourCode === params.get("colour")) ??
        product.variants[0];
    // Link the product's current handle (old handles still resolve here),
    // and the colour only when the page asked for one.
    const colour = params.get("colour") ? variant.colourCode : undefined;
    return {
        product,
        variant,
        url: `${SITE_URL}${productPath(product.handle, colour)}`,
    };
}
