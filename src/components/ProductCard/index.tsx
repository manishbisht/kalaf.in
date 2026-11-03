import { Link } from "react-router-dom";
import { productPath } from "../../constants";
import { formatRupees, percentOff, type ListingItem } from "../../data/catalog";
import styles from "./style.module.css";

const STORE_NAMES = {
    flipkart: "Flipkart",
    meesho: "Meesho",
    amazon: "Amazon",
};

// Shop-grid tile for one colour of a product. Hovering swaps to the second
// photo, like most storefronts.
export function ProductCard({ item }: { item: ListingItem }) {
    const { product, variant } = item;
    const [first, second] = variant.images;
    const stores = (Object.keys(STORE_NAMES) as (keyof typeof STORE_NAMES)[])
        .filter((s) => variant.links[s])
        .map((s) => STORE_NAMES[s]);

    return (
        <Link
            to={productPath(product.handle, variant.colourCode)}
            className={styles.card}
        >
            <div className={styles.media}>
                {first && (
                    <img
                        src={first.src}
                        alt={`${product.title} — ${variant.colour}`}
                        loading="lazy"
                        decoding="async"
                        className={styles.primary}
                    />
                )}
                {second && (
                    <img
                        src={second.src}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        className={styles.secondary}
                    />
                )}
                <span className={`chip ${styles.off}`}>
                    {percentOff(variant.price, variant.mrp)}% off
                </span>
            </div>
            <div className={styles.body}>
                <div className={styles.title}>{product.title}</div>
                <div className={styles.colour}>{variant.colour}</div>
                <div className={styles.priceRow}>
                    <span className={styles.price}>
                        {formatRupees(variant.price)}
                    </span>
                    <s className={styles.mrp}>{formatRupees(variant.mrp)}</s>
                </div>
                <div className={styles.stores}>On {stores.join(" · ")}</div>
            </div>
        </Link>
    );
}
