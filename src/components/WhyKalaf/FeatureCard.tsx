import styles from "./style.module.css";

export type Feature = { num: string; title: string; body: string };

export function FeatureCard({ item }: { item: Feature }) {
    return (
        <div className={styles.card}>
            <div className={styles.num}>{item.num}</div>
            <h3 className={styles.title}>{item.title}</h3>
            <p className={styles.body}>{item.body}</p>
        </div>
    );
}
