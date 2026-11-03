import { Icon } from "../Icons";
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
    compact = false,
}: {
    links: MarketplaceLinks;
    compact?: boolean;
}) {
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
                        Buy on {s.name} <Icon name="arrowUpRight" size={16} />
                    </a>
                );
            })}
        </div>
    );
}
