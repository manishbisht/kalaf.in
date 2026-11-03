import { Link } from "react-router-dom";
import { BuyButtons } from "../BuyButtons";
import { Swatches } from "./Swatches";
import { PANT, formatRupees, type Colourway } from "./product";
import { ROUTES } from "../../constants";
import styles from "./style.module.css";

export function Showcase({
    active,
    onPick,
}: {
    active: Colourway;
    onPick: (id: string) => void;
}) {
    const off = Math.round((1 - PANT.price / PANT.mrp) * 100);

    return (
        <div className={styles.showcase}>
            <div className={styles.heroImage}>
                <img
                    src="/pant-colourways.png"
                    alt="Kalaf cotton linen trousers on the rail"
                    loading="lazy"
                    decoding="async"
                />
                <div className={styles.chipWrap}>
                    <span className="chip">DROP 01 — THE PANT</span>
                </div>
            </div>

            <div className={styles.rightCol}>
                <div className={styles.variantImage}>
                    <img
                        src={active.image}
                        alt={`Kalaf ${PANT.name} — ${active.name}`}
                        loading="lazy"
                        decoding="async"
                    />
                </div>

                <div className={styles.info}>
                    <div className={styles.titleRow}>
                        <h3 className={styles.productTitle}>{PANT.name}</h3>
                        <div className={styles.price}>
                            {formatRupees(PANT.price)}
                            <s className={styles.mrp}>
                                {formatRupees(PANT.mrp)}
                            </s>
                            <span className={styles.off}>{off}% off</span>
                        </div>
                    </div>
                    <div className={styles.variant}>
                        Cotton-linen · Relaxed straight leg · {active.name} ·
                        Waist {PANT.sizes[0]}–
                        {PANT.sizes[PANT.sizes.length - 1]}
                    </div>

                    <Swatches active={active} onPick={onPick} />

                    <div className={styles.shopOnLabel}>
                        Buy the {active.name.toLowerCase()} pant on
                    </div>
                    <BuyButtons links={active.links} />

                    <Link to={ROUTES.sizeGuide} className={styles.sizingLink}>
                        Need a size? Open the size guide →
                    </Link>
                </div>
            </div>
        </div>
    );
}
