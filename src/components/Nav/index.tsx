import { Link, NavLink } from "react-router-dom";
import { BRAND, ROUTES, collectionPath } from "../../constants";
import styles from "./style.module.css";

type NavProps = {
    dark?: boolean;
};

// NavLink marks the link to the current page with aria-current="page".
// `end`: /products shouldn't count as current on /products/some-piece.
export function Nav({ dark = false }: NavProps) {
    return (
        <header className={`${styles.nav} ${dark ? styles.navDark : ""}`}>
            <nav className={styles.inner} aria-label="Main">
                <div className={styles.links}>
                    <NavLink to={ROUTES.products} end className={styles.link}>
                        Shop all
                    </NavLink>
                    <NavLink
                        to={collectionPath("pants")}
                        className={styles.link}
                    >
                        Pants
                    </NavLink>
                    <NavLink
                        to={collectionPath("dupattas")}
                        className={styles.link}
                    >
                        Dupattas
                    </NavLink>
                    <NavLink to={ROUTES.journal} end className={styles.link}>
                        Journal
                    </NavLink>
                </div>

                <Link to={ROUTES.home} className={styles.wordmark}>
                    {BRAND.wordmark}
                    <span className="sr-only"> home</span>
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
            </nav>

            <div
                className={`${styles.announcement} ${dark ? styles.announcementDark : ""}`}
            >
                Pants on Flipkart · Dupattas on Flipkart &amp; Meesho
            </div>
        </header>
    );
}
