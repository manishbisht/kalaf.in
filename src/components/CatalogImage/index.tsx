import type { ImgHTMLAttributes } from "react";
import type { ProductImage } from "../../data/catalog";
import styles from "./style.module.css";

type Props = Omit<
    ImgHTMLAttributes<HTMLImageElement>,
    "src" | "srcSet" | "sizes" | "width" | "height"
> & {
    image: ProductImage;
    // The image's rendered width (an <img sizes> value). With it the browser
    // picks 600w or 1200w; without it, one file is used: 600w, or 1200w when
    // `large` is set.
    sizes?: string;
    large?: boolean;
};

// A catalog photo as <picture>: AVIF for browsers that support it (most of
// them, at ~40% of the JPEG's bytes), the JPEG otherwise. The <picture> is
// display: contents, so CSS that targets `.parent img` keeps working.
// Pass loading="lazy" for anything below the fold, and fetchPriority="high"
// for the page's main (LCP) photo.
export function CatalogImage({
    image,
    sizes,
    large = false,
    decoding = "async",
    ...img
}: Props) {
    const jpg = sizes
        ? `${image.src} 600w, ${image.srcLarge} 1200w`
        : large
          ? image.srcLarge
          : image.src;
    const avif = sizes
        ? `${image.avif} 600w, ${image.avifLarge} 1200w`
        : large
          ? image.avifLarge
          : image.avif;

    return (
        <picture className={styles.picture}>
            <source type="image/avif" srcSet={avif} sizes={sizes} />
            {/* srcSet/sizes before src, so no browser starts the wrong file. */}
            <img
                srcSet={sizes ? jpg : undefined}
                sizes={sizes}
                src={sizes ? image.srcLarge : jpg}
                width={image.width}
                height={image.height}
                decoding={decoding}
                {...img}
            />
        </picture>
    );
}
