import { useState } from "react";
import { COLOURWAYS } from "./colourways";
import { Showcase } from "./Showcase";
import { MetaStrip } from "./MetaStrip";
import styles from "./style.module.css";

export function Drop() {
    const [activeId, setActiveId] = useState("sand");
    const active = COLOURWAYS.find((c) => c.id === activeId)!;

    return (
        <section className={styles.section} id="drop">
            <div className="container">
                <div className="section-head">
                    <div>
                        <div className={styles.eyebrowRow}>
                            <span className={styles.eyebrowText}>
                                Drop 01 — the first piece
                            </span>
                            <span className={styles.devanagari}>— पहला</span>
                        </div>
                        <h2>
                            One pant.
                            <br />
                            Five colours.
                        </h2>
                    </div>
                    <div className="right">
                        We started with the pant we&apos;d want to wear every
                        day. Cotton-linen, relaxed easy fit,
                        elastic-and-drawcord waist. Cut and finished in Jaipur —
                        five honest colours, nothing else.
                    </div>
                </div>

                <Showcase active={active} onPick={setActiveId} />

                <MetaStrip />
            </div>
        </section>
    );
}
