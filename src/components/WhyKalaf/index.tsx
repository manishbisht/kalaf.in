import { FeatureCard, type Feature } from "./FeatureCard";
import styles from "./style.module.css";

const FEATURES: Feature[] = [
    {
        num: "01",
        title: "Premium fabric",
        body: "280–320 GSM combed cotton, ring-spun, garment-washed for the right weight on the shoulder.",
    },
    {
        num: "02",
        title: "Tailored fit",
        body: "Pattern-blocked for a clean line. No accidental volume, no excess length. The cut is the design.",
    },
    {
        num: "03",
        title: "Minimal design",
        body: "No logos on the chest, no slogans. The cloth, the cut, the colour. Nothing else asks for attention.",
    },
    {
        num: "04",
        title: "Everyday comfort",
        body: "Tested to be worn twice a week for a year. Soft from the first wash. Holds shape through the hundredth.",
    },
    {
        num: "05",
        title: "Small batches",
        body: "We work in small runs from the Jaipur workshop. When a batch sells out on Amazon, Flipkart, or Myntra, we make the next one — never warehouses of unsold stock.",
    },
    {
        num: "06",
        title: "Sustainable mindset",
        body: "Workshops within a 200 km radius. No air freight. Offcuts re-spun into the next season's linings.",
    },
];

export function WhyKalaf() {
    return (
        <section className={styles.section}>
            <div className="container">
                <div
                    className="section-head"
                    style={{ alignItems: "flex-end" }}
                >
                    <div>
                        <div
                            className="eyebrow"
                            style={{ color: "var(--smoke)" }}
                        >
                            Why Kalaf
                        </div>
                        <h2 style={{ color: "var(--off-white)" }}>
                            Six promises.
                            <br />
                            <span style={{ color: "var(--smoke)" }}>
                                No exceptions.
                            </span>
                        </h2>
                    </div>
                    <div className="right" style={{ color: "var(--smoke)" }}>
                        Every garment that leaves the workshop passes a
                        six-point review against the standards below.
                    </div>
                </div>

                <div className={styles.grid}>
                    {FEATURES.map((f) => (
                        <FeatureCard key={f.num} item={f} />
                    ))}
                </div>
            </div>
        </section>
    );
}
