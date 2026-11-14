import { FeatureCard, type Feature } from "./FeatureCard";
import styles from "./style.module.css";

const FEATURES: Feature[] = [
    {
        num: "01",
        title: "100% cotton",
        body: "The pant is pure cotton: breathable, soft, and cool enough for a Jaipur summer.",
    },
    {
        num: "02",
        title: "An easy fit",
        body: "Elastic all the way round the waist, with a front button and zip fly. A relaxed, wide straight leg that drapes cleanly.",
    },
    {
        num: "03",
        title: "Rajasthani craft",
        body: "Bandhani and leheriya are the tie-dye traditions of Rajasthan. Our dupattas carry them, some finished with a gota border.",
    },
    {
        num: "04",
        title: "Made in Jaipur",
        body: "Every piece is made and packed by us in Jaipur, and dispatched from here.",
    },
    {
        num: "05",
        title: "Small batches",
        body: "We make in small runs, so colours come and go. When one sells out, it may come back in the next batch.",
    },
    {
        num: "06",
        title: "Buy where you shop",
        body: "No new account to make. Buy on Flipkart, or on Meesho for dupattas, with that marketplace's delivery and returns.",
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
                            Simple things,
                            <br />
                            <span style={{ color: "var(--smoke)" }}>
                                done properly.
                            </span>
                        </h2>
                    </div>
                    <div className="right" style={{ color: "var(--smoke)" }}>
                        A small label from Jaipur. Here&apos;s what you can
                        count on.
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
