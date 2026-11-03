import { swatchColours } from "../../data/catalog";
import styles from "./style.module.css";

// Round colour dot. Multicolour codes render as side-by-side segments.
export function Swatch({ code, size = 24 }: { code: string; size?: number }) {
    return (
        <span
            className={styles.swatch}
            style={{ width: size, height: size }}
            aria-hidden="true"
        >
            {swatchColours(code).map((hex, i) => (
                <span key={hex + i} style={{ background: hex }} />
            ))}
        </span>
    );
}
