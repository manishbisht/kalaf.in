import type { ProductImage } from "../../data/catalog";
import { CatalogImage } from "../CatalogImage";
import styles from "./style.module.css";

export type ProcessItem = {
    image: ProductImage;
    alt: string;
    step: string;
    label: string;
    body: string;
};

export function ProcessStep({ item }: { item: ProcessItem }) {
    return (
        <div className={styles.step}>
            <div className={styles.imageWrap}>
                <CatalogImage
                    image={item.image}
                    sizes="(max-width: 480px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    alt={item.alt}
                    loading="lazy"
                />
                <div className={styles.stepNum}>{item.step}</div>
            </div>
            <div>
                <div className={styles.label}>{item.label}</div>
                <p className={styles.body}>{item.body}</p>
            </div>
        </div>
    );
}
