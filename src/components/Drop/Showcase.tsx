import { Link } from "react-router-dom";
import { BuyButtons } from "../BuyButtons";
import { Swatches } from "./Swatches";
import { PANT } from "./pant";
import { formatRupees, percentOff, type Variant } from "../../data/catalog";
import { ROUTES, productPath } from "../../constants";
import styles from "./style.module.css";

export function Showcase({
    active,
    onPick,
}: {
    active: Variant;
    onPick: (sku: string) => void;
}) {
    // Video shows the pant worn, so the side image is the flat lay (photo 2),
    // with the back view (photo 3) on hover.
    const [model, flat, back] = active.images;
    const side = flat ?? model;
    const sizes = PANT.sizes;

    return (
        <div className={styles.showcase}>
            <div className={styles.heroImage}>
                {active.video ? (
                    <video
                        key={active.video.src}
                        src={active.video.src}
                        poster={active.video.poster}
                        autoPlay
                        muted
                        loop
                        playsInline
                        aria-label={`${PANT.title} in ${active.colour}, worn`}
                    />
                ) : (
                    <img src={model.srcLarge} alt="" decoding="async" />
                )}
                <div className={styles.chipWrap}>
                    <span className="chip">DROP 01 — THE PANT</span>
                </div>
            </div>

            <div className={styles.rightCol}>
                <Link
                    to={productPath(PANT.handle, active.colourCode)}
                    className={styles.variantImage}
                >
                    <img
                        key={side.src}
                        src={side.srcLarge}
                        srcSet={`${side.src} 600w, ${side.srcLarge} 1200w`}
                        sizes="(max-width: 768px) 100vw, 40vw"
                        alt={`${PANT.title} — ${active.colour}`}
                        loading="lazy"
                        decoding="async"
                    />
                    {back && (
                        <img
                            src={back.src}
                            alt=""
                            loading="lazy"
                            decoding="async"
                            className={styles.variantAlt}
                        />
                    )}
                </Link>

                <div className={styles.info}>
                    <div className={styles.titleRow}>
                        <h3 className={styles.productTitle}>{PANT.title}</h3>
                        <div className={styles.price}>
                            {formatRupees(active.price)}
                            <s className={styles.mrp}>
                                {formatRupees(active.mrp)}
                            </s>
                            <span className={styles.off}>
                                {percentOff(active.price, active.mrp)}% off
                            </span>
                        </div>
                    </div>
                    <div className={styles.variant}>
                        {PANT.fabric} · Relaxed straight leg · {active.colour} ·
                        Waist {sizes[0]}–{sizes[sizes.length - 1]}
                    </div>

                    <Swatches active={active} onPick={onPick} />

                    <div className={styles.shopOnLabel}>
                        Buy the {active.colour.toLowerCase()} pant on
                    </div>
                    <BuyButtons links={active.links} prices={active.prices} />

                    <div className={styles.links}>
                        <Link
                            to={productPath(PANT.handle, active.colourCode)}
                            className={styles.sizingLink}
                        >
                            Photos, sizes &amp; details →
                        </Link>
                        <Link
                            to={ROUTES.sizeGuide}
                            className={styles.sizingLink}
                        >
                            Size guide →
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
