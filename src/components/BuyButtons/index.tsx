import { Icon } from "../Icons";
import { formatRupees } from "../../data/catalog";
import styles from "./style.module.css";

export type Marketplace = "amazon" | "flipkart" | "meesho";
export type MarketplaceLinks = Partial<Record<Marketplace, string>>;

const STORES: { id: Marketplace; name: string }[] = [
    { id: "flipkart", name: "Flipkart" },
    { id: "meesho", name: "Meesho" },
    { id: "amazon", name: "Amazon" },
];

// One button per marketplace. Live stores come first (the first one is the
// primary button); a store with no link shows after them as "coming soon".
export function BuyButtons({
    links,
    prices,
    compact = false,
}: {
    links: MarketplaceLinks;
    // Shown on each button when the stores charge different prices.
    prices?: Partial<Record<Marketplace, number>>;
    compact?: boolean;
}) {
    const amounts = new Set(Object.values(prices ?? {}));
    const showPrices = amounts.size > 1;
    const stores = [
        ...STORES.filter((s) => links[s.id]),
        ...STORES.filter((s) => !links[s.id]),
    ];
    const primary = stores.find((s) => links[s.id])?.id;
    const sizeClass = compact ? styles.compact : "";

    return (
        <div className={`${styles.row} ${sizeClass}`}>
            {stores.map((s) => {
                const href = links[s.id];
                if (!href) {
                    return (
                        <span
                            key={s.id}
                            className={`btn btn-secondary ${styles.soon}`}
                            aria-disabled="true"
                        >
                            {s.name} — coming soon
                        </span>
                    );
                }
                return (
                    <a
                        key={s.id}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`btn ${s.id === primary ? "btn-primary" : "btn-secondary"}`}
                    >
                        Buy on {s.name}
                        {showPrices && prices?.[s.id] && (
                            <> · {formatRupees(prices[s.id]!)}</>
                        )}{" "}
                        <Icon name="arrowUpRight" size={16} />
                    </a>
                );
            })}
        </div>
    );
}
