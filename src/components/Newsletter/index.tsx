import { Icon } from "../Icons";
import { SOCIAL } from "../../constants";
import styles from "./style.module.css";

// There's no mailing list (no backend), so this points people to the social
// accounts where new pieces are posted.
const CHANNELS = [
    { label: "Instagram", href: SOCIAL.instagram, icon: "instagram" },
    { label: "Facebook", href: SOCIAL.facebook, icon: "facebook" },
] as const;

export function Newsletter() {
    return (
        <section className={styles.section} id="updates">
            <div className={`container ${styles.inner}`}>
                <div className={styles.eyebrow}>
                    Follow along · Notes from Jaipur
                </div>

                <h2 className={styles.headline}>
                    See what&apos;s next
                    <br />
                    from Jaipur.
                </h2>

                <p className={styles.sub}>
                    We post new colours and pieces on Instagram and Facebook,
                    with a link to where you can buy them.
                </p>

                <div className={styles.links}>
                    {CHANNELS.map((c) => (
                        <a
                            key={c.label}
                            href={c.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.link}
                        >
                            <Icon name={c.icon} size={16} />
                            {c.label}
                            <Icon name="arrowUpRight" size={14} />
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}
