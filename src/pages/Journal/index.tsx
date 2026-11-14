import { Link } from "react-router-dom";
import { ROUTES, journalPath } from "../../constants";
import {
    ARTICLES,
    JOURNAL_INTRO,
    heroImage,
    readingTime,
    type Article,
} from "./articles";
import styles from "./style.module.css";

function Card({ article, featured }: { article: Article; featured?: boolean }) {
    const image = heroImage(article);
    return (
        <Link
            to={journalPath(article.slug)}
            className={`${styles.card} ${featured ? styles.featured : ""}`}
        >
            <div className={styles.media}>
                {image && (
                    <img
                        src={featured ? image.srcLarge : image.src}
                        srcSet={`${image.src} 600w, ${image.srcLarge} 1200w`}
                        sizes={
                            featured
                                ? "(max-width: 768px) 100vw, 50vw"
                                : "(max-width: 768px) 100vw, 25vw"
                        }
                        width={1200}
                        height={1800}
                        alt=""
                        loading={featured ? undefined : "lazy"}
                        decoding="async"
                    />
                )}
            </div>
            <div className={styles.cardBody}>
                <div className={`t-eyebrow ${styles.kicker}`}>
                    {article.category} · {readingTime(article)}
                </div>
                <h2 className={styles.cardTitle}>{article.title}</h2>
                <p className={styles.cardText}>{article.description}</p>
                <span className={styles.cta}>Read the article →</span>
            </div>
        </Link>
    );
}

export default function Journal() {
    const [first, ...rest] = ARTICLES;
    return (
        <main className={styles.page}>
            <header className={styles.header}>
                <div className={styles.ornament} aria-hidden="true">
                    पत्रिका
                </div>
                <div className={`container ${styles.headerInner}`}>
                    <nav className={styles.breadcrumb} aria-label="Breadcrumb">
                        <Link to={ROUTES.home}>Home</Link>
                        <span aria-hidden>/</span>
                        <span>Journal</span>
                    </nav>
                    <div className={`t-eyebrow ${styles.eyebrow}`}>
                        Craft, care &amp; how to wear
                    </div>
                    <h1 className={styles.title}>Journal.</h1>
                    <p className={styles.intro}>{JOURNAL_INTRO}</p>
                </div>
            </header>

            <div className={`container ${styles.list}`}>
                {first && <Card article={first} featured />}
                <div className={styles.grid}>
                    {rest.map((a) => (
                        <Card key={a.slug} article={a} />
                    ))}
                </div>
            </div>
        </main>
    );
}
