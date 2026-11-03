import { useState } from "react";
import { BuyButtons } from "../BuyButtons";
import { PatternTile } from "./PatternTile";
import type { Dupatta } from "./products";
import styles from "./style.module.css";

export function DupattaCard({ dupatta }: { dupatta: Dupatta }) {
    const [sku, setSku] = useState(dupatta.colours[0].sku);
    const colour =
        dupatta.colours.find((c) => c.sku === sku) ?? dupatta.colours[0];

    return (
        <article className={styles.card}>
            <div className={styles.tileWrap}>
                <PatternTile dupatta={dupatta} colour={colour} />
                <span className={`chip ${styles.count}`}>
                    {dupatta.colours.length} colours
                </span>
            </div>

            <h3 className={styles.name}>{dupatta.name}</h3>
            <div className={styles.fabric}>
                {dupatta.fabric} · {colour.name}
            </div>

            <div className={styles.swatches}>
                {dupatta.colours.map((c) => (
                    <button
                        key={c.sku}
                        type="button"
                        title={c.name}
                        aria-label={c.name}
                        aria-pressed={c.sku === colour.sku}
                        onClick={() => setSku(c.sku)}
                        className={`${styles.swatch} ${c.sku === colour.sku ? styles.swatchActive : ""}`}
                    >
                        {c.hex.map((hex, i) => (
                            <span key={hex + i} style={{ background: hex }} />
                        ))}
                    </button>
                ))}
            </div>

            <div className={styles.buy}>
                <BuyButtons links={colour.links} compact />
            </div>
        </article>
    );
}
