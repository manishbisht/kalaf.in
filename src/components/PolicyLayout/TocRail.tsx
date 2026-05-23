import { useState, useEffect } from "react";
import { Icon } from "../Icons";
import { BRAND } from "../../constants";
import type { PolicySection } from "./types";
import styles from "./style.module.css";

// Sticky left rail with scroll-spy. Owns its own `activeSection` state because
// no other component needs to know which section is in view.
export function TocRail({ sections }: { sections: PolicySection[] }) {
    const [activeSection, setActiveSection] = useState<string | undefined>(
        sections[0]?.id
    );

    useEffect(() => {
        const handler = () => {
            const positions = sections.map((s) => {
                const el = document.getElementById(`sec-${s.id}`);
                if (!el) return { id: s.id, top: Infinity };
                return { id: s.id, top: el.getBoundingClientRect().top };
            });
            const above =
                positions.filter((x) => x.top < 220).pop() ?? positions[0];
            if (above) setActiveSection(above.id);
        };
        window.addEventListener("scroll", handler, { passive: true });
        handler();
        return () => window.removeEventListener("scroll", handler);
    }, [sections]);

    return (
        <aside className={styles.leftRail}>
            <div className={`t-eyebrow ${styles.tocLabel}`}>On this page</div>
            <ol className={styles.tocList}>
                {sections.map((s, i) => {
                    const active = activeSection === s.id;
                    return (
                        <li key={s.id}>
                            <a
                                href={`#sec-${s.id}`}
                                className={`${styles.tocLink} ${i === 0 ? styles.tocLinkFirst : styles.tocLinkRest}`}
                            >
                                <span
                                    className={`${styles.tocNum} ${active ? styles.tocNumActive : ""}`}
                                >
                                    {String(i + 1).padStart(2, "0")}
                                </span>
                                <span
                                    className={`${styles.tocTitle} ${active ? styles.tocTitleActive : ""}`}
                                >
                                    {s.title}
                                    {active && (
                                        <span className={styles.tocDot} />
                                    )}
                                </span>
                            </a>
                        </li>
                    );
                })}
            </ol>

            <div className={styles.contactCard}>
                <div className={`t-eyebrow ${styles.contactCardLabel}`}>
                    Still wondering?
                </div>
                <div className={styles.contactCardTitle}>
                    Write to a human.
                </div>
                <a
                    href={`mailto:${BRAND.email}`}
                    className={styles.contactLink}
                >
                    {BRAND.email} <Icon name="arrowUpRight" size={12} />
                </a>
            </div>
        </aside>
    );
}
