import { MetaCell } from "./MetaCell";
import { PANT, formatRupees } from "./product";
import styles from "./style.module.css";

const META = [
    { label: "Fabric", value: PANT.fabric },
    { label: "Sizes", value: `Waist ${PANT.sizes.join(" · ")}` },
    { label: "Price", value: `${formatRupees(PANT.price)} · Made in Jaipur` },
    { label: "Available on", value: "Flipkart · Meesho · Amazon soon" },
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
