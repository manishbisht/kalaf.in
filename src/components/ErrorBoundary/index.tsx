import { Component, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { BRAND, ROUTES } from "../../constants";
import styles from "./style.module.css";

type Props = {
    children: ReactNode;
    // Clears the error when it changes (the App passes the pathname), so
    // navigating away from a broken page shows the next page again.
    resetKey?: string;
};

type State = { error: Error | null; resetKey?: string };

// Catches a render error (or a page chunk that won't load, after
// lazyWithReload has tried a reload) and shows a way out instead of a blank
// page. It renders its children untouched until something throws, so the
// prerendered HTML and hydration are unaffected.
export class ErrorBoundary extends Component<Props, State> {
    state: State = { error: null, resetKey: this.props.resetKey };

    static getDerivedStateFromError(error: Error): Partial<State> {
        return { error };
    }

    static getDerivedStateFromProps(
        props: Props,
        state: State
    ): Partial<State> | null {
        if (props.resetKey !== state.resetKey) {
            return { error: null, resetKey: props.resetKey };
        }
        return null;
    }

    render() {
        if (!this.state.error) return this.props.children;
        return (
            <div className={styles.page} role="alert">
                <div className={`container ${styles.inner}`}>
                    <div
                        className={styles.ornament}
                        aria-hidden="true"
                        lang="hi"
                    >
                        {BRAND.devanagari}
                    </div>
                    <div className="t-eyebrow">Error</div>
                    <h1 className={styles.title}>Something went wrong.</h1>
                    <p className={styles.body}>
                        This page didn&apos;t load properly. Reloading usually
                        fixes it. If it keeps happening, write to us at{" "}
                        <a href={`mailto:${BRAND.email}`}>{BRAND.email}</a>.
                    </p>
                    <div className={styles.actions}>
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => window.location.reload()}
                        >
                            Reload
                        </button>
                        <Link to={ROUTES.home} className="btn btn-secondary">
                            Home
                        </Link>
                    </div>
                </div>
            </div>
        );
    }
}
