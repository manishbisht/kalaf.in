// Public business details. business.json is generated from the products.kalaf.in
// repo's business.json by scripts/sync-catalog.py — don't edit it by hand.

import raw from "./business.json";

export type Business = {
    legal_name: string;
    trade_name: string;
    constitution: string;
    gstin: string;
    address: {
        line1: string;
        line2: string;
        city: string;
        state: string;
        pincode: string;
        country: string;
    };
    email: string;
    phone: string | null;
};

export const BUSINESS = raw as Business;

export const BUSINESS_ADDRESS = [
    BUSINESS.address.line1,
    BUSINESS.address.line2,
    `${BUSINESS.address.city}, ${BUSINESS.address.state} ${BUSINESS.address.pincode}`,
].join(", ");
