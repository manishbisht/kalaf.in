import { Link, useParams } from "react-router-dom";
import {
    ROUTES,
    collectionPath,
    journalPath,
    productPath,
} from "../../constants";
import {
    LISTING,
    PRODUCTS,
    isSoldOut,
    type ListingItem,
} from "../../data/catalog";
import { ProductCard } from "../../components/ProductCard";
import NotFound from "../NotFound";
import {
    ARTICLES,
    findArticle,
    heroImage,
    readingTime,
    type Article,
    type ArticleBlock,
} from "../Journal/articles";
import { RichText } from "./RichText";
import { CatalogImage } from "../../components/CatalogImage";
import styles from "./style.module.css";

const SHOP_LIMIT = 4;

// Up to four in-stock colours across the related products, taking one from
// each product in turn so every piece gets a look-in.
function shopItems(article: Article): ListingItem[] {
    const pools = article.related.map((handle) =>
        LISTING.filter(
            (i) => i.product.handle === handle && !isSoldOut(i.variant)
        )
    );
    const items: ListingItem[] = [];
    for (let round = 0; items.length < SHOP_LIMIT; round++) {
        const picks = pools.map((p) => p[round]).filter(Boolean);
        if (!picks.length) break;
        items.push(...picks.slice(0, SHOP_LIMIT - items.length));
    }
    return items;
}

// Where "View all" goes: the shared collection, if every related piece is in one.
function shopAllPath(article: Article) {
    const collections = new Set(
        article.related.map(
            (h) => PRODUCTS.find((p) => p.handle === h)?.collection
        )
    );
    const [only] = collections;
    return collections.size === 1 && only
        ? collectionPath(only)
        : ROUTES.products;
}

function Block({ block }: { block: ArticleBlock }) {
    switch (block.kind) {
        case "p":
            return (
                <p className={styles.para}>
                    <RichText text={block.text} />
                </p>
            );
        case "list":
            return (
                <ul className={styles.list}>
                    {block.items.map((item) => (
                        <li key={item} className={styles.listItem}>
                            <span className={styles.listDash} aria-hidden />
                            <span>
                                <RichText text={item} />
                            </span>
                        </li>
                    ))}
                </ul>
            );
        case "steps":
            return (
                <ol className={styles.steps}>
                    {block.items.map((item, i) => (
                        <li key={item} className={styles.step}>
                            <span className={styles.stepNum}>
                                Step {String(i + 1).padStart(2, "0")}
                            </span>
                            <span>
                                <RichText text={item} />
                            </span>
                        </li>
                    ))}
                </ol>
            );
    }
}

export default function JournalArticle() {
    const { slug } = useParams();
    const article = findArticle(slug);
    if (!article) return <NotFound />;

    const image = heroImage(article);
    const items = shopItems(article);
    const more = ARTICLES.filter((a) => a.slug !== article.slug).slice(0, 3);

    return (
        <div className={styles.page}>
            <article>
                <header className={styles.header}>
                    <div
                        className={styles.ornament}
                        aria-hidden="true"
                        lang="hi"
                    >
                        {article.ornament}
                    </div>
                    <div className={`container ${styles.headerGrid}`}>
                        <div className={styles.headerText}>
                            <nav
                                className={styles.breadcrumb}
                                aria-label="Breadcrumb"
                            >
                                <Link to={ROUTES.home}>Home</Link>
                                <span aria-hidden>/</span>
                                <Link to={ROUTES.journal}>Journal</Link>
                                <span aria-hidden>/</span>
                                <span>{article.category}</span>
                            </nav>
                            <div className={`t-eyebrow ${styles.eyebrow}`}>
                                {article.category} · {readingTime(article)}
                            </div>
                            <h1 className={styles.title}>{article.title}</h1>
                            <p className={styles.intro}>
                                <RichText text={article.intro} />
                            </p>
                            <dl className={styles.meta}>
                                <div>
                                    <dt>Published</dt>
                                    <dd>
                                        <time dateTime={article.datePublished}>
                                            {article.date}
                                        </time>
                                    </dd>
                                </div>
                                <div>
                                    <dt>By</dt>
                                    <dd>Kalaf, Jaipur</dd>
                                </div>
                            </dl>
                        </div>
                        {image && (
                            <figure className={styles.figure}>
                                <CatalogImage
                                    image={image}
                                    sizes="(max-width: 900px) 100vw, 40vw"
                                    alt={image.alt}
                                    fetchPriority="high"
                                />
                                <figcaption className={styles.caption}>
                                    Pictured:{" "}
                                    <Link
                                        to={productPath(
                                            article.hero.handle,
                                            article.hero.colour
                                        )}
                                    >
                                        {image.alt}
                                    </Link>
                                </figcaption>
                            </figure>
                        )}
                    </div>
                </header>

                <div className={`container ${styles.bodyGrid}`}>
                    <nav className={styles.toc} aria-label="In this article">
                        <div className={styles.tocLabel}>In this article</div>
                        <ol>
                            {article.sections.map((s) => (
                                <li key={s.id}>
                                    <a href={`#${s.id}`}>{s.heading}</a>
                                </li>
                            ))}
                        </ol>
                    </nav>

                    <div className={styles.main}>
                        {article.sections.map((s) => (
                            <section
                                key={s.id}
                                id={s.id}
                                className={styles.section}
                            >
                                <h2 className={styles.sectionTitle}>
                                    {s.heading}
                                </h2>
                                {s.blocks.map((b, i) => (
                                    <Block key={i} block={b} />
                                ))}
                            </section>
                        ))}
                    </div>
                </div>
            </article>

            {items.length > 0 && (
                <section className={styles.shop} aria-labelledby="shop-head">
                    <div className="container">
                        <div className={styles.shopHead}>
                            <h2 id="shop-head">Shop the pieces</h2>
                            <Link to={shopAllPath(article)}>View all →</Link>
                        </div>
                        <div className={styles.shopGrid}>
                            {items.map((item) => (
                                <ProductCard
                                    key={item.variant.sku}
                                    item={item}
                                />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            <section className={styles.more} aria-labelledby="more-head">
                <div className="container">
                    <div className={styles.moreHead}>
                        <span id="more-head" className="t-eyebrow">
                            More from the journal
                        </span>
                        <span className={styles.moreLine} />
                    </div>
                    <div className={styles.moreGrid}>
                        {more.map((a) => (
                            <Link
                                key={a.slug}
                                to={journalPath(a.slug)}
                                className={styles.moreLink}
                            >
                                <span className={styles.moreKicker}>
                                    {a.category} · {readingTime(a)}
                                </span>
                                <span className={styles.moreTitle}>
                                    {a.title}
                                </span>
                                <span className={styles.moreCta}>Read →</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
