import { ProcessStep, type ProcessItem } from "./ProcessStep";
import styles from "./style.module.css";

const PROCESS: ProcessItem[] = [
    {
        img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1000&q=80",
        step: "01",
        label: "The cloth",
        body: "Long-staple cotton from Gujarat. Linen from Erode. Sourced before it's spun.",
    },
    {
        img: "https://images.unsplash.com/photo-1604176354204-9268737828e4?auto=format&fit=crop&w=1000&q=80",
        step: "02",
        label: "The loom",
        body: "Woven on power looms in Bagru, ten minutes from where we sit. We know the looms by serial number.",
    },
    {
        img: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80",
        step: "03",
        label: "The cut",
        body: "Pattern-blocked in our workshop in Sanganer. Three master tailors. Two assistants. One sample run.",
    },
    {
        img: "https://images.unsplash.com/photo-1542060748-10c28b62716f?auto=format&fit=crop&w=1000&q=80",
        step: "04",
        label: "The finish",
        body: "Single garment-wash, line-dry, hand-press. Then a six-point review before it leaves the workshop.",
    },
];

export function Process() {
    return (
        <section className={styles.section} id="process">
            <div className="container">
                <div className="section-head">
                    <div>
                        <div className={styles.eyebrowRow}>
                            <span className={styles.eyebrowText}>
                                The making
                            </span>
                            <span className={styles.devanagari}>— कलफ</span>
                        </div>
                        <h2>
                            From the loom
                            <br />
                            to the shoulder.
                        </h2>
                    </div>
                    <div className="right">
                        Every Kalaf piece is sourced, woven, cut, and finished
                        within 25 km of our office in Jaipur. Four steps. Four
                        people we know by name.
                    </div>
                </div>

                <div className={styles.grid}>
                    {PROCESS.map((p) => (
                        <ProcessStep key={p.step} item={p} />
                    ))}
                </div>
            </div>
        </section>
    );
}
