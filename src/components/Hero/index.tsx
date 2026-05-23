import { Icon } from "../Icons";
import styles from "./style.module.css";

export function Hero() {
    return (
        <section className={styles.hero}>
            <img
                src="https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&w=2000&q=85"
                alt=""
                className={styles.bg}
            />

            <div className={styles.metaTopRight}>
                <div>Drop 01 — The Everyday Pant</div>
                <div className={styles.metaSub}>
                    One pant. Five colours. Jaipur.
                </div>
            </div>

            <div className={styles.scrollCue}>
                <span className={styles.scrollLine} />
                Scroll
            </div>

            <div className={styles.countdown}>
                <span className={styles.countdownLabel}>
                    Drop 01 — Coming soon
                </span>
            </div>

            <div className={styles.content}>
                <div className={styles.eyebrow}>
                    <span className={styles.eyebrowLine} />
                    One pant. Five colours. Cut once, in Jaipur.
                </div>

                <h1 className={styles.headline}>
                    The Everyday
                    <br />
                    Pant.
                </h1>

                <div className={styles.ctas}>
                    <a href="#drop" className={styles.btnPrimary}>
                        See the pant <Icon name="arrowRight" size={16} />
                    </a>
                    <a href="#waitlist" className={styles.btnSecondary}>
                        Join the waitlist
                    </a>
                </div>
            </div>
        </section>
    );
}
