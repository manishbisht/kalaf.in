import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { BuyButtons } from "../BuyButtons";
import { CatalogImage } from "../CatalogImage";
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

    // The video sits below the fold: it loads nothing but its poster
    // (preload="none") and only plays while it's on screen.
    const videoRef = useRef<HTMLVideoElement>(null);
    const videoSrc = active.video?.src;
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) video.play().catch(() => {});
            else video.pause();
        });
        observer.observe(video);
        return () => observer.disconnect();
    }, [videoSrc]);

    return (
        <div className={styles.showcase}>
            <div className={styles.heroImage}>
                {active.video ? (
                    <video
                        key={active.video.src}
                        ref={videoRef}
                        src={active.video.src}
                        poster={active.video.poster}
                        preload="none"
                        muted
                        loop
                        playsInline
                        aria-label={`${PANT.title} in ${active.colour}, worn`}
                    />
                ) : (
                    <CatalogImage
                        image={model}
                        sizes="(max-width: 768px) 100vw, 60vw"
                        alt=""
                        loading="lazy"
                    />
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
                    <CatalogImage
                        key={side.src}
                        image={side}
                        sizes="(max-width: 768px) 100vw, 40vw"
                        alt={`${PANT.title} — ${active.colour}`}
                        loading="lazy"
                    />
                    {back && (
                        <CatalogImage
                            image={back}
                            alt=""
                            loading="lazy"
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
