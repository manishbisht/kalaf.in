#!/usr/bin/env python3
"""Build the website's product catalog from the products.kalaf.in repo.

    python3 scripts/sync-catalog.py ../products.kalaf.in

Reads catalog/<PRODUCT>/product.json and catalog/<PRODUCT>/<SKU>/variant.json,
then writes:
  - src/data/catalog.json              product + variant data the site imports
  - src/data/business.json             public business details (from business.json)
  - public/catalog/<PRODUCT>/...       web-sized images (600w + 1200w) and videos

Re-run it whenever the products repo changes. Media whose source file hasn't
changed is skipped (tracked in public/catalog/.sources.json), so only new or
edited photos and videos are processed. Pass --force to redo everything.

A marketplace link is only published when the products repo has a `url` for it
and its status doesn't say the listing is blocked or removed, so listings still
in QC, blocked or pulled (like Amazon) never show a buy button.
"""

import hashlib
import json
import re
import shutil
import subprocess
import sys
from pathlib import Path

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
OUT_JSON = ROOT / "src" / "data" / "catalog.json"
OUT_BUSINESS = ROOT / "src" / "data" / "business.json"
OUT_MEDIA = ROOT / "public" / "catalog"
MANIFEST = OUT_MEDIA / ".sources.json"
WIDTHS = (600, 1200)

# A listing whose status mentions one of these is not buyable, even with a url.
NOT_LIVE = re.compile(r"\b(blocked|removed?|delisted|inactive|suspended)\b", re.I)

# Website-only details the products repo doesn't hold. Order = display order.
PRODUCTS = {
    "PNT": {
        # Was cotton-linen-relaxed-trousers until the fabric changed to
        # 100% cotton; src/data/catalog.ts redirects the old handle.
        "handle": "cotton-relaxed-trousers",
        "collection": "pants",
        # Owner's own link for every "Buy on Flipkart" pants button (12 Nov
        # 2026). Replaces the per-colour/per-size Flipkart pages; only used
        # while the products repo shows the Flipkart listing as live.
        "links": {"flipkart": "https://pants.kalaf.in/kalaf.in"},
    },
    "DUAG": {
        "handle": "bandhani-dupatta-gota-border",
        "collection": "dupattas",
        "title": "Bandhani Dupatta with Gota Border",
        "description": "Classic Rajasthani bandhani dots on artificial silk (taffeta), finished with a shimmering gota border along the edges. A full-length dupatta for festive days, weddings and pujas.",
    },
    "DUA": {
        "handle": "bandhani-dupatta",
        "collection": "dupattas",
        "title": "Bandhani Dupatta",
        "description": "Classic Rajasthani bandhani dots on artificial silk (taffeta). A clean, borderless full-length dupatta that pairs with everyday kurtas as easily as festive wear.",
    },
    "DUCHI": {
        "handle": "chiffon-leheriya-dupatta",
        "collection": "dupattas",
        "title": "Chiffon Leheriya Dupatta with Gota Border",
        "description": "Light, flowing chiffon in rippling leheriya stripes, edged with a gota border. An airy full-length dupatta that drapes softly for festive and summer wear.",
    },
}

MARKETPLACES = ("flipkart", "meesho", "amazon")


def file_hash(path: Path) -> str:
    return hashlib.sha1(path.read_bytes()).hexdigest()


def load_manifest() -> dict:
    return json.loads(MANIFEST.read_text()) if MANIFEST.exists() else {}


def stale(manifest: dict, key: str, src: Path, outputs: list, force: bool) -> bool:
    """True when an output is missing or the source changed since last sync."""
    digest = file_hash(src)
    changed = force or manifest.get(key) != digest or not all(o.exists() for o in outputs)
    manifest[key] = digest
    return changed


def save_images(src: Path, dest_dir: Path, stem: str, force: bool, manifest: dict) -> dict:
    dest_dir.mkdir(parents=True, exist_ok=True)
    out = {}
    im = None
    dests = [dest_dir / f"{stem}-{w}.jpg" for w in WIDTHS]
    redo = stale(manifest, f"{dest_dir.name}/{stem}", src, dests, force)
    for w in WIDTHS:
        dest = dest_dir / f"{stem}-{w}.jpg"
        if redo:
            if im is None:
                im = ImageOps.exif_transpose(Image.open(src)).convert("RGB")
            h = round(im.height * w / im.width)
            im.resize((w, h), Image.LANCZOS).save(
                dest, "JPEG", quality=80, optimize=True, progressive=True
            )
        out[w] = "/" + dest.relative_to(ROOT / "public").as_posix()
    return out


def save_video(src: Path, dest_dir: Path, stem: str, force: bool, manifest: dict) -> dict:
    dest_dir.mkdir(parents=True, exist_ok=True)
    video = dest_dir / f"{stem}.mp4"
    poster = dest_dir / f"{stem}-poster.jpg"
    redo = stale(manifest, f"{dest_dir.name}/{stem}", src, [video, poster], force)
    if redo:
        subprocess.run(
            ["ffmpeg", "-y", "-loglevel", "error", "-i", str(src), "-an",
             "-vf", "scale=720:-2", "-c:v", "libx264", "-crf", "26",
             "-preset", "slow", "-pix_fmt", "yuv420p", "-movflags", "+faststart",
             str(video)],
            check=True,
        )
    if redo:
        subprocess.run(
            ["ffmpeg", "-y", "-loglevel", "error", "-i", str(video),
             "-frames:v", "1", "-q:v", "4", str(poster)],
            check=True,
        )
    rel = lambda p: "/" + p.relative_to(ROOT / "public").as_posix()  # noqa: E731
    return {"src": rel(video), "poster": rel(poster)}


def size_label(attrs: dict):
    if attrs.get("length_cm") and attrs.get("width_cm"):
        return f"{attrs['length_cm'] / 100:g} m × {attrs['width_cm'] / 100:g} m"
    return None


# Public fields copied from the products repo's business.json. Everything else
# in that file (and documents/) stays private.
BUSINESS_FIELDS = ("legal_name", "trade_name", "constitution", "gstin",
                   "address", "email", "phone", "whatsapp")


def write_business(src_root: Path):
    b = json.loads((src_root / "business.json").read_text())
    out = {k: b.get(k) for k in BUSINESS_FIELDS}
    OUT_BUSINESS.write_text(json.dumps(out, indent=2, ensure_ascii=False) + "\n")
    print(f"Wrote business details -> {OUT_BUSINESS.relative_to(ROOT)}")


def stock_of(v: dict):
    """Units in stock: the variant's own count, or the sum over its sizes."""
    if v.get("sizes"):
        counts = [s.get("stock") for s in v["sizes"].values()]
        return None if any(c is None for c in counts) else sum(counts)
    return v.get("stock")


def size_chart(attrs: dict):
    chart = attrs.get("size_chart")
    if not chart:
        return None
    return {
        "units": chart.get("units"),
        "lengthIn": chart.get("length_in"),
        "inseamIn": chart.get("inseam_in"),
        "rows": [{"size": k, **r} for k, r in chart.get("rows", {}).items()],
    }


def build(src_root: Path, force: bool):
    catalog = src_root / "catalog"
    colours = json.loads((src_root / "colors.json").read_text())
    manifest = load_manifest()
    products = []

    for code, extra in PRODUCTS.items():
        pdir = catalog / code
        p = json.loads((pdir / "product.json").read_text())
        attrs = p.get("attributes", {})
        variants = []

        for vdir in sorted(d for d in pdir.iterdir() if (d / "variant.json").exists()):
            v = json.loads((vdir / "variant.json").read_text())
            plat = v["platforms"]
            live = [
                m for m in MARKETPLACES
                if not NOT_LIVE.search(plat.get(m, {}).get("status") or "")
            ]
            links = {m: plat[m]["url"] for m in live if plat[m].get("url")}

            # Sized products: Flipkart lists one page per size.
            size_links = {}
            if "flipkart" in live:
                for size, s in (v.get("sizes") or {}).items():
                    if s.get("flipkart_url"):
                        size_links[size] = s["flipkart_url"]
            if size_links and "flipkart" not in links:
                mid = list(size_links)[len(size_links) // 2]
                links["flipkart"] = size_links[mid]

            # Website-side link overrides (see PRODUCTS). A store overridden
            # here has one link for all sizes, so drop its per-size pages.
            for m, url in extra.get("links", {}).items():
                if m in live and (m in links or m in plat.get(m, {})):
                    links[m] = url
                    if m == "flipkart":
                        size_links = {}

            dest = OUT_MEDIA / code
            images = []
            for img in sorted((vdir / "images").glob("*.jpg"),
                              key=lambda f: int(f.stem.rsplit("_", 1)[1])):
                sizes = save_images(img, dest, img.stem, force, manifest)
                images.append({"src": sizes[600], "srcLarge": sizes[1200]})

            video = None
            vsrc = pdir / "videos" / f"{v['sku']}_video.mp4"
            if vsrc.exists():
                video = save_video(vsrc, dest, f"{v['sku']}_video", force, manifest)

            # Each store can charge a different price; show the lowest one
            # you can actually buy at, and each store's own on its button.
            prices = {m: plat[m]["price"] for m in links if plat[m].get("price")}
            if not prices:
                prices = {m: plat[m]["price"] for m in MARKETPLACES if plat.get(m, {}).get("price")}
            colour = colours[v["color"]]
            variants.append({
                "sku": v["sku"],
                "colourCode": v["color"],
                "colour": colour["name"],
                "family": colour["family"],
                "price": min(prices.values()),
                "prices": {m: prices[m] for m in links if m in prices},
                "mrp": v["mrp"],
                "images": images,
                "video": video,
                "links": links,
                "sizeLinks": size_links or None,
                "stock": stock_of(v),
            })

        # Show colours with a Flipkart link first, then by name.
        variants.sort(key=lambda x: ("flipkart" not in x["links"], x["colour"]))
        sizes = [str(s) for s in attrs.get("sizes", [])]
        products.append({
            "code": code,
            "handle": extra["handle"],
            "collection": extra["collection"],
            "title": extra.get("title") or p.get("short_name") or p["name"],
            # The marketplace description repeats details/care inline; the site
            # shows those as their own lists, so keep only the opening prose.
            "description": (p.get("description") or extra.get("description", ""))
            .split(" Details:")[0],
            "features": p.get("features") or p.get("flipkart_key_features") or [],
            "details": p.get("details") or [],
            "care": p.get("material_care") or [],
            "fabric": attrs.get("fabric"),
            "pattern": attrs.get("pattern"),
            "border": attrs.get("border"),
            "fit": attrs.get("fit"),
            "size": size_label(attrs),
            "sizes": sizes,
            "sizeChart": size_chart(attrs),
            "dispatchDays": p.get("dispatch_days"),
            "variants": variants,
        })

    write_business(src_root)
    MANIFEST.write_text(json.dumps(manifest, indent=1, sort_keys=True) + "\n")
    OUT_JSON.parent.mkdir(parents=True, exist_ok=True)
    OUT_JSON.write_text(json.dumps({"products": products}, indent=2, ensure_ascii=False) + "\n")
    n = sum(len(p["variants"]) for p in products)
    print(f"Wrote {len(products)} products, {n} colours -> {OUT_JSON.relative_to(ROOT)}")


if __name__ == "__main__":
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    if not args:
        sys.exit(__doc__)
    if not shutil.which("ffmpeg"):
        sys.exit("ffmpeg is required for product videos")
    build(Path(args[0]).resolve(), "--force" in sys.argv)
