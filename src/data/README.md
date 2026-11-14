# src/data/

Product and business data. Back to the index: [AGENTS.md](../../AGENTS.md).

| File            | Kind          | What it is                                                     |
| --------------- | ------------- | -------------------------------------------------------------- |
| `catalog.json`  | **generated** | Every product and colour: text, prices, links, stock, media.   |
| `business.json` | **generated** | Public business details (legal name, GSTIN, address, contact). |
| `catalog.ts`    | hand-written  | Types and helpers over `catalog.json`.                         |
| `business.ts`   | hand-written  | `Business` type, `BUSINESS`, `BUSINESS_ADDRESS`.               |

**Never edit the JSON files by hand.** They're written by `scripts/sync-catalog.py` from the private products.kalaf.in repo ([scripts/README.md](../../scripts/README.md)). To change a price, link, photo, description or business detail, change the products repo (or the script's `PRODUCTS` dict for website-only fields) and re-sync.

## catalog.ts

Types: `Product` (code, handle, collection, title, description, features, details, care, fabric/pattern/border/fit, `size` for one-size pieces, `sizes`, `sizeChart`, `dispatchDays`, variants), `Variant` (SKU, colour code/name/family, `price` = lowest live price, `prices` per store, `mrp`, images at 600w/1200w, optional video + poster, `links` per store, `sizeLinks`, `stock`), `SizeChart`, `ListingItem`, `Marketplace`, `MarketplaceLinks`, `CollectionHandle` (`"pants" | "dupattas"`).

Exports:

- `PRODUCTS`: all products in display order (pant, then the three dupatta styles).
- `LISTING`: one `{ product, variant }` per colour, what the shop grids show.
- `COLLECTIONS`: title, eyebrow, Devanagari word and intro per collection.
- `findProduct(handle)`: looks up a product, mapping old handles through `OLD_HANDLES` (`cotton-linen-relaxed-trousers` → `cotton-relaxed-trousers`, from when the pant became 100% cotton). Add an entry whenever a handle changes so shared links keep working.
- `MARKETPLACES` (Flipkart, Meesho, Amazon, in button order), `storeName(id)`, and `SOLD_ON`: stores with a live link for at least one piece. A store not in `SOLD_ON` (Amazon today) appears nowhere on the site; adding it back is a products-repo data change, not a code change.
- `isSoldOut(variant)`: only when `stock === 0`; `null` (no count in the products repo) counts as available.
- `shortColour(variant)`: card-sized colour name ("Multicolour Green Yellow Red" → "Green/Yellow/Red").
- `formatRupees(n)` (`₹1,000`, en-IN grouping) and `percentOff(price, mrp)`.
- `swatchColours(code)`: hex colours for a colour code from the `HEX` map (one entry per segment for multicolour codes; unknown codes fall back to sand). **When the products repo adds a colour code, add it to `HEX`.**

## business.ts

`BUSINESS` is `business.json` typed as `Business` (`legal_name`, `trade_name`, `constitution`, `gstin`, `address{line1, line2, city, state, pincode, country}`, `email`, `phone`, `whatsapp`; phone and WhatsApp may be `null`). `BUSINESS_ADDRESS` is the one-line address. App code normally reads these through `BRAND` in `src/constants.ts`.
