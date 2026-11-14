import { MetaCell } from "./MetaCell";
import { PANT } from "./pant";
import { MARKETPLACES, formatRupees } from "../../data/catalog";
import styles from "./style.module.css";

const v = PANT.variants[0];
const stores = MARKETPLACES.filter((m) =>
    PANT.variants.some((x) => x.links[m.id])
).map((m) => m.name);

const META = [
    { label: "Fabric", value: PANT.fabric ?? "" },
    { label: "Sizes", value: `Waist ${PANT.sizes.join(" · ")}` },
    { label: "Price", value: `${formatRupees(v.price)} · Made in Jaipur` },
    { label: "Available on", value: stores.join(" · ") },
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
