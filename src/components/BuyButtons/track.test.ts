import Clarity from "@microsoft/clarity";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ENV } from "../../env";
import { PRODUCTS } from "../../data/catalog";
import { trackBuyClick } from "./track";

vi.mock("@microsoft/clarity", () => ({
    default: { setTag: vi.fn(), event: vi.fn() },
}));
vi.mock("../../env", () => ({ ENV: { clarityProjectId: "" } }));

const env = ENV as { clarityProjectId: string };

afterEach(() => {
    vi.clearAllMocks();
    env.clarityProjectId = "";
});

describe("trackBuyClick", () => {
    it("is a no-op when analytics is off", () => {
        trackBuyClick("flipkart", "PNT_BK");
        expect(Clarity.event).not.toHaveBeenCalled();
        expect(Clarity.setTag).not.toHaveBeenCalled();
    });

    it("tags store, SKU and product code, then fires buy_click", () => {
        env.clarityProjectId = "abc123";
        const product = PRODUCTS[0];
        trackBuyClick("flipkart", product.variants[0].sku);
        expect(Clarity.setTag).toHaveBeenCalledWith("store", "flipkart");
        expect(Clarity.setTag).toHaveBeenCalledWith(
            "sku",
            product.variants[0].sku
        );
        expect(Clarity.setTag).toHaveBeenCalledWith("product", product.code);
        expect(Clarity.event).toHaveBeenCalledWith("buy_click");
    });

    it("never throws, even if Clarity does", () => {
        env.clarityProjectId = "abc123";
        vi.mocked(Clarity.event).mockImplementationOnce(() => {
            throw new Error("blocked by an ad blocker");
        });
        expect(() => trackBuyClick("meesho")).not.toThrow();
    });
});
