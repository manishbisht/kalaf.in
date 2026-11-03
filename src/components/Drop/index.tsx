import { useState } from "react";
import { COLOURWAYS, DEFAULT_COLOURWAY } from "./product";
import { Showcase } from "./Showcase";
import { MetaStrip } from "./MetaStrip";
import styles from "./style.module.css";

export function Drop() {
    const [activeId, setActiveId] = useState(DEFAULT_COLOURWAY.id);
    const active =
        COLOURWAYS.find((c) => c.id === activeId) ?? DEFAULT_COLOURWAY;

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
                            Three colours.
                        </h2>
                    </div>
                    <div className="right">
                        Breathable cotton-linen that stays cool in the heat.
                        Elastic waistband all the way round, with a front button
                        and zip fly for a clean, tailored look. A relaxed wide
                        straight leg for work, travel and weekends. Made in
                        Jaipur — white, beige and black.
                    </div>
                </div>

                <Showcase active={active} onPick={setActiveId} />

                <MetaStrip />
            </div>
        </section>
    );
}
