import { Link } from "react-router-dom";
import styles from "./style.module.css";

// `to` is an internal route (<Link>); `href` is a mailto:, tel: or external
// URL. External http(s) links open in a new tab.
export type LinkColumnItem =
    | { label: string; to: string }
    | { label: string; href: string };

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
                {items.map((item) => (
                    <li key={item.label}>
                        {"to" in item ? (
                            <Link to={item.to} className={styles.colLink}>
                                {item.label}
                            </Link>
                        ) : item.href.startsWith("http") ? (
                            <a
                                href={item.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.colLink}
                            >
                                {item.label}
                            </a>
                        ) : (
                            <a href={item.href} className={styles.colLink}>
                                {item.label}
                            </a>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}
