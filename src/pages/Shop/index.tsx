import { useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import {
    COLLECTIONS,
    LISTING,
    type CollectionHandle,
} from "../../data/catalog";
import { ROUTES, collectionPath } from "../../constants";
import { ProductCard } from "../../components/ProductCard";
import { FilterPanel } from "./FilterPanel";
import {
    FILTER_GROUPS,
    SORTS,
    matches,
    readSelection,
    sortItems,
} from "./filters";
import styles from "./style.module.css";

// Serves /products (everything) and /collections/:handle (one collection).
export default function Shop() {
    const { handle } = useParams();
    const [params, setParams] = useSearchParams();
    const [filtersOpen, setFiltersOpen] = useState(false);

    const collection =
        handle && handle in COLLECTIONS
            ? COLLECTIONS[handle as CollectionHandle]
            : null;

    const scope = useMemo(
        () =>
            handle
                ? LISTING.filter((i) => i.product.collection === handle)
                : LISTING,
        [handle]
    );
    const selection = readSelection(params);
    const sort = params.get("sort") ?? "featured";
    const results = sortItems(
        scope.filter((i) => matches(i, selection)),
        sort
    );
    const active = FILTER_GROUPS.flatMap((g) =>
        (selection[g.key] ?? []).map((value) => ({ group: g.key, value }))
    );

    if (handle && !collection) {
        return (
            <main className={styles.page}>
                <div className={`container ${styles.empty}`}>
                    <h1 className={styles.title}>Collection not found</h1>
                    <Link to={ROUTES.products} className="btn btn-primary">
                        Shop all products
                    </Link>
                </div>
            </main>
        );
    }

    const update = (fn: (p: URLSearchParams) => void) => {
        const next = new URLSearchParams(params);
        fn(next);
        setParams(next, { replace: true });
    };

    const toggle = (group: string, value: string) =>
        update((p) => {
            const cur = new Set(selection[group] ?? []);
            if (cur.has(value)) cur.delete(value);
            else cur.add(value);
            if (cur.size) p.set(group, [...cur].join(","));
            else p.delete(group);
        });

    const clearAll = () =>
        update((p) => FILTER_GROUPS.forEach((g) => p.delete(g.key)));

    const title = collection?.title ?? "All products";

    return (
        <main className={styles.page}>
            <header className={styles.header}>
                <div className="container">
                    <nav className={styles.breadcrumb} aria-label="Breadcrumb">
                        <Link to={ROUTES.home}>Home</Link>
                        <span>/</span>
                        {collection ? (
                            <>
                                <Link to={ROUTES.products}>Shop</Link>
                                <span>/</span>
                                <span>{collection.title}</span>
                            </>
                        ) : (
                            <span>Shop</span>
                        )}
                    </nav>
                    <div className={styles.headRow}>
                        <div>
                            <div className={styles.eyebrow}>
                                {collection?.eyebrow ?? "Shop — everything"}
                                <span className={styles.devanagari}>
                                    {collection?.devanagari ?? "सब"}
                                </span>
                            </div>
                            <h1 className={styles.title}>{title}</h1>
                        </div>
                        <p className={styles.intro}>
                            {collection?.intro ??
                                "Every Kalaf piece, made in Jaipur. Pick one and buy it on Flipkart or Meesho — the marketplace handles delivery and returns."}
                        </p>
                    </div>
                    <div className={styles.tabs}>
                        <Link
                            to={ROUTES.products}
                            className={!handle ? styles.tabActive : ""}
                        >
                            All
                        </Link>
                        {(Object.keys(COLLECTIONS) as CollectionHandle[]).map(
                            (h) => (
                                <Link
                                    key={h}
                                    to={collectionPath(h)}
                                    className={
                                        handle === h ? styles.tabActive : ""
                                    }
                                >
                                    {COLLECTIONS[h].title}
                                </Link>
                            )
                        )}
                    </div>
                </div>
            </header>

            <div className={`container ${styles.layout}`}>
                <aside
                    className={`${styles.sidebar} ${filtersOpen ? styles.sidebarOpen : ""}`}
                >
                    <div className={styles.sidebarHead}>
                        <span>Filter</span>
                        <button
                            type="button"
                            className={styles.closeBtn}
                            onClick={() => setFiltersOpen(false)}
                        >
                            Done
                        </button>
                    </div>
                    <FilterPanel
                        items={scope}
                        selection={selection}
                        onToggle={toggle}
                    />
                </aside>

                <section>
                    <div className={styles.toolbar}>
                        <button
                            type="button"
                            className={styles.filterBtn}
                            onClick={() => setFiltersOpen(true)}
                        >
                            Filter{active.length ? ` (${active.length})` : ""}
                        </button>
                        <span className={styles.count}>
                            {results.length}{" "}
                            {results.length === 1 ? "product" : "products"}
                        </span>
                        <label className={styles.sort}>
                            <span>Sort</span>
                            <select
                                value={sort}
                                onChange={(e) =>
                                    update((p) => {
                                        if (e.target.value === "featured")
                                            p.delete("sort");
                                        else p.set("sort", e.target.value);
                                    })
                                }
                            >
                                {SORTS.map((s) => (
                                    <option key={s.key} value={s.key}>
                                        {s.label}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>

                    {active.length > 0 && (
                        <div className={styles.activeRow}>
                            {active.map(({ group, value }) => (
                                <button
                                    key={group + value}
                                    type="button"
                                    className={styles.activeChip}
                                    onClick={() => toggle(group, value)}
                                >
                                    {value} <span aria-hidden="true">×</span>
                                </button>
                            ))}
                            <button
                                type="button"
                                className={styles.clearBtn}
                                onClick={clearAll}
                            >
                                Clear all
                            </button>
                        </div>
                    )}

                    {results.length ? (
                        <div className={styles.grid}>
                            {results.map((item) => (
                                <ProductCard
                                    key={item.variant.sku}
                                    item={item}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className={styles.noResults}>
                            Nothing matches those filters.{" "}
                            <button type="button" onClick={clearAll}>
                                Clear filters
                            </button>
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
}
