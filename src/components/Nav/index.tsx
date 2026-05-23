import { Link } from "react-router-dom";
import { BRAND, ROUTES } from "../../constants";
import styles from "./style.module.css";

type NavProps = {
    dark?: boolean;
};

export function Nav({ dark = false }: NavProps) {
    return (
        <header className={`${styles.nav} ${dark ? styles.navDark : ""}`}>
            <div className={styles.inner}>
                <nav className={styles.links}>
                    <a className={styles.link}>Shop</a>
                    <a className={styles.link}>Collections</a>
                    <a className={styles.link}>Lookbook</a>
                    <a className={`${styles.link} ${styles.linkMuted}`}>
                        Journal
                    </a>
                </nav>

                <Link to={ROUTES.home} className={styles.wordmark}>
                    {BRAND.wordmark}
                </Link>

                {/* Right-side spacer keeps the wordmark centred in the 1fr/auto/1fr grid */}
                <div />
            </div>

            <div
                className={`${styles.announcement} ${dark ? styles.announcementDark : ""}`}
            >
                Drop 01 — The first capsule · Made in Jaipur · Coming soon
            </div>
        </header>
    );
}
