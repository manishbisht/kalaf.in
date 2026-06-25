import styles from "./style.module.css";

export function MetaCell({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <div className={styles.metaLabel}>{label}</div>
            <div className={styles.metaValue}>{value}</div>
        </div>
    );
}
