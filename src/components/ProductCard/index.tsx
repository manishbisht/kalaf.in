import { Link } from "react-router-dom";
import { productPath } from "../../constants";
import {
    MARKETPLACES,
    formatRupees,
    isSoldOut,
    percentOff,
    shortColour,
    type ListingItem,
} from "../../data/catalog";
import { Swatch } from "../Swatch";
import styles from "./style.module.css";

// Shop-grid tile for one colour of a product. Hovering swaps to the second
// photo, like most storefronts.
export function ProductCard({ item }: { item: ListingItem }) {
    const { product, variant } = item;
    const [first, second] = variant.images;
    const soldOut = isSoldOut(variant);
    const stores = MARKETPLACES.filter((s) => variant.links[s.id]).map(
        (s) => s.name
    );

    return (
        <Link
            to={productPath(product.handle, variant.colourCode)}
            className={`${styles.card} ${soldOut ? styles.soldOut : ""}`}
        >
            <div className={styles.media}>
                {first && (
                    <img
                        src={first.src}
                        alt={`${product.title} in ${variant.colour}`}
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
                {soldOut ? (
                    <span className={`chip chip-dark ${styles.off}`}>
                        Sold out
                    </span>
                ) : (
                    <span className={`chip ${styles.off}`}>
                        {percentOff(variant.price, variant.mrp)}% off
                    </span>
                )}
            </div>
            <div className={styles.body}>
                <div className={styles.title}>{product.title}</div>
                <div className={styles.colour} title={variant.colour}>
                    <Swatch code={variant.colourCode} size={12} />
                    <span className={styles.colourName}>
                        {shortColour(variant)}
                    </span>
                </div>
                <div className={styles.priceRow}>
                    <span className={styles.price}>
                        {formatRupees(variant.price)}
                    </span>
                    <s className={styles.mrp}>{formatRupees(variant.mrp)}</s>
                </div>
                {!soldOut && stores.length > 0 && (
                    <div className={styles.stores}>On {stores.join(" · ")}</div>
                )}
            </div>
        </Link>
    );
}
