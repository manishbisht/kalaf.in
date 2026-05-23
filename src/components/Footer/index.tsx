import { Link } from "react-router-dom";
import { BRAND, ROUTES } from "../../constants";
import { LinkColumn } from "./LinkColumn";
import { SocialRow } from "./SocialRow";
import { BuildStamp } from "./BuildStamp";
import styles from "./style.module.css";

export function Footer() {
    return (
        <footer className={styles.footer}>
            <div className="container">
                <div className={styles.wordmarkRow}>
                    <Link to={ROUTES.home} className={styles.wordmark}>
                        {BRAND.wordmark}
                    </Link>
                    <div className={styles.devanagari}>{BRAND.devanagari}</div>
                </div>

                <div className={styles.columns}>
                    <div>
                        <div className={styles.brandColLabel}>
                            Made in Jaipur
                        </div>
                        <p className={styles.brandColBody}>
                            Cloth sourced and finished in Jaipur. Worn
                            everywhere.
                        </p>
                        <SocialRow />
                    </div>

                    <LinkColumn
                        title="Shop"
                        items={[
                            "Oversized tees",
                            "Shirts",
                            "Co-ords",
                            "Essentials",
                            "New drops",
                            "Gift cards",
                        ]}
                    />
                    <LinkColumn
                        title="Brand"
                        items={[
                            "The story",
                            "Journal",
                            "Lookbook",
                            "Press",
                            "Careers",
                        ]}
                    />
                    <LinkColumn
                        title="Help"
                        items={[
                            {
                                label: "Shipping & returns",
                                to: ROUTES.shippingReturns,
                            },
                            { label: "Size guide", to: ROUTES.sizeGuide },
                            { label: "Care guide", to: ROUTES.careGuide },
                            { label: "Track order", to: ROUTES.trackOrder },
                            { label: "Contact us", to: ROUTES.contact },
                        ]}
                    />
                    <LinkColumn
                        title="Policies"
                        items={[
                            { label: "Privacy", to: ROUTES.privacy },
                            { label: "Terms of use", to: ROUTES.terms },
                            { label: "Refund policy", to: ROUTES.refundPolicy },
                            { label: "Cookie policy", to: ROUTES.cookies },
                        ]}
                    />
                </div>

                <div className={styles.bottom}>
                    <div>
                        © {BRAND.copyrightYear} {BRAND.legalName} ·{" "}
                        {BRAND.location} · CIN {BRAND.cin}
                    </div>
                    <div>
                        {BRAND.email} · {BRAND.phone}
                    </div>
                </div>

                <BuildStamp />
            </div>
        </footer>
    );
}
