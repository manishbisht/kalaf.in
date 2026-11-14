import { Icon } from "../Icons";
import {
    MARKETPLACES,
    SOLD_ON,
    formatRupees,
    type Marketplace,
    type MarketplaceLinks,
} from "../../data/catalog";
import { trackBuyClick, trackClicks } from "../../analytics";
import styles from "./style.module.css";

export type { Marketplace, MarketplaceLinks };

// One button per marketplace with a link; the first is the primary button.
// A store Kalaf sells on elsewhere in the catalog but not for this piece shows
// after them as "coming soon" (see SOLD_ON). Stores nothing is live on are
// left out entirely.
export function BuyButtons({
    links,
    prices,
    sku,
    compact = false,
}: {
    links: MarketplaceLinks;
    // Shown on each button when the stores charge different prices.
    prices?: Partial<Record<Marketplace, number>>;
    // Tagged on the buy_click analytics event.
    sku?: string;
    compact?: boolean;
}) {
    const amounts = new Set(Object.values(prices ?? {}));
    const showPrices = amounts.size > 1;
    const live = MARKETPLACES.filter((s) => links[s.id]);
    const soon = MARKETPLACES.filter(
        (s) => !links[s.id] && SOLD_ON.includes(s.id)
    );
    const sizeClass = compact ? styles.compact : "";

    return (
        <div className={`${styles.row} ${sizeClass}`}>
            {live.map((s, i) => {
                const price = prices?.[s.id];
                return (
                    <a
                        key={s.id}
                        href={links[s.id]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`btn ${i === 0 ? "btn-primary" : "btn-secondary"}`}
                        // Left and middle clicks open the store;
                        // right-click only opens the context menu.
                        {...trackClicks(() => trackBuyClick(s.id, sku))}
                    >
                        Buy on {s.name}
                        {showPrices && price && (
                            <> · {formatRupees(price)}</>
                        )}{" "}
                        <Icon name="arrowUpRight" size={16} />
                    </a>
                );
            })}
            {soon.map((s) => (
                <span
                    key={s.id}
                    className={`btn btn-secondary ${styles.soon}`}
                    aria-disabled="true"
                >
                    {s.name} — coming soon
                </span>
            ))}
        </div>
    );
}
