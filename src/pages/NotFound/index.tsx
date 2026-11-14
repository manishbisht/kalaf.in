import { Link } from "react-router-dom";
import { BRAND, ROUTES, collectionPath } from "../../constants";
import styles from "./style.module.css";

export default function NotFound() {
    return (
        <div className={styles.page}>
            <div className={`container ${styles.inner}`}>
                <div className={styles.ornament} aria-hidden="true" lang="hi">
                    {BRAND.devanagari}
                </div>
                <div className="t-eyebrow">Error 404</div>
                <h1 className={styles.title}>This page isn&apos;t here.</h1>
                <p className={styles.body}>
                    The link may be old, or the piece may have sold out and
                    moved on. Everything we make is in the shop.
                </p>
                <div className={styles.actions}>
                    <Link to={ROUTES.products} className="btn btn-primary">
                        Shop all
                    </Link>
                    <Link
                        to={collectionPath("dupattas")}
                        className="btn btn-secondary"
                    >
                        Dupattas
                    </Link>
                    <Link
                        to={collectionPath("pants")}
                        className="btn btn-secondary"
                    >
                        Pants
                    </Link>
                </div>
            </div>
        </div>
    );
}
