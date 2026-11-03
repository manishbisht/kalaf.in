import { Link } from "react-router-dom";
import { BRAND, ROUTES, collectionPath } from "../../constants";
import styles from "./style.module.css";

type NavProps = {
    dark?: boolean;
};

export function Nav({ dark = false }: NavProps) {
    return (
        <header className={`${styles.nav} ${dark ? styles.navDark : ""}`}>
            <div className={styles.inner}>
                <nav className={styles.links}>
                    <Link to={ROUTES.products} className={styles.link}>
                        Shop all
                    </Link>
                    <Link to={collectionPath("pants")} className={styles.link}>
                        Pants
                    </Link>
                    <Link
                        to={collectionPath("dupattas")}
                        className={styles.link}
                    >
                        Dupattas
                    </Link>
                    <a className={`${styles.link} ${styles.linkMuted}`}>
                        Journal
                    </a>
                </nav>

                <Link to={ROUTES.home} className={styles.wordmark}>
                    {BRAND.wordmark}
                </Link>

                {/* Desktop links are hidden on mobile, so mobile gets a Shop link here */}
                <div className={styles.right}>
                    <Link
                        to={ROUTES.products}
                        className={`${styles.link} ${styles.mobileShop}`}
                    >
                        Shop
                    </Link>
                </div>
            </div>

            <div
                className={`${styles.announcement} ${dark ? styles.announcementDark : ""}`}
            >
                Drop 01 — Now on Flipkart · Meesho · Amazon soon
            </div>
        </header>
    );
}
