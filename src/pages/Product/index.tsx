import { useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import {
    COLLECTIONS,
    LISTING,
    findProduct,
    formatRupees,
    percentOff,
} from "../../data/catalog";
import { ROUTES, collectionPath } from "../../constants";
import { BuyButtons } from "../../components/BuyButtons";
import { ProductCard } from "../../components/ProductCard";
import { Swatch } from "../../components/Swatch";
import { Gallery } from "./Gallery";
import styles from "./style.module.css";

export default function ProductPage() {
    const { handle } = useParams();
    const [params, setParams] = useSearchParams();
    const [size, setSize] = useState<string | null>(null);
    const product = findProduct(handle);

    if (!product) {
        return (
            <main className={styles.page}>
                <div className={`container ${styles.notFound}`}>
                    <h1>Product not found</h1>
                    <Link to={ROUTES.products} className="btn btn-primary">
                        Shop all products
                    </Link>
                </div>
            </main>
        );
    }

    const variant =
        product.variants.find((v) => v.colourCode === params.get("colour")) ??
        product.variants[0];
    const collection = COLLECTIONS[product.collection];

    // Pants: Flipkart has a separate page per size, so the chosen size picks
    // the Flipkart link. Meesho has one page with its own size picker.
    const links = { ...variant.links };
    if (size && variant.sizeLinks?.[size]) {
        links.flipkart = variant.sizeLinks[size];
    }

    const related = LISTING.filter(
        (i) =>
            i.product.collection === product.collection &&
            i.variant.sku !== variant.sku
    ).slice(0, 4);

    const facts = [
        product.fabric && ["Fabric", product.fabric],
        product.pattern && ["Pattern", product.pattern],
        product.border && ["Border", product.border],
        product.fit && ["Fit", product.fit],
        product.size && ["Size", product.size],
    ].filter(Boolean) as [string, string][];

    return (
        <main className={styles.page}>
            <div className="container">
                <nav className={styles.breadcrumb} aria-label="Breadcrumb">
                    <Link to={ROUTES.home}>Home</Link>
                    <span>/</span>
                    <Link to={collectionPath(product.collection)}>
                        {collection.title}
                    </Link>
                    <span>/</span>
                    <span>{product.title}</span>
                </nav>

                <div className={styles.layout}>
                    <Gallery
                        key={variant.sku}
                        product={product}
                        variant={variant}
                    />

                    <div className={styles.info}>
                        <div className={styles.eyebrow}>
                            Kalaf · Made in Jaipur
                        </div>
                        <h1 className={styles.title}>{product.title}</h1>
                        <div className={styles.priceRow}>
                            <span className={styles.price}>
                                {formatRupees(variant.price)}
                            </span>
                            <s className={styles.mrp}>
                                MRP {formatRupees(variant.mrp)}
                            </s>
                            <span className={styles.off}>
                                {percentOff(variant.price, variant.mrp)}% off
                            </span>
                        </div>

                        <div className={styles.label}>
                            Colour — <strong>{variant.colour}</strong>
                        </div>
                        <div className={styles.swatches}>
                            {product.variants.map((v) => (
                                <button
                                    key={v.sku}
                                    type="button"
                                    title={v.colour}
                                    aria-label={v.colour}
                                    aria-pressed={v.sku === variant.sku}
                                    className={`${styles.swatchBtn} ${v.sku === variant.sku ? styles.swatchActive : ""}`}
                                    onClick={() =>
                                        setParams(
                                            { colour: v.colourCode },
                                            { replace: true }
                                        )
                                    }
                                >
                                    <Swatch code={v.colourCode} size={28} />
                                </button>
                            ))}
                        </div>

                        {product.sizes.length > 0 && (
                            <>
                                <div className={styles.label}>
                                    Waist size (inches)
                                    {size && (
                                        <>
                                            {" "}
                                            — <strong>{size}</strong>
                                        </>
                                    )}
                                </div>
                                <div className={styles.sizes}>
                                    {product.sizes.map((s) => (
                                        <button
                                            key={s}
                                            type="button"
                                            aria-pressed={s === size}
                                            className={`${styles.sizeBtn} ${s === size ? styles.sizeActive : ""}`}
                                            onClick={() => setSize(s)}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                                <Link
                                    to={ROUTES.sizeGuide}
                                    className={styles.sizeGuide}
                                >
                                    Size guide →
                                </Link>
                            </>
                        )}

                        <div className={styles.buy}>
                            <div className={styles.label}>Buy it on</div>
                            <BuyButtons links={links} prices={variant.prices} />
                            <p className={styles.buyNote}>
                                You&apos;ll check out on the marketplace — they
                                handle payment, delivery and returns.
                                {product.sizes.length > 0 &&
                                    " Pick your size there if you haven't chosen one here."}
                            </p>
                        </div>

                        <p className={styles.description}>
                            {product.description}
                        </p>

                        {facts.length > 0 && (
                            <dl className={styles.facts}>
                                {facts.map(([k, v]) => (
                                    <div key={k}>
                                        <dt>{k}</dt>
                                        <dd>{v}</dd>
                                    </div>
                                ))}
                            </dl>
                        )}

                        {product.features.length > 0 && (
                            <details className={styles.more} open>
                                <summary>Features</summary>
                                <ul>
                                    {product.features.map((f) => (
                                        <li key={f}>{f}</li>
                                    ))}
                                </ul>
                            </details>
                        )}
                        {product.details.length > 0 && (
                            <details className={styles.more}>
                                <summary>Details</summary>
                                <ul>
                                    {product.details.map((f) => (
                                        <li key={f}>{f}</li>
                                    ))}
                                </ul>
                            </details>
                        )}
                        {product.care.length > 0 && (
                            <details className={styles.more}>
                                <summary>Material &amp; care</summary>
                                <ul>
                                    {product.care.map((f) => (
                                        <li key={f}>{f}</li>
                                    ))}
                                </ul>
                            </details>
                        )}
                    </div>
                </div>

                {related.length > 0 && (
                    <section className={styles.related}>
                        <div className={styles.relatedHead}>
                            <h2>More {collection.title.toLowerCase()}</h2>
                            <Link to={collectionPath(product.collection)}>
                                View all →
                            </Link>
                        </div>
                        <div className={styles.relatedGrid}>
                            {related.map((item) => (
                                <ProductCard
                                    key={item.variant.sku}
                                    item={item}
                                />
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </main>
    );
}
