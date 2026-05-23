import { COLOURWAYS, type Colourway } from "./colourways";
import styles from "./style.module.css";

export function Swatches({
    active,
    onPick,
}: {
    active: Colourway;
    onPick: (id: string) => void;
}) {
    return (
        <div className={styles.swatches}>
            {COLOURWAYS.map((cw) => (
                <button
                    key={cw.id}
                    onClick={() => onPick(cw.id)}
                    title={cw.name}
                    style={{
                        width: 26,
                        height: 26,
                        padding: 0,
                        borderRadius: "50%",
                        background: cw.swatch,
                        border:
                            cw.id === active.id
                                ? "2px solid var(--ink)"
                                : "1px solid var(--line)",
                        outline:
                            cw.id === active.id
                                ? "2px solid var(--off-white)"
                                : "none",
                        outlineOffset: -4,
                        cursor: "pointer",
                        transition: "transform 200ms var(--ease)",
                    }}
                />
            ))}
            <span className={styles.swatchCode}>{active.code}</span>
        </div>
    );
}
