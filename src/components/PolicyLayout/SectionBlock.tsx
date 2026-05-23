import type { PolicySection } from "./types";
import styles from "./style.module.css";

export function SectionBlock({
    section,
    index,
}: {
    section: PolicySection;
    index: number;
}) {
    return (
        <section
            id={`sec-${section.id}`}
            className={`${styles.sectionBlock} ${index > 0 ? styles.sectionBlockIndented : ""}`}
        >
            <div className={styles.sectionHeader}>
                <span className={styles.sectionNum}>
                    {String(index + 1).padStart(2, "0")}
                </span>
                <h2 className={styles.sectionTitle}>{section.title}.</h2>
            </div>

            <div>
                {section.body.map((b, i) => {
                    if (b.kind === "p") {
                        return (
                            <p
                                key={i}
                                className={`${styles.para} ${i === 0 ? styles.paraFirst : styles.paraRest}`}
                            >
                                {b.text}
                            </p>
                        );
                    }
                    if (b.kind === "list") {
                        return (
                            <ul key={i} className={styles.list}>
                                {b.items.map((item, j) => (
                                    <li
                                        key={j}
                                        className={`${styles.listItem} ${j < b.items.length - 1 ? styles.listItemBordered : ""}`}
                                    >
                                        <span
                                            className={styles.listDash}
                                            aria-hidden
                                        />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        );
                    }
                    return null;
                })}
            </div>

            {section.steps && (
                <ol className={styles.steps}>
                    {section.steps.map((step, i) => (
                        <li
                            key={i}
                            className={`${styles.stepItem} ${i < section.steps!.length - 1 ? styles.stepItemBordered : ""}`}
                        >
                            <span className={styles.stepNum}>
                                STEP {String(i + 1).padStart(2, "0")}
                            </span>
                            <span className={styles.stepText}>{step}</span>
                        </li>
                    ))}
                </ol>
            )}

            {section.callout && (
                <div className={styles.callout}>
                    <div className={styles.calloutLabel}>
                        {section.callout.label}
                    </div>
                    <div className={styles.calloutValue}>
                        {section.callout.value}
                    </div>
                </div>
            )}
        </section>
    );
}
