import { Link } from "react-router-dom";
import { Icon } from "../Icons";
import type { CrossLink } from "./types";
import styles from "./style.module.css";

export function CrossLinks({
    crossLinks,
    currentSlug,
    header,
}: {
    crossLinks: CrossLink[];
    currentSlug: string;
    header?: string;
}) {
    return (
        <section className={styles.crossLinks}>
            <div className="container">
                <div className={styles.crossLinksHeader}>
                    <span
                        className="t-eyebrow"
                        style={{ color: "var(--smoke)" }}
                    >
                        {header ?? "The other policies"}
                    </span>
                    <span className={styles.crossLinksLine} />
                </div>

                <div
                    className={styles.crossLinksGrid}
                    style={{
                        gridTemplateColumns: `repeat(${crossLinks.length}, 1fr)`,
                    }}
                >
                    {crossLinks.map((l) => {
                        const isCurrent = l.slug === currentSlug;
                        return isCurrent ? (
                            <div
                                key={l.slug}
                                className={`${styles.crossLink} ${styles.crossLinkCurrent}`}
                            >
                                <span className={styles.crossLinkNum}>
                                    {l.num} · You are here
                                </span>
                                <span className={styles.crossLinkTitle}>
                                    {l.label}
                                </span>
                            </div>
                        ) : (
                            <Link
                                key={l.slug}
                                to={l.to}
                                className={styles.crossLink}
                            >
                                <span className={styles.crossLinkNum}>
                                    {l.num}
                                </span>
                                <span className={styles.crossLinkTitle}>
                                    {l.label}
                                </span>
                                <span className={styles.crossLinkCta}>
                                    Open <Icon name="arrowUpRight" size={12} />
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
