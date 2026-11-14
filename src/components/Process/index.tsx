import { PRODUCTS } from "../../data/catalog";
import { ProcessStep, type ProcessItem } from "./ProcessStep";
import styles from "./style.module.css";

// A product photo from the catalog: product code, colour code, photo number.
function photo(code: string, colour: string, n: number) {
    const product = PRODUCTS.find((p) => p.code === code)!;
    const variant =
        product.variants.find((v) => v.colourCode === colour) ??
        product.variants[0];
    return {
        image: variant.images[n - 1] ?? variant.images[0],
        alt: `${product.title} in ${variant.colour}`,
    };
}

// Working days from order to dispatch across the range, e.g. "2–3".
const DAYS = PRODUCTS.map((p) => p.dispatchDays).filter(
    (d): d is number => d !== null
);
const DISPATCH =
    Math.min(...DAYS) === Math.max(...DAYS)
        ? `${Math.max(...DAYS)}`
        : `${Math.min(...DAYS)}–${Math.max(...DAYS)}`;

const PROCESS: ProcessItem[] = [
    {
        ...photo("PNT", "BE", 6),
        step: "01",
        label: "The cloth",
        body: "100% cotton for the pant. Art silk (taffeta) and light chiffon for the dupattas.",
    },
    {
        ...photo("DUA", "GR", 1),
        step: "02",
        label: "The dye",
        body: "Bandhani and leheriya are tie-dyed, so every dupatta's pattern varies a little from the next.",
    },
    {
        ...photo("PNT", "BK", 4),
        step: "03",
        label: "The details",
        body: "An elastic waist with a button and zip fly on the pant. A gota border on many of the dupattas.",
    },
    {
        ...photo("DUCHI", "YEL", 3),
        step: "04",
        label: "Sent from Jaipur",
        body: `We pack every order ourselves and dispatch it within ${DISPATCH} working days.`,
    },
];

export function Process() {
    return (
        <section className={styles.section} id="process">
            <div className="container">
                <div className="section-head">
                    <div>
                        <div className={styles.eyebrowRow}>
                            <span className={styles.eyebrowText}>
                                The making
                            </span>
                            <span className={styles.devanagari}>— कलफ</span>
                        </div>
                        <h2>
                            Made in Jaipur.
                            <br />
                            Sent to your door.
                        </h2>
                    </div>
                    <div className="right">
                        Every Kalaf piece is made and packed in Jaipur in small
                        batches, then delivered by Flipkart or Meesho.
                    </div>
                </div>

                <div className={styles.grid}>
                    {PROCESS.map((p) => (
                        <ProcessStep key={p.step} item={p} />
                    ))}
                </div>
            </div>
        </section>
    );
}
