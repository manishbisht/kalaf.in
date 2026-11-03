import { Icon } from "../Icons";
import { Link } from "react-router-dom";
import { MARKETPLACES, ROUTES } from "../../constants";
import { PRODUCTS } from "../../data/catalog";
import styles from "./style.module.css";

// The three colourways of the pant, worn — photo 1 of each colour.
const PANT = PRODUCTS.find((p) => p.code === "PNT")!;
const ORDER = ["WH", "BE", "BK"];
const SHOTS = ORDER.map((c) => PANT.variants.find((v) => v.colourCode === c))
    .filter((v) => v !== undefined)
    .map((v) => ({ colour: v.colour, image: v.images[0] }));

export function Hero() {
    return (
        <section className={styles.hero}>
            <div className={styles.bg}>
                {SHOTS.map((shot, i) => (
                    <img
                        key={shot.colour}
                        src={shot.image.srcLarge}
                        srcSet={`${shot.image.src} 600w, ${shot.image.srcLarge} 1200w`}
                        sizes="(max-width: 768px) 100vw, 34vw"
                        alt={`${PANT.title} in ${shot.colour}, worn`}
                        decoding="async"
                        fetchPriority={i === 1 ? "high" : "auto"}
                    />
                ))}
            </div>

            <div className={styles.metaTopRight}>
                <div>Drop 01 — Cotton Linen Trousers</div>
                <div className={styles.metaSub}>
                    One pant. Three colours. Jaipur.
                </div>
            </div>

            <div className={styles.scrollCue}>
                <span className={styles.scrollLine} />
                Scroll
            </div>

            <div className={styles.countdown}>
                <span className={styles.countdownLabel}>
                    Now on Flipkart · Meesho · Amazon soon
                </span>
            </div>

            <div className={styles.content}>
                <div className={styles.eyebrow}>
                    <span className={styles.eyebrowLine} />
                    One pant. Three colours. Cut once, in Jaipur.
                </div>

                <h1 className={styles.headline}>
                    The Cotton
                    <br />
                    Linen Pant.
                </h1>

                <div className={styles.ctas}>
                    <a
                        href={MARKETPLACES.flipkart}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.btnPrimary}
                    >
                        Buy on Flipkart <Icon name="arrowUpRight" size={16} />
                    </a>
                    <Link to={ROUTES.products} className={styles.btnSecondary}>
                        Shop all <Icon name="arrowRight" size={16} />
                    </Link>
                </div>
            </div>
        </section>
    );
}
