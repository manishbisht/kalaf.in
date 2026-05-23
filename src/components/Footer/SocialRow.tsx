import { Icon } from "../Icons";
import type { IconName } from "../Icons";
import { SOCIAL } from "../../constants";
import styles from "./style.module.css";

const SOCIAL_LINKS: { icon: IconName; href: string; label: string }[] = [
    { icon: "instagram", href: SOCIAL.instagram, label: "Instagram" },
    { icon: "facebook", href: SOCIAL.facebook, label: "Facebook" },
    { icon: "linkedin", href: SOCIAL.linkedin, label: "LinkedIn" },
    { icon: "x", href: SOCIAL.x, label: "X" },
];

export function SocialRow() {
    return (
        <div className={styles.social}>
            {SOCIAL_LINKS.map((l) => (
                <a
                    key={l.label}
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={l.label}
                >
                    <Icon name={l.icon} size={20} />
                </a>
            ))}
        </div>
    );
}
