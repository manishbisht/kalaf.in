import { MetaCell } from "./MetaCell";
import { PANT } from "./pant";
import { formatRupees } from "../../data/catalog";
import styles from "./style.module.css";

const v = PANT.variants[0];
const STORE_NAMES = {
    flipkart: "Flipkart",
    meesho: "Meesho",
};
const stores = (Object.keys(STORE_NAMES) as (keyof typeof STORE_NAMES)[])
    .filter((s) => PANT.variants.some((x) => x.links[s]))
    .map((s) => STORE_NAMES[s]);

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
