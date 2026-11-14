import { Link } from "react-router-dom";
import { ROUTES } from "../../constants";
import { MetaRow } from "./MetaRow";
import type { PolicyData } from "./types";
import styles from "./style.module.css";

export function PolicyHero({
    data,
    section,
}: {
    data: PolicyData;
    // Breadcrumb middle step: "Help" for guides, "Policies" for legal pages.
    section: string;
}) {
    return (
        <section className={styles.hero}>
            <div aria-hidden="true" lang="hi" className={styles.ornament}>
                {data.ornament}
            </div>

            <div className={`container ${styles.heroInner}`}>
                <nav className={styles.breadcrumb} aria-label="Breadcrumb">
                    <Link to={ROUTES.home} className={styles.breadcrumbLink}>
                        Home
                    </Link>
                    <span aria-hidden="true">/</span>
                    <span>{section}</span>
                    <span aria-hidden="true">/</span>
                    <span
                        className={styles.breadcrumbCurrent}
                        aria-current="page"
                    >
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
