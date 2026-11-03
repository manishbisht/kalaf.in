import { Link } from "react-router-dom";
import { Icon } from "../Icons";
import { Swatches } from "./Swatches";
import {
    PANT,
    formatRupees,
    type Colourway,
    type Marketplace,
} from "./product";
import { ROUTES } from "../../constants";
import styles from "./style.module.css";

const STORES: { id: Marketplace; label: string; primary?: boolean }[] = [
    { id: "flipkart", label: "Buy on Flipkart", primary: true },
    { id: "meesho", label: "Buy on Meesho" },
    { id: "amazon", label: "Buy on Amazon" },
];

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
                    <div className={styles.ctaRow}>
                        {STORES.map((s) => {
                            const href = active.links[s.id];
                            if (!href) {
                                return (
                                    <span
                                        key={s.id}
                                        className={`btn btn-secondary ${styles.ctaSoon}`}
                                        aria-disabled="true"
                                    >
                                        {s.label.replace("Buy on ", "")} —
                                        coming soon
                                    </span>
                                );
                            }
                            return (
                                <a
                                    key={s.id}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`btn ${s.primary ? "btn-primary" : "btn-secondary"}`}
                                >
                                    {s.label}{" "}
                                    <Icon name="arrowUpRight" size={16} />
                                </a>
                            );
                        })}
                    </div>

                    <Link to={ROUTES.sizeGuide} className={styles.sizingLink}>
                        Need a size? Open the size guide →
                    </Link>
                </div>
            </div>
        </div>
    );
}
