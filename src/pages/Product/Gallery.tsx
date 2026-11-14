import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import type { Product, ProductImage, Variant } from "../../data/catalog";
import { CatalogImage } from "../../components/CatalogImage";
import { Icon } from "../../components/Icons";
import { Lightbox } from "./Lightbox";
import styles from "./style.module.css";

type Media =
    | ({ kind: "image"; photo: number } & ProductImage)
    | { kind: "video"; src: string; poster: string };

const reducedMotion = () =>
    matchMedia("(prefers-reduced-motion: reduce)").matches;

// Main media strip + thumbnails. The strip is a horizontal scroll-snap track:
// swipeable on phones, driven by the thumbnails, the arrow buttons and the
// left/right keys on desktop. The product video (if any) sits second, right
// after the main photo, and only plays while it's the visible slide. Clicking
// a photo opens it full screen at 1200w.
export function Gallery({
    product,
    variant,
}: {
    product: Product;
    variant: Variant;
}) {
    const media: Media[] = variant.images.map((img, photo) => ({
        kind: "image",
        ...img,
        photo,
    }));
    if (variant.video) {
        media.splice(Math.min(1, media.length), 0, {
            kind: "video",
            ...variant.video,
        });
    }
    const total = media.length;
    const name = `${product.title} in ${variant.colour}`;

    const [index, setIndex] = useState(0);
    const [lightbox, setLightbox] = useState<number | null>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const frame = useRef(0);

    const goTo = (i: number) => {
        const track = trackRef.current;
        const next = Math.max(0, Math.min(total - 1, i));
        setIndex(next);
        track?.scrollTo({
            left: next * track.clientWidth,
            behavior: reducedMotion() ? "auto" : "smooth",
        });
    };

    // Swipes (and smooth scrolls) update the active thumbnail.
    const onScroll = () => {
        cancelAnimationFrame(frame.current);
        frame.current = requestAnimationFrame(() => {
            const track = trackRef.current;
            if (!track || !track.clientWidth) return;
            setIndex(Math.round(track.scrollLeft / track.clientWidth));
        });
    };
    useEffect(() => () => cancelAnimationFrame(frame.current), []);

    // The video plays (muted, looping) only while it's on screen.
    const showingVideo = media[index]?.kind === "video";
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;
        if (showingVideo) video.play().catch(() => {});
        else video.pause();
    }, [showingVideo]);

    const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
        if (e.target instanceof HTMLVideoElement) return; // its own seek keys
        if (e.key === "ArrowLeft") {
            e.preventDefault();
            goTo(index - 1);
        } else if (e.key === "ArrowRight") {
            e.preventDefault();
            goTo(index + 1);
        }
    };

    const photos = variant.images;

    return (
        <div
            className={styles.gallery}
            role="region"
            aria-roledescription="carousel"
            aria-label={`Photos of ${name}`}
            onKeyDown={onKeyDown}
        >
            <div className={styles.main}>
                <div
                    ref={trackRef}
                    className={styles.track}
                    onScroll={onScroll}
                    aria-live="polite"
                >
                    {media.map((m, i) => (
                        <div
                            key={m.src}
                            className={styles.slide}
                            role="group"
                            aria-roledescription="slide"
                            aria-label={`${i + 1} of ${total}`}
                            aria-hidden={i !== index}
                        >
                            {m.kind === "video" ? (
                                <video
                                    ref={videoRef}
                                    src={m.src}
                                    poster={m.poster}
                                    preload="none"
                                    muted
                                    loop
                                    playsInline
                                    controls
                                    tabIndex={i === index ? 0 : -1}
                                    aria-label={`${name}, video`}
                                />
                            ) : (
                                <button
                                    type="button"
                                    className={styles.zoom}
                                    onClick={() => setLightbox(m.photo)}
                                    tabIndex={i === index ? 0 : -1}
                                    aria-haspopup="dialog"
                                    aria-label={`${name}, photo ${m.photo + 1} of ${photos.length}. Open full screen`}
                                >
                                    {/* The first photo is the LCP image. */}
                                    <CatalogImage
                                        image={m}
                                        sizes="(max-width: 900px) 100vw, 55vw"
                                        alt=""
                                        loading={i === 0 ? "eager" : "lazy"}
                                        fetchPriority={
                                            i === 0 ? "high" : "auto"
                                        }
                                        draggable={false}
                                    />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
                {total > 1 && (
                    <>
                        <button
                            type="button"
                            className={`${styles.arrow} ${styles.arrowPrev}`}
                            onClick={() => goTo(index - 1)}
                            disabled={index === 0}
                            aria-label="Previous photo"
                        >
                            <Icon name="arrowRight" size={20} />
                        </button>
                        <button
                            type="button"
                            className={`${styles.arrow} ${styles.arrowNext}`}
                            onClick={() => goTo(index + 1)}
                            disabled={index === total - 1}
                            aria-label="Next photo"
                        >
                            <Icon name="arrowRight" size={20} />
                        </button>
                    </>
                )}
            </div>
            {total > 1 && (
                <div className={styles.thumbs}>
                    {media.map((m, i) => (
                        <button
                            key={m.src}
                            type="button"
                            className={`${styles.thumb} ${i === index ? styles.thumbActive : ""}`}
                            onClick={() => goTo(i)}
                            aria-current={i === index ? "true" : undefined}
                            aria-label={
                                m.kind === "video"
                                    ? "Show video"
                                    : `Show photo ${m.photo + 1} of ${photos.length}`
                            }
                        >
                            {m.kind === "video" ? (
                                <img src={m.poster} alt="" loading="lazy" />
                            ) : (
                                <CatalogImage image={m} alt="" loading="lazy" />
                            )}
                            {m.kind === "video" && (
                                <span
                                    className={styles.play}
                                    aria-hidden="true"
                                >
                                    ▶
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            )}
            {lightbox !== null && (
                <Lightbox
                    images={photos}
                    start={lightbox}
                    label={name}
                    onClose={() => setLightbox(null)}
                />
            )}
        </div>
    );
}
