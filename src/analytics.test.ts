import Clarity from "@microsoft/clarity";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ENV } from "./env";
import { PRODUCTS } from "./data/catalog";
import {
    trackAskAIClick,
    trackBuyClick,
    trackClicks,
    trackEvent,
    trackLinksClick,
    trackWhatsAppClick,
} from "./analytics";

vi.mock("@microsoft/clarity", () => ({
    default: { setTag: vi.fn(), event: vi.fn() },
}));
vi.mock("./env", () => ({ ENV: { clarityProjectId: "" } }));

const env = ENV as { clarityProjectId: string };

afterEach(() => {
    vi.clearAllMocks();
    env.clarityProjectId = "";
});

describe("trackEvent", () => {
    it("is a no-op when analytics is off", () => {
        trackEvent("x", { a: "1" });
        trackBuyClick("flipkart", "PNT_BK");
        trackWhatsAppClick("/");
        expect(Clarity.event).not.toHaveBeenCalled();
        expect(Clarity.setTag).not.toHaveBeenCalled();
    });

    it("never throws, even if Clarity does", () => {
        env.clarityProjectId = "abc123";
        vi.mocked(Clarity.event).mockImplementationOnce(() => {
            throw new Error("blocked by an ad blocker");
        });
        expect(() => trackBuyClick("meesho")).not.toThrow();
    });
});

describe("trackBuyClick", () => {
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

    it("clears the SKU and product tags when it has no SKU", () => {
        env.clarityProjectId = "abc123";
        trackBuyClick("meesho");
        expect(Clarity.setTag).toHaveBeenCalledWith("sku", "");
        expect(Clarity.setTag).toHaveBeenCalledWith("product", "");
    });
});

describe("contact click events", () => {
    it.each([
        [
            "whatsapp_click",
            "page",
            "DUA_BK",
            () => trackWhatsAppClick("DUA_BK"),
        ],
        [
            "ask_ai_click",
            "assistant",
            "Claude",
            () => trackAskAIClick("Claude"),
        ],
        [
            "links_click",
            "target",
            "instagram",
            () => trackLinksClick("instagram"),
        ],
    ])("fires %s tagged with %s", (event, tag, value, fire) => {
        env.clarityProjectId = "abc123";
        fire();
        expect(Clarity.setTag).toHaveBeenCalledWith(tag, value);
        expect(Clarity.event).toHaveBeenCalledWith(event);
    });
});

describe("trackClicks", () => {
    it("tracks left and middle clicks, not right-clicks", () => {
        const track = vi.fn();
        const props = trackClicks(track);
        props.onClick();
        props.onAuxClick({ button: 1 });
        props.onAuxClick({ button: 2 });
        expect(track).toHaveBeenCalledTimes(2);
    });
});
