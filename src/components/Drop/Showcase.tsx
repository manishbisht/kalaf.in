import { Link } from "react-router-dom";
import { Icon } from "../Icons";
import { Swatches } from "./Swatches";
import { imageFilter, type Colourway } from "./colourways";
import { MARKETPLACES, ROUTES } from "../../constants";
import styles from "./style.module.css";

export function Showcase({
    active,
    onPick,
}: {
    active: Colourway;
    onPick: (id: string) => void;
}) {
    return (
        <div className={styles.showcase}>
            <div className={styles.heroImage}>
                <img
                    src="/pant-colourways.png"
                    alt="Five colourways"
                    loading="lazy"
                    decoding="async"
                />
                <div className={styles.chipWrap}>
                    <span className="chip">DROP 01 — 01 OF 01</span>
                </div>
            </div>

            <div className={styles.rightCol}>
                <div className={styles.variantImage}>
                    <img
                        src={
                            active.id === "sand"
                                ? "/pant-front.png"
                                : "/pant-front-2.png"
                        }
                        alt={`The Everyday Pant — ${active.name}`}
                        loading="lazy"
                        decoding="async"
                        style={{
                            filter: imageFilter(active.id),
                            mixBlendMode: "multiply",
                        }}
                    />
                </div>

                <div className={styles.info}>
                    <div className={styles.titleRow}>
                        <h3 className={styles.productTitle}>
                            The Everyday Pant
                        </h3>
                    </div>
                    <div className={styles.variant}>
                        Cotton-linen · Relaxed easy fit · {active.name}
                    </div>

                    <Swatches active={active} onPick={onPick} />

                    <div className={styles.shopOnLabel}>Shop the pant on</div>
                    <div className={styles.ctaRow}>
                        <a
                            href={MARKETPLACES.amazon}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-primary"
                        >
                            Amazon <Icon name="arrowUpRight" size={16} />
                        </a>
                        <a
                            href={MARKETPLACES.flipkart}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-secondary"
                        >
                            Flipkart <Icon name="arrowUpRight" size={16} />
                        </a>
                        <a
                            href={MARKETPLACES.myntra}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-secondary"
                        >
                            Myntra <Icon name="arrowUpRight" size={16} />
                        </a>
                    </div>

                    <Link to={ROUTES.sizeGuide} className={styles.sizingLink}>
                        Need a size? Open the size guide →
                    </Link>
                </div>
            </div>
        </div>
    );
}
