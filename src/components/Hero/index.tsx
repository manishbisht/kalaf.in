import { Icon } from "../Icons";
import { Link } from "react-router-dom";
import { MARKETPLACES, ROUTES } from "../../constants";
import styles from "./style.module.css";

export function Hero() {
    return (
        <section className={styles.hero}>
            <img
                src="https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&w=2000&q=85"
                alt=""
                className={styles.bg}
                decoding="async"
                fetchPriority="high"
            />

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
