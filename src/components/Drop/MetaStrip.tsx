import styles from "./style.module.css";

function MetaCell({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <div className={styles.metaLabel}>{label}</div>
            <div className={styles.metaValue}>{value}</div>
        </div>
    );
}

const META = [
    { label: "The piece", value: "The Everyday Pant" },
    { label: "Fabric", value: "60% cotton, 40% linen" },
    { label: "Made in", value: "Jaipur" },
    { label: "Drop date", value: "To be announced" },
];

export function MetaStrip() {
    return (
        <div className={styles.metaStrip}>
            {META.map((m) => (
                <MetaCell key={m.label} label={m.label} value={m.value} />
            ))}
        </div>
    );
}
