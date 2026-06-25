import { Icon } from "../Icons";
import styles from "./style.module.css";

export type Look = { src: string; label: string };

export function LookFrame({ item }: { item: Look }) {
    return (
        <a className={styles.frame}>
            <img
                src={item.src}
                alt={item.label}
                loading="lazy"
                decoding="async"
            />
            <div className={styles.frameLabel}>
                <span>{item.label}</span>
                <Icon name="arrowUpRight" size={18} />
            </div>
        </a>
    );
}
