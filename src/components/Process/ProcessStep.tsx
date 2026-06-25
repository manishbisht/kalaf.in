import styles from "./style.module.css";

export type ProcessItem = {
    img: string;
    step: string;
    label: string;
    body: string;
};

export function ProcessStep({ item }: { item: ProcessItem }) {
    return (
        <div className={styles.step}>
            <div className={styles.imageWrap}>
                <img
                    src={item.img}
                    alt={item.label}
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
