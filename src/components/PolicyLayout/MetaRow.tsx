import styles from "./style.module.css";

export function MetaRow({ label, value }: { label: string; value: string }) {
    return (
        <li className={styles.metaRow}>
            <span className={styles.metaLabel}>{label}</span>
            <span className={styles.metaValue}>{value}</span>
        </li>
    );
}
