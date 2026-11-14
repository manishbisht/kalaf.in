import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import type { PolicySection } from "./types";
import styles from "./style.module.css";

// Internal paths ("/size-guide") route with <Link>; http(s) links open in a
// new tab; mailto:/tel: are plain links.
function SmartLink({
    href,
    className,
    children,
}: {
    href: string;
    className: string;
    children: ReactNode;
}) {
    if (href.startsWith("/")) {
        return (
            <Link to={href} className={className}>
                {children}
            </Link>
        );
    }
    return (
        <a
            href={href}
            {...(href.startsWith("http") && {
                target: "_blank",
                rel: "noopener noreferrer",
            })}
            className={className}
        >
            {children}
        </a>
    );
}

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
                    if (b.kind === "links") {
                        return (
                            <div key={i} className={styles.linkGrid}>
                                {b.items.map((item, j) => (
                                    <SmartLink
                                        key={j}
                                        href={item.href}
                                        className={styles.linkCard}
                                    >
                                        <span className={styles.linkCardLabel}>
                                            {item.label}
                                        </span>
                                        {item.sub && (
                                            <span
                                                className={styles.linkCardSub}
                                            >
                                                {item.sub}
                                            </span>
                                        )}
                                        <span
                                            className={styles.linkCardArrow}
                                            aria-hidden
                                        >
                                            ↗
                                        </span>
                                    </SmartLink>
                                ))}
                            </div>
                        );
                    }
                    if (b.kind === "qa") {
                        return (
                            <div
                                key={i}
                                className={`${styles.qa} ${i > 0 ? styles.qaBordered : ""}`}
                            >
                                <h3 className={styles.qaQuestion}>{b.q}</h3>
                                <p className={styles.qaAnswer}>{b.a}</p>
                                {b.links && b.links.length > 0 && (
                                    <div className={styles.qaLinks}>
                                        {b.links.map((l) => (
                                            <SmartLink
                                                key={l.href}
                                                href={l.href}
                                                className={styles.qaLink}
                                            >
                                                {l.label} →
                                            </SmartLink>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    }
                    if (b.kind === "table") {
                        return (
                            <div key={i} className={styles.tableWrap}>
                                <table className={styles.table}>
                                    {b.caption && (
                                        <caption
                                            className={styles.tableCaption}
                                        >
                                            {b.caption}
                                        </caption>
                                    )}
                                    <thead>
                                        <tr>
                                            {b.head.map((h) => (
                                                <th key={h} scope="col">
                                                    {h}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {b.rows.map((row) => (
                                            <tr key={row[0]}>
                                                {row.map((cell, j) =>
                                                    j === 0 ? (
                                                        <th key={j} scope="row">
                                                            {cell}
                                                        </th>
                                                    ) : (
                                                        <td key={j}>{cell}</td>
                                                    )
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
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
