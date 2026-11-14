import type { ProductImage } from "../../data/catalog";
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
                <img
                    src={item.image.src}
                    srcSet={`${item.image.src} 600w, ${item.image.srcLarge} 1200w`}
                    sizes="(max-width: 480px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    alt={item.alt}
                    loading="lazy"
                    decoding="async"
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
