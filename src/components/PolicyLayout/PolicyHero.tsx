import { Link } from "react-router-dom";
import { ROUTES } from "../../constants";
import type { PolicyData } from "./types";
import styles from "./style.module.css";

function MetaRow({ label, value }: { label: string; value: string }) {
    return (
        <li className={styles.metaRow}>
            <span className={styles.metaLabel}>{label}</span>
            <span className={styles.metaValue}>{value}</span>
        </li>
    );
}

export function PolicyHero({ data }: { data: PolicyData }) {
    return (
        <section className={styles.hero}>
            <div aria-hidden className={styles.ornament}>
                {data.ornament}
            </div>

            <div className={`container ${styles.heroInner}`}>
                <nav className={styles.breadcrumb}>
                    <Link to={ROUTES.home} className={styles.breadcrumbLink}>
                        Home
                    </Link>
                    <span>/</span>
                    <span>Policies</span>
                    <span>/</span>
                    <span className={styles.breadcrumbCurrent}>
                        {data.title}
                    </span>
                </nav>

                <div className={styles.heroTitleGrid}>
                    <div>
                        <div className={`t-eyebrow ${styles.eyebrow}`}>
                            {data.eyebrow}
                        </div>
                        <h1 className={styles.heroTitle}>{data.title}.</h1>
                    </div>
                </div>

                <div className={styles.heroMeta}>
                    <p className={styles.summary}>{data.summary}</p>
                    <ul className={styles.metaList}>
                        <MetaRow label="Last updated" value={data.updated} />
                        <MetaRow label="Reading time" value={data.readTime} />
                        <MetaRow label="Written by" value="Kalaf, Jaipur" />
                        <MetaRow label="Version" value="2.0" />
                    </ul>
                </div>
            </div>
        </section>
    );
}
