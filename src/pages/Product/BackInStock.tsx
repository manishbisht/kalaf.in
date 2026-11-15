import { BRAND, productPath, whatsappMessageHref } from "../../constants";
import type { Product, Variant } from "../../data/catalog";
import { SITE_URL } from "../../seo";
import { trackClicks, trackRestockClick } from "../../analytics";
import styles from "./style.module.css";

/** The WhatsApp message asking to hear when a sold-out colour is back. */
function restockMessage(product: Product, variant: Variant) {
    const url = `${SITE_URL}${productPath(product.handle, variant.colourCode)}`;
    return `Hi Kalaf! Please let me know when the ${product.title} in ${variant.colour} is back in stock: ${url}`;
}

// Shown in place of the buy buttons when the chosen colour is sold out: a
// WhatsApp chat with the piece and colour already named, so a visitor who
// wanted it becomes a message instead of leaving. There's no backend, so we
// reply by hand when it's restocked.
export function BackInStock({
    product,
    variant,
}: {
    product: Product;
    variant: Variant;
}) {
    if (!BRAND.whatsapp) return null;
    return (
        <div className={styles.restock}>
            <a
                className="btn btn-secondary"
                href={whatsappMessageHref(
                    BRAND.whatsapp,
                    restockMessage(product, variant)
                )}
                target="_blank"
                rel="noopener noreferrer"
                {...trackClicks(() => trackRestockClick(variant.sku))}
            >
                Tell me when it&apos;s back
            </a>
            <p className={styles.buyNote}>
                Opens WhatsApp with a message to us. We&apos;ll write back when{" "}
                {variant.colour} is in stock again.
            </p>
        </div>
    );
}
