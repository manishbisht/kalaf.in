import { PRODUCTS } from "../../data/catalog";

// The home page features the pant. Data comes from the generated catalog.
export const PANT = PRODUCTS.find((p) => p.code === "PNT")!;
