import { useState } from "react";
import type { Product, Variant } from "../../data/catalog";
import styles from "./style.module.css";

type Media =
    | { kind: "image"; src: string; srcLarge: string }
    | { kind: "video"; src: string; poster: string };

// Main image + thumbnail strip. The product video (if any) sits second, right
// after the main photo.
export function Gallery({
    product,
    variant,
}: {
    product: Product;
    variant: Variant;
}) {
    const media: Media[] = variant.images.map((i) => ({
        kind: "image",
        ...i,
    }));
    if (variant.video) {
        media.splice(Math.min(1, media.length), 0, {
            kind: "video",
            ...variant.video,
        });
    }

    const [index, setIndex] = useState(0);
    const current = media[Math.min(index, media.length - 1)];
    const alt = `${product.title} — ${variant.colour}`;

    return (
        <div className={styles.gallery}>
            <div className={styles.main}>
                {current.kind === "video" ? (
                    <video
                        key={current.src}
                        src={current.src}
                        poster={current.poster}
                        autoPlay
                        muted
                        loop
                        playsInline
                        controls
                        aria-label={`${alt} video`}
                    />
                ) : (
                    <img
                        key={current.src}
                        src={current.srcLarge}
                        srcSet={`${current.src} 600w, ${current.srcLarge} 1200w`}
                        sizes="(max-width: 900px) 100vw, 55vw"
                        alt={alt}
                        decoding="async"
                    />
                )}
            </div>
            <div className={styles.thumbs}>
                {media.map((m, i) => (
                    <button
                        key={m.src}
                        type="button"
                        className={`${styles.thumb} ${i === index ? styles.thumbActive : ""}`}
                        onClick={() => setIndex(i)}
                        aria-label={
                            m.kind === "video"
                                ? "Play video"
                                : `Photo ${i + 1} of ${media.length}`
                        }
                    >
                        <img
                            src={m.kind === "video" ? m.poster : m.src}
                            alt=""
                            loading="lazy"
                        />
                        {m.kind === "video" && (
                            <span className={styles.play}>▶</span>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
}
