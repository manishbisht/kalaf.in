import { MetaCell } from "./MetaCell";
import styles from "./style.module.css";

const META = [
    { label: "The piece", value: "The Everyday Pant" },
    { label: "Fabric", value: "60% cotton, 40% linen" },
    { label: "Made in", value: "Jaipur" },
    { label: "Available on", value: "Amazon · Flipkart · Myntra" },
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
