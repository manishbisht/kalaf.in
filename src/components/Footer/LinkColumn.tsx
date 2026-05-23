import { Link } from "react-router-dom";
import styles from "./style.module.css";

// Items can be plain strings (placeholder, no destination) or {label, to}
// objects (real internal route).
export type LinkColumnItem = string | { label: string; to: string };

export function LinkColumn({
    title,
    items,
}: {
    title: string;
    items: LinkColumnItem[];
}) {
    return (
        <div>
            <div className={styles.colTitle}>{title}</div>
            <ul className={styles.colList}>
                {items.map((item) => {
                    const label = typeof item === "string" ? item : item.label;
                    const to = typeof item === "string" ? null : item.to;
                    return (
                        <li key={label}>
                            {to ? (
                                <Link to={to} className={styles.colLink}>
                                    {label}
                                </Link>
                            ) : (
                                <a className={styles.colLink}>{label}</a>
                            )}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
