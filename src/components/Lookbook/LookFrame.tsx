import { Link } from "react-router-dom";
import { CatalogImage } from "../CatalogImage";
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
            {/* The visible label below names the link, so the photo is
                decorative here: an alt repeating it would be read twice. */}
            <CatalogImage
                image={item.image}
                sizes={sizes}
                alt=""
                loading="lazy"
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
