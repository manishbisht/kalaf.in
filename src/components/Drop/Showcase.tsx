import { Icon } from "../Icons";
import { Swatches } from "./Swatches";
import { imageFilter, type Colourway } from "./colourways";
import styles from "./style.module.css";

export function Showcase({
    active,
    onPick,
}: {
    active: Colourway;
    onPick: (id: string) => void;
}) {
    return (
        <div className={styles.showcase}>
            <a href="#" className={styles.heroImage}>
                <img src="/pant-colourways.png" alt="Five colourways" />
                <div className={styles.chipWrap}>
                    <span className="chip">DROP 01 — 01 OF 01</span>
                </div>
            </a>

            <div className={styles.rightCol}>
                <a href="#" className={styles.variantImage}>
                    <img
                        src={
                            active.id === "sand"
                                ? "/pant-front.png"
                                : "/pant-front-2.png"
                        }
                        alt={`The Everyday Pant — ${active.name}`}
                        style={{
                            filter: imageFilter(active.id),
                            mixBlendMode: "multiply",
                        }}
                    />
                </a>

                <div className={styles.info}>
                    <div className={styles.titleRow}>
                        <h3 className={styles.productTitle}>
                            The Everyday Pant
                        </h3>
                        <div className={styles.price}>₹ 2,990</div>
                    </div>
                    <div className={styles.variant}>
                        Cotton-linen · Relaxed easy fit · {active.name}
                    </div>

                    <Swatches active={active} onPick={onPick} />

                    <div className={styles.ctaRow}>
                        <a href="#" className="btn btn-primary">
                            See the pant <Icon name="arrowRight" size={16} />
                        </a>
                        <a href="#" className="btn btn-secondary">
                            Size guide
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
