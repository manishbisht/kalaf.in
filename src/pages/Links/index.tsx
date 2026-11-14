import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Icon, type IconName } from "../../components/Icons";
import {
    BRAND,
    ROUTES,
    SOCIAL,
    collectionPath,
    whatsappHref,
} from "../../constants";
import { PRODUCTS } from "../../data/catalog";
import { BUSINESS } from "../../data/business";
import { trackClicks, trackLinksClick } from "../../analytics";
import styles from "./style.module.css";

// The link-in-bio page for Instagram and Facebook: big, thumb-sized buttons
// to the places people actually go from a bio link. Every target comes from
// the catalog or constants; a button whose target is missing isn't shown.

const PANT = PRODUCTS.find((p) => p.code === "PNT");
const PANT_FLIPKART = PANT?.variants.find((v) => v.links.flipkart)?.links
    .flipkart;

// "https://www.instagram.com/kalaf.india" → "@kalaf.india"
const INSTAGRAM_HANDLE = `@${SOCIAL.instagram.split("/").filter(Boolean).pop()}`;

type Item = {
    // Tagged on the links_click event.
    target: string;
    label: string;
    sub?: string;
} & ({ to: string } | { href: string });

const ITEMS: Item[] = [
    ...(PANT_FLIPKART
        ? [
              {
                  target: "pants_flipkart",
                  label: "Shop pants on Flipkart",
                  sub: PANT?.title,
                  href: PANT_FLIPKART,
              },
          ]
        : []),
    {
        target: "dupattas",
        label: "Shop dupattas",
        sub: "Bandhani & leheriya",
        to: collectionPath("dupattas"),
    },
    { target: "products", label: "All products", to: ROUTES.products },
    ...(BRAND.whatsapp
        ? [
              {
                  target: "whatsapp",
                  label: "Chat on WhatsApp",
                  sub: BRAND.whatsapp,
                  href: whatsappHref(BRAND.whatsapp),
              },
          ]
        : []),
    {
        target: "instagram",
        label: "Instagram",
        sub: INSTAGRAM_HANDLE,
        href: SOCIAL.instagram,
    },
];

export default function Links() {
    return (
        <main className={styles.page}>
            <div className={styles.inner}>
                <header className={styles.head}>
                    <div className={styles.devanagari} aria-hidden="true">
                        {BRAND.devanagari}
                    </div>
                    <h1 className={styles.wordmark}>{BRAND.wordmark}</h1>
                    <p className={styles.tagline}>
                        Cotton trousers and bandhani &amp; leheriya dupattas,
                        made in {BUSINESS.address.city}.
                    </p>
                </header>

                <ul className={styles.list}>
                    {ITEMS.map((item, i) => (
                        <li key={item.target}>
                            <ItemLink item={item} primary={i === 0}>
                                <span className={styles.text}>
                                    <span className={styles.label}>
                                        {item.label}
                                    </span>
                                    {item.sub && (
                                        <span className={styles.sub}>
                                            {item.sub}
                                        </span>
                                    )}
                                </span>
                            </ItemLink>
                        </li>
                    ))}
                </ul>

                <a
                    href={`mailto:${BRAND.email}`}
                    className={styles.email}
                    {...trackClicks(() => trackLinksClick("email"))}
                >
                    {BRAND.email}
                </a>
            </div>
        </main>
    );
}

function ItemLink({
    item,
    primary,
    children,
}: {
    item: Item;
    primary: boolean;
    children: ReactNode;
}) {
    const className = `btn ${primary ? "btn-primary" : "btn-secondary"} ${styles.button}`;
    const track = trackClicks(() => trackLinksClick(item.target));
    const icon: IconName = "to" in item ? "arrowRight" : "arrowUpRight";
    const content = (
        <>
            {children}
            <Icon name={icon} size={18} />
        </>
    );
    if ("to" in item) {
        return (
            <Link to={item.to} className={className} {...track}>
                {content}
            </Link>
        );
    }
    return (
        <a
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className={className}
            {...track}
        >
            {content}
        </a>
    );
}
