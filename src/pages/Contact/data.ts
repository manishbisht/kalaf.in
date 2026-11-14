import type { PolicyData } from "../../components/PolicyLayout";
import { BRAND, telHref, whatsappHref } from "../../constants";

const PHONE = BRAND.phone;
const WHATSAPP = BRAND.whatsapp ?? BRAND.phone;

const CHANNELS = [
    { label: "Email", href: `mailto:${BRAND.email}`, sub: BRAND.email },
    ...(WHATSAPP
        ? [
              {
                  label: "WhatsApp",
                  href: whatsappHref(WHATSAPP),
                  sub: WHATSAPP,
              },
          ]
        : []),
    ...(PHONE ? [{ label: "Call", href: telHref(PHONE), sub: PHONE }] : []),
];

// "WhatsApp or call", depending on which numbers exist.
const QUICK = [WHATSAPP && "WhatsApp", PHONE && "call"]
    .filter(Boolean)
    .join(" or ");

export const data: PolicyData = {
    eyebrow: "Support",
    title: "Contact us",
    ornament: "संपर्क",
    summary: `We're a small team in Jaipur. Email us${QUICK ? `, or ${QUICK} us during working hours` : ""}. A real person reads and answers every message.`,
    updated: "14 Nov 2026",
    readTime: "2 min read",
    crossLinksHeader: "More guides",
    promises: [
        {
            kicker: "1 day",
            label: "Reply time",
            body: "We aim to reply within one working day, Monday to Saturday.",
        },
        {
            kicker: "Human",
            label: "Support",
            body: "Every reply comes from someone on the team, not a bot.",
        },
        {
            kicker: "Jaipur",
            label: "Based in",
            body: `Our working hours are ${BRAND.workingHours}.`,
        },
    ],
    sections: [
        {
            id: "write",
            title: "Reach us",
            body: [
                {
                    kind: "p",
                    text: QUICK
                        ? `For a quick question, ${QUICK} us during working hours. For anything that needs a photo or an order ID, email is best, so we have everything in one place.`
                        : "Email is the best way to reach us, especially for anything that needs a photo or an order ID.",
                },
                { kind: "links", items: CHANNELS },
            ],
            callout: { label: "Working hours", value: BRAND.workingHours },
        },
        {
            id: "include",
            title: "What to include",
            body: [
                {
                    kind: "p",
                    text: "If it's about an order, tell us where you bought it and paste the order ID. That's the fastest way to a useful reply.",
                },
                {
                    kind: "list",
                    items: [
                        "The marketplace (Flipkart or Meesho).",
                        "The order ID, copied from your orders on the marketplace.",
                        "What you need, with a photo if something's wrong.",
                    ],
                },
            ],
        },
        {
            id: "returns",
            title: "Returns & exchanges",
            body: [
                {
                    kind: "p",
                    text: "Returns and exchanges are handled by the marketplace you bought from. Start from your orders on Flipkart or Meesho; the Shipping & returns page explains how. If you've tried there and hit a wall, write to us and we'll follow it up.",
                },
            ],
        },
        {
            id: "grievances",
            title: "Grievances",
            body: [
                {
                    kind: "p",
                    text: `To raise a complaint or grievance, email ${BRAND.email} with "Grievance" in the subject line. We acknowledge every grievance within 48 hours and work to resolve it within one month.`,
                },
                {
                    kind: "list",
                    items: [
                        `Legal name — ${BRAND.legalName} (${BRAND.constitution.toLowerCase()})`,
                        `GSTIN — ${BRAND.gstin}`,
                        `Address — ${BRAND.address}`,
                        `Email — ${BRAND.email}`,
                        ...(PHONE ? [`Phone — ${PHONE}`] : []),
                    ],
                },
            ],
            callout: {
                label: "Grievances",
                value: `${BRAND.email} — acknowledged within 48 hours.`,
            },
        },
    ],
};
