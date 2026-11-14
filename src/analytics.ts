// Custom Clarity events. Every helper here is fire-and-forget: it never
// blocks or breaks a link, and it's a no-op when analytics is off (local dev
// and tests, where ENV.clarityProjectId is blank).

import Clarity from "@microsoft/clarity";
import { ENV } from "./env";
import { PRODUCTS, type Marketplace } from "./data/catalog";

/** Sets each tag, then fires the event. Never throws. */
export function trackEvent(name: string, tags: Record<string, string> = {}) {
    if (!ENV.clarityProjectId) return;
    try {
        for (const [key, value] of Object.entries(tags)) {
            Clarity.setTag(key, value);
        }
        Clarity.event(name);
    } catch {
        // Analytics must never break the page (an ad blocker, say).
    }
}

/** onClick + onAuxClick props that fire `track` on a real click: a normal
 *  or middle click (both open the link), not a right-click (button 2), which
 *  only opens the context menu. Neither handler prevents the default. */
export function trackClicks(track: () => void) {
    return {
        onClick: () => track(),
        onAuxClick: (e: { button: number }) => {
            if (e.button === 1) track();
        },
    };
}

/** A click on a marketplace button, so the owner can see how many visitors
 *  the site sends to each store. The SKU and product tags are always set (or
 *  cleared), so a click isn't credited to a product from an earlier click in
 *  the same session. */
export function trackBuyClick(store: Marketplace, sku?: string) {
    const product = sku
        ? PRODUCTS.find((p) => p.variants.some((v) => v.sku === sku))
        : undefined;
    trackEvent("buy_click", {
        store,
        sku: sku ?? "",
        product: product?.code ?? "",
    });
}

/** The floating WhatsApp button. `page` is the product SKU on a product page,
 *  else the pathname. */
export function trackWhatsAppClick(page: string) {
    trackEvent("whatsapp_click", { page });
}

/** An "Ask AI" link (Claude, ChatGPT, Perplexity). */
export function trackAskAIClick(assistant: string) {
    trackEvent("ask_ai_click", { assistant });
}

/** A button on the /links (link-in-bio) page. */
export function trackLinksClick(target: string) {
    trackEvent("links_click", { target });
}
