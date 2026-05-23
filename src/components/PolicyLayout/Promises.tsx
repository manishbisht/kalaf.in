import type { PolicyPromise } from "./types";
import styles from "./style.module.css";

export function Promises({ promises }: { promises: PolicyPromise[] }) {
    return (
        <section className={styles.promises}>
            <div className="container">
                <div className={styles.promisesHeader}>
                    <span
                        className="t-eyebrow"
                        style={{ color: "var(--smoke)" }}
                    >
                        If you read nothing else
                    </span>
                    <span className={styles.promisesLine} />
                </div>

                <div className={styles.promisesGrid}>
                    {promises.map((pr, i) => (
                        <div
                            key={i}
                            className={`${styles.promiseCard} ${i === 0 ? styles.promiseCardFirst : ""}`}
                        >
                            <div className={styles.promiseKicker}>
                                {pr.kicker}
                            </div>
                            <div className={styles.promiseLabel}>
                                {pr.label}
                            </div>
                            <p className={styles.promiseBody}>{pr.body}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
