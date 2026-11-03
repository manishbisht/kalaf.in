import { DupattaCard } from "./DupattaCard";
import { DUPATTAS, DUPATTA_DETAILS } from "./products";
import { formatRupees } from "../Drop/product";
import styles from "./style.module.css";

export function Dupattas() {
    const total = DUPATTAS.reduce((n, d) => n + d.colours.length, 0);

    return (
        <section className={styles.section} id="dupattas">
            <div className="container">
                <div className="section-head">
                    <div>
                        <div className={styles.eyebrowRow}>
                            <span className={styles.eyebrowText}>
                                Drop 02 — dupattas
                            </span>
                            <span className={styles.devanagari}>— दुपट्टा</span>
                        </div>
                        <h2>
                            Bandhani &amp; leheriya.
                            <br />
                            {total} colours.
                        </h2>
                    </div>
                    <div className="right">
                        Tie-dyed the Rajasthani way — fine bandhani dots and
                        rippling leheriya stripes, some finished with a gold
                        gota border. Full length, {DUPATTA_DETAILS.size}, at{" "}
                        {formatRupees(DUPATTA_DETAILS.price)} each.
                    </div>
                </div>

                <div className={styles.grid}>
                    {DUPATTAS.map((d) => (
                        <DupattaCard key={d.id} dupatta={d} />
                    ))}
                </div>

                <div className={styles.priceNote}>
                    <span>{formatRupees(DUPATTA_DETAILS.price)}</span>
                    <s>{formatRupees(DUPATTA_DETAILS.mrp)}</s>
                    <span>· every dupatta · {DUPATTA_DETAILS.size}</span>
                </div>
            </div>
        </section>
    );
}
