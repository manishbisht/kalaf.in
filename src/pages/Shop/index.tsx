import {
    useEffect,
    useMemo,
    useRef,
    useState,
    useSyncExternalStore,
} from "react";
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
import NotFound from "../NotFound";
import styles from "./style.module.css";

// Makes everything on the page except `el` (and its ancestors) inert, so Tab
// and screen readers stay inside the open drawer. Returns an undo function.
function inertOutside(el: HTMLElement | null) {
    const made: HTMLElement[] = [];
    for (let node = el; node && node !== document.body; ) {
        const parent: HTMLElement | null = node.parentElement;
        for (const sib of Array.from(parent?.children ?? [])) {
            if (sib !== node && sib instanceof HTMLElement && !sib.inert) {
                sib.inert = true;
                made.push(sib);
            }
        }
        node = parent;
    }
    return () => made.forEach((m) => (m.inert = false));
}

// Serves /products (everything) and /collections/:handle (one collection).
export default function Shop() {
    const { handle } = useParams();
    const [params, setParams] = useSearchParams();
    const [filtersOpen, setFiltersOpen] = useState(false);
    const isDrawer = useIsNarrow();
    const drawerOpen = isDrawer && filtersOpen;
    const filterBtnRef = useRef<HTMLButtonElement>(null);
    const doneBtnRef = useRef<HTMLButtonElement>(null);

    // Mobile filter drawer: focus it on open, close on Esc, lock page scroll,
    // and hand focus back to the Filter button when it closes.
    useEffect(() => {
        if (!drawerOpen) return;
        const toggleBtn = filterBtnRef.current;
        doneBtnRef.current?.focus();
        const restoreInert = inertOutside(
            document.getElementById("shop-filters")
        );
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") setFiltersOpen(false);
        };
        window.addEventListener("keydown", onKey);
        return () => {
            window.removeEventListener("keydown", onKey);
            document.body.style.overflow = prevOverflow;
            restoreInert();
            toggleBtn?.focus();
        };
    }, [drawerOpen]);

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
        return <NotFound />;
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
        <div className={styles.page}>
            <header className={styles.header}>
                <div className="container">
                    <nav className={styles.breadcrumb} aria-label="Breadcrumb">
                        <Link to={ROUTES.home}>Home</Link>
                        <span aria-hidden="true">/</span>
                        {collection ? (
                            <>
                                <Link to={ROUTES.products}>Shop</Link>
                                <span aria-hidden="true">/</span>
                                <span aria-current="page">
                                    {collection.title}
                                </span>
                            </>
                        ) : (
                            <span aria-current="page">Shop</span>
                        )}
                    </nav>
                    <div className={styles.headRow}>
                        <div>
                            <div className={styles.eyebrow}>
                                {collection?.eyebrow ?? "Shop — everything"}
                                <span
                                    className={styles.devanagari}
                                    lang="hi"
                                    aria-hidden="true"
                                >
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
                    <nav className={styles.tabs} aria-label="Collections">
                        <Link
                            to={ROUTES.products}
                            className={!handle ? styles.tabActive : ""}
                            aria-current={!handle ? "page" : undefined}
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
                                    aria-current={
                                        handle === h ? "page" : undefined
                                    }
                                >
                                    {COLLECTIONS[h].title}
                                </Link>
                            )
                        )}
                    </nav>
                </div>
            </header>

            <div className={`container ${styles.layout}`}>
                <section
                    id="shop-filters"
                    className={`${styles.sidebar} ${drawerOpen ? styles.sidebarOpen : ""}`}
                    aria-label="Filters"
                    {...(isDrawer && {
                        role: "dialog",
                        "aria-modal": true,
                        inert: !drawerOpen,
                    })}
                >
                    <div className={styles.sidebarHead}>
                        <span>
                            Filter
                            {active.length > 0 && (
                                <button
                                    type="button"
                                    className={styles.clearBtn}
                                    onClick={clearAll}
                                >
                                    Clear all
                                </button>
                            )}
                        </span>
                        <button
                            ref={doneBtnRef}
                            type="button"
                            className={styles.closeBtn}
                            onClick={() => setFiltersOpen(false)}
                        >
                            Show {results.length}{" "}
                            {results.length === 1 ? "product" : "products"}
                        </button>
                    </div>
                    <FilterPanel
                        items={scope}
                        selection={selection}
                        onToggle={toggle}
                    />
                </section>

                <section>
                    <div className={styles.toolbar}>
                        <button
                            ref={filterBtnRef}
                            type="button"
                            className={styles.filterBtn}
                            aria-expanded={drawerOpen}
                            aria-controls="shop-filters"
                            onClick={() => setFiltersOpen(true)}
                        >
                            Filter
                            {active.length > 0 && (
                                <span className={styles.filterCount}>
                                    <span className={styles.srOnly}>, </span>
                                    {active.length}
                                    <span className={styles.srOnly}>
                                        {" "}
                                        active
                                    </span>
                                </span>
                            )}
                        </button>
                        {/* A status region, so screen readers hear the new
                            count when a filter changes the results. */}
                        <span className={styles.count} role="status">
                            {results.length}{" "}
                            {results.length === 1 ? "product" : "products"}
                        </span>
                        <label className={styles.sort}>
                            {/* Hidden on phones; aria-label keeps the name. */}
                            <span>Sort by</span>
                            <select
                                aria-label="Sort by"
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
                            {results.map((item, i) => (
                                <ProductCard
                                    key={item.variant.sku}
                                    item={item}
                                    // First row (up to 3 across on desktop).
                                    eager={i < 3}
                                    priority={i === 0}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className={styles.noResults}>
                            <p>Nothing matches those filters.</p>
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={clearAll}
                            >
                                Clear filters
                            </button>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}

// True below the width where the filter sidebar becomes a drawer. False while
// prerendering (no matchMedia on the server), then the real value on hydrate.
const NARROW = "(max-width: 900px)";
const subscribeNarrow = (onChange: () => void) => {
    const mq = matchMedia(NARROW);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
};
function useIsNarrow() {
    return useSyncExternalStore(
        subscribeNarrow,
        () => matchMedia(NARROW).matches,
        () => false
    );
}
