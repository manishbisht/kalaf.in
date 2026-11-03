import type { Variant } from "../../data/catalog";
import { Swatch } from "../Swatch";
import { PANT } from "./pant";
import styles from "./style.module.css";

export function Swatches({
    active,
    onPick,
}: {
    active: Variant;
    onPick: (sku: string) => void;
}) {
    return (
        <div className={styles.swatches}>
            {PANT.variants.map((v) => (
                <button
                    key={v.sku}
                    type="button"
                    onClick={() => onPick(v.sku)}
                    title={v.colour}
                    aria-label={v.colour}
                    aria-pressed={v.sku === active.sku}
                    className={`${styles.swatchBtn} ${v.sku === active.sku ? styles.swatchActive : ""}`}
                >
                    <Swatch code={v.colourCode} size={26} />
                </button>
            ))}
            <span className={styles.swatchCode}>{active.colour}</span>
        </div>
    );
}
