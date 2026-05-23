import { ROUTES } from "../../constants";
import type { CrossLink } from "./types";

export const POLICY_CROSS_LINKS: CrossLink[] = [
    { slug: "privacy", num: "01", label: "Privacy policy", to: ROUTES.privacy },
    {
        slug: "returns",
        num: "02",
        label: "Shipping & returns",
        to: ROUTES.shippingReturns,
    },
    { slug: "terms", num: "03", label: "Terms of use", to: ROUTES.terms },
    {
        slug: "refund",
        num: "04",
        label: "Refund policy",
        to: ROUTES.refundPolicy,
    },
    {
        slug: "cookies",
        num: "05",
        label: "Cookie policy",
        to: ROUTES.cookies,
    },
];

export const HELP_CROSS_LINKS: CrossLink[] = [
    {
        slug: "size-guide",
        num: "01",
        label: "Size guide",
        to: ROUTES.sizeGuide,
    },
    {
        slug: "care-guide",
        num: "02",
        label: "Care guide",
        to: ROUTES.careGuide,
    },
    {
        slug: "track-order",
        num: "03",
        label: "Track order",
        to: ROUTES.trackOrder,
    },
    { slug: "contact", num: "04", label: "Contact us", to: ROUTES.contact },
];
