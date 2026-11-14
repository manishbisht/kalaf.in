import { Link } from "react-router-dom";
import { Icon } from "../Icons";
import type { ProductImage } from "../../data/catalog";
import styles from "./style.module.css";

export type Look = {
    to: string;
    image: ProductImage;
    label: string;
    // CSS object-position, to keep the subject in frame when cropped.
    position?: string;
};

export function LookFrame({ item, sizes }: { item: Look; sizes: string }) {
    return (
        <Link to={item.to} className={styles.frame}>
            <img
                src={item.image.src}
                srcSet={`${item.image.src} 600w, ${item.image.srcLarge} 1200w`}
                sizes={sizes}
                alt={item.label}
                loading="lazy"
                decoding="async"
                style={
                    item.position
                        ? { objectPosition: item.position }
                        : undefined
                }
            />
            <div className={styles.frameLabel}>
                <span>{item.label}</span>
                <Icon name="arrowUpRight" size={18} />
            </div>
        </Link>
    );
}
