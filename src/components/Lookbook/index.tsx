import { productPath } from "../../constants";
import { PRODUCTS } from "../../data/catalog";
import { LookFrame, type Look } from "./LookFrame";
import styles from "./style.module.css";

// A look is one catalog photo linking to that product in that colour.
function look(code: string, colour: string, n: number, position?: string) {
    const product = PRODUCTS.find((p) => p.code === code)!;
    const variant =
        product.variants.find((v) => v.colourCode === colour) ??
        product.variants[0];
    return {
        to: productPath(product.handle, variant.colourCode),
        image: variant.images[n - 1] ?? variant.images[0],
        label: `${product.title} — ${variant.colour}`,
        position,
    } satisfies Look;
}

const LOOKS: Look[] = [
    look("PNT", "WH", 1, "50% 30%"),
    look("DUAG", "MU", 2, "50% 25%"),
    look("PNT", "BE", 4, "50% 40%"),
    look("DUCHI", "RB", 1, "50% 30%"),
    look("DUA", "GR", 1, "50% 30%"),
    look("PNT", "BK", 1, "50% 35%"),
];

// Rendered width of each frame, for srcSet (see the grid in style.module.css).
const FRAMES = [
    { className: styles.frame1, sizes: "(max-width: 640px) 100vw, 42vw" },
    { className: styles.frame2, sizes: "(max-width: 640px) 100vw, 58vw" },
    { className: styles.frame3, sizes: "(max-width: 640px) 100vw, 25vw" },
    { className: styles.frame4, sizes: "(max-width: 640px) 100vw, 33vw" },
    { className: styles.frame5, sizes: "(max-width: 640px) 100vw, 67vw" },
    { className: styles.frame6, sizes: "(max-width: 640px) 100vw, 33vw" },
];

export function Lookbook() {
    return (
        <section className={styles.section} id="lookbook">
            <div className="container">
                <div className="section-head">
                    <div>
                        <div className="eyebrow">The pieces</div>
                        <h2>
                            Cotton &amp; colour.
                            <br />
                            Made in Jaipur.
                        </h2>
                    </div>
                    <div className="right">
                        The pant in white, beige and black, and our bandhani and
                        leheriya dupattas. Tap a photo to see the piece.
                    </div>
                </div>

                <div className={styles.grid}>
                    {LOOKS.map((item, i) => (
                        <div key={item.to} className={FRAMES[i].className}>
                            <LookFrame item={item} sizes={FRAMES[i].sizes} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
