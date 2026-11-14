import { describe, expect, it } from "vitest";
import { BRAND, ROUTES } from "../../constants";
import { PRODUCTS } from "../../data/catalog";
import { FAQ_ENTRIES, data } from "./data";

const answer = (q: RegExp) => FAQ_ENTRIES.find((e) => q.test(e.q))?.a ?? "";
const pant = PRODUCTS.find((p) => p.code === "PNT")!;
const dupattas = PRODUCTS.filter((p) => p.collection === "dupattas");

describe("FAQ answers", () => {
    it("are filled in from the catalog and BRAND, never blank or broken", () => {
        expect(FAQ_ENTRIES.length).toBeGreaterThanOrEqual(10);
        for (const { q, a } of FAQ_ENTRIES) {
            expect(q, q).toMatch(/\?$/);
            expect(a.length, q).toBeGreaterThan(20);
            expect(a, q).not.toMatch(/undefined|null|NaN|\$\{/);
            expect(a, q).not.toMatch(/Amazon/i);
        }
    });

    it("state the pant's sizes, fabric and dispatch time from the catalog", () => {
        for (const s of pant.sizes) {
            expect(answer(/sizes/)).toContain(s);
        }
        expect(answer(/made of/)).toContain(pant.fabric!);
        expect(answer(/ship/)).toContain(`${pant.dispatchDays} working`);
    });

    it("state the dupatta size and every dupatta's fabric", () => {
        expect(answer(/dupattas/)).toContain(dupattas[0].size!);
        for (const d of dupattas) {
            expect(answer(/made of/)).toContain(d.title);
        }
    });

    it("name the stores each collection is sold on, and how to reach us", () => {
        expect(answer(/Where can I buy/)).toMatch(/pant is sold on Flipkart/);
        expect(answer(/Where can I buy/)).toMatch(
            /dupattas on Flipkart or Meesho/
        );
        expect(answer(/contact/)).toContain(BRAND.email);
        expect(answer(/based/)).toContain(BRAND.legalName);
    });

    it("link the guides with internal routes", () => {
        const hrefs = data.sections.flatMap((s) =>
            s.body.flatMap((b) =>
                b.kind === "qa" ? (b.links ?? []).map((l) => l.href) : []
            )
        );
        for (const route of [
            ROUTES.sizeGuide,
            ROUTES.careGuide,
            ROUTES.shippingReturns,
            ROUTES.refundPolicy,
            ROUTES.trackOrder,
        ]) {
            expect(hrefs).toContain(route);
        }
    });
});
