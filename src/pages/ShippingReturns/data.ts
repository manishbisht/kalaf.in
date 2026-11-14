import type { PolicyData } from "../../components/PolicyLayout";
import { BRAND, MARKETPLACE_ORDERS } from "../../constants";
import { PRODUCTS } from "../../data/catalog";

// Working days from order to dispatch, from the products repo.
const dispatch = (collection: string) =>
    Math.max(
        0,
        ...PRODUCTS.filter((p) => p.collection === collection).map(
            (p) => p.dispatchDays ?? 0
        )
    );
const PANT_DAYS = dispatch("pants");
const DUPATTA_DAYS = dispatch("dupattas");

export const data: PolicyData = {
    eyebrow: "Policy 02",
    title: "Shipping & returns",
    ornament: "नियम",
    summary:
        "Our pant is sold on Flipkart, and our dupattas on Flipkart and Meesho. We pack and dispatch from Jaipur; the marketplace delivers and handles returns under its own policy.",
    updated: "14 Nov 2026",
    readTime: "2 min read",
    promises: [
        {
            kicker: `${PANT_DAYS}–${DUPATTA_DAYS} days`,
            label: "Dispatch from Jaipur",
            body: `We hand your order to the courier within ${PANT_DAYS} working days for the pant and ${DUPATTA_DAYS} for dupattas.`,
        },
        {
            kicker: "Theirs",
            label: "Their courier, their dates",
            body: "Delivery dates, tracking and pickup are run by the marketplace you bought from.",
        },
        {
            kicker: "Their policy",
            label: "Returns",
            body: "Return windows and pickup follow the marketplace's policy, shown on your order page.",
        },
    ],
    sections: [
        {
            id: "ship",
            title: "Shipping",
            body: [
                {
                    kind: "p",
                    text: "Once you order on Flipkart or Meesho, we pack it in Jaipur and hand it to the marketplace's courier. From there, the marketplace handles delivery and tracking.",
                },
                {
                    kind: "list",
                    items: [
                        `Pant: dispatched within ${PANT_DAYS} working days of your order.`,
                        `Dupattas: dispatched within ${DUPATTA_DAYS} working days of your order.`,
                        "The expected delivery date is shown by the marketplace when you order, and on your order page.",
                        "Tracking is on the marketplace's order page. We don't send separate emails.",
                    ],
                },
            ],
            callout: {
                label: "Track an order",
                value: "Open your orders on the marketplace you bought from.",
            },
        },
        {
            id: "returns",
            title: "Returns",
            body: [
                {
                    kind: "p",
                    text: "Each marketplace sets its own return window, pickup and inspection process. Start a return from your orders on the marketplace where you bought the item.",
                },
                {
                    kind: "links",
                    items: [
                        {
                            label: "Flipkart",
                            href: MARKETPLACE_ORDERS.flipkart,
                            sub: "My Orders · pants & dupattas",
                        },
                        {
                            label: "Meesho",
                            href: MARKETPLACE_ORDERS.meesho,
                            sub: "My Orders · dupattas",
                        },
                    ],
                },
                {
                    kind: "p",
                    text: "The exact window for your item is on the order page. Check it before you send anything back.",
                },
            ],
            steps: [
                "Open your orders on the marketplace and pick the Kalaf item.",
                "Choose Return and a reason. The marketplace arranges pickup if it offers one.",
                "Pack the item unused, with its tags, in its original packaging if you can.",
                "The refund follows once the marketplace accepts the return.",
            ],
        },
        {
            id: "exchange",
            title: "Exchanges",
            body: [
                {
                    kind: "p",
                    text: "Whether you can exchange a pant for another size depends on the marketplace. If it offers an exchange on your order page, you can use it; if not, return the item and place a new order.",
                },
            ],
        },
        {
            id: "noreturn",
            title: "What can't be returned",
            body: [
                {
                    kind: "list",
                    items: [
                        "Anything used, washed, or with its tags removed.",
                        "Items sent back after the marketplace's return window has closed.",
                        "Anything the marketplace lists as non-returnable for your order.",
                    ],
                },
            ],
        },
        {
            id: "damaged",
            title: "If something arrives damaged",
            body: [
                {
                    kind: "p",
                    text: "Report it on the marketplace first, as soon as you can. They own the courier relationship, and they often have a short window for damage claims.",
                },
                {
                    kind: "p",
                    text: `If you can't get it sorted there, email ${BRAND.email} with the order ID, the marketplace and a photo. We'll follow it up on your behalf.`,
                },
            ],
            callout: { label: "Write to", value: BRAND.email },
        },
    ],
};
