import type { Dupatta, DupattaColour } from "./products";
import styles from "./style.module.css";

const GOLD = "#c9a24a";

// Drawn stand-in for a product photo: the dupatta's base colour(s) with its
// print (bandhani dots or leheriya waves) and, where it has one, a gota border.
export function PatternTile({
    dupatta,
    colour,
}: {
    dupatta: Dupatta;
    colour: DupattaColour;
}) {
    const id = `${dupatta.id}-${colour.sku}`;
    const bandWidth = 300 / colour.hex.length;

    return (
        <svg
            className={styles.tile}
            viewBox="0 0 300 400"
            preserveAspectRatio="xMidYMid slice"
            role="img"
            aria-label={`${dupatta.name} — ${colour.name}`}
        >
            <defs>
                <pattern
                    id={`dots-${id}`}
                    width="18"
                    height="18"
                    patternUnits="userSpaceOnUse"
                >
                    <circle cx="4.5" cy="4.5" r="2" fill="#fff" opacity="0.8" />
                    <circle
                        cx="13.5"
                        cy="13.5"
                        r="2"
                        fill="#fff"
                        opacity="0.8"
                    />
                </pattern>
                <pattern
                    id={`waves-${id}`}
                    width="40"
                    height="16"
                    patternUnits="userSpaceOnUse"
                    patternTransform="rotate(-35)"
                >
                    <path
                        d="M0 8 Q10 2 20 8 T40 8"
                        fill="none"
                        stroke="#fff"
                        strokeWidth="2.5"
                        opacity="0.55"
                    />
                </pattern>
            </defs>

            {colour.hex.map((hex, i) => (
                <rect
                    key={hex + i}
                    x={i * bandWidth}
                    y="0"
                    width={bandWidth + 1}
                    height="400"
                    fill={hex}
                />
            ))}
            <rect
                width="300"
                height="400"
                fill={`url(#${dupatta.pattern === "bandhani" ? "dots" : "waves"}-${id})`}
            />
            {dupatta.gota && (
                <g>
                    <rect y="374" width="300" height="26" fill={GOLD} />
                    <rect
                        y="380"
                        width="300"
                        height="2"
                        fill="#fff"
                        opacity="0.5"
                    />
                    <rect
                        y="392"
                        width="300"
                        height="2"
                        fill="#fff"
                        opacity="0.5"
                    />
                </g>
            )}
        </svg>
    );
}
