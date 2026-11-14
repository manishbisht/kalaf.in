import { Link } from "react-router-dom";
import {
    BRAND,
    ROUTES,
    collectionPath,
    telHref,
    whatsappHref,
} from "../../constants";
import { LinkColumn, type LinkColumnItem } from "./LinkColumn";
import { SocialRow } from "./SocialRow";
import { BuildStamp } from "./BuildStamp";
import { AskAI } from "../AskAI";
import styles from "./style.module.css";

const CONTACT_ITEMS: LinkColumnItem[] = [
    { label: BRAND.email, href: `mailto:${BRAND.email}` },
    ...(BRAND.whatsapp
        ? [{ label: "WhatsApp", href: whatsappHref(BRAND.whatsapp) }]
        : []),
    ...(BRAND.phone
        ? [{ label: BRAND.phone, href: telHref(BRAND.phone) }]
        : []),
];

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
                            Cotton trousers and Rajasthani bandhani and leheriya
                            dupattas, made in Jaipur. Sold on Flipkart and
                            Meesho.
                        </p>
                        <SocialRow />
                        <div className={styles.askAi}>
                            <AskAI dark />
                        </div>
                    </div>

                    <LinkColumn
                        title="Shop"
                        items={[
                            { label: "All products", to: ROUTES.products },
                            { label: "Pants", to: collectionPath("pants") },
                            {
                                label: "Dupattas",
                                to: collectionPath("dupattas"),
                            },
                        ]}
                    />
                    <LinkColumn title="Get in touch" items={CONTACT_ITEMS} />
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
                            { label: "FAQ", to: ROUTES.faq },
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
                        © {BRAND.copyrightYear} {BRAND.legalName} (
                        {BRAND.constitution.toLowerCase()}) · GSTIN{" "}
                        {BRAND.gstin}
                    </div>
                    <address className={styles.address}>
                        {BRAND.address} ·{" "}
                        <a href={`mailto:${BRAND.email}`}>{BRAND.email}</a>
                    </address>
                </div>

                <BuildStamp />
            </div>
        </footer>
    );
}
