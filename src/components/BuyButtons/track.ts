import Clarity from "@microsoft/clarity";
import { ENV } from "../../env";
import { PRODUCTS, type Marketplace } from "../../data/catalog";

// Records a click on a marketplace button in Clarity, so the owner can see how
// many visitors the site sends to each store. Fire-and-forget: it never
// blocks the link, and it's a no-op when analytics is off (local dev).
export function trackBuyClick(store: Marketplace, sku?: string) {
    if (!ENV.clarityProjectId) return;
    try {
        Clarity.setTag("store", store);
        // Always set (or clear) these, so a click without a SKU isn't
        // credited to a product from an earlier click in the same session.
        if (!sku) {
            Clarity.setTag("sku", "");
            Clarity.setTag("product", "");
        } else {
            Clarity.setTag("sku", sku);
            const product = PRODUCTS.find((p) =>
                p.variants.some((v) => v.sku === sku)
            );
            if (product) Clarity.setTag("product", product.code);
        }
        Clarity.event("buy_click");
    } catch {
        // Analytics must never break buying.
    }
}
