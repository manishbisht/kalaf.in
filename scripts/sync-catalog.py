#!/usr/bin/env python3
"""Build the website's product catalog from the products.kalaf.in repo.

    python3 scripts/sync-catalog.py ../products.kalaf.in

Reads catalog/<PRODUCT>/product.json and catalog/<PRODUCT>/<SKU>/variant.json,
then writes:
  - src/data/catalog.json              product + variant data the site imports
  - public/catalog/<PRODUCT>/...       web-sized images (600w + 1200w) and videos

Re-run it whenever the products repo changes. Media that already exists is
skipped, so only new photos are processed (pass --force to redo everything).

A marketplace link is only published when the products repo has a `url` for it,
so listings still in QC (or pulled, like Amazon) never show a buy button.
"""

import json
import shutil
import subprocess
import sys
from pathlib import Path

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
OUT_JSON = ROOT / "src" / "data" / "catalog.json"
OUT_MEDIA = ROOT / "public" / "catalog"
WIDTHS = (600, 1200)

# Website-only details the products repo doesn't hold. Order = display order.
PRODUCTS = {
    "PNT": {
        "handle": "cotton-linen-relaxed-trousers",
        "collection": "pants",
        "title": "Cotton Linen Relaxed Trousers",
    },
    "DUAG": {
        "handle": "bandhani-dupatta-gota-border",
        "collection": "dupattas",
        "title": "Bandhani Dupatta with Gota Border",
        "description": "Classic Rajasthani bandhani dots on artificial silk (taffeta), finished with a shimmering gota border along the edges. A full-length dupatta for festive days, weddings and pujas.",
        "features": [
            "Bandhani tie-dye print",
            "Gota border along the edges",
            "Artificial silk (taffeta) with a soft sheen",
        ],
    },
    "DUA": {
        "handle": "bandhani-dupatta",
        "collection": "dupattas",
        "title": "Bandhani Dupatta",
        "description": "Classic Rajasthani bandhani dots on artificial silk (taffeta). A clean, borderless full-length dupatta that pairs with everyday kurtas as easily as festive wear.",
        "features": [
            "Bandhani tie-dye print",
            "No border, for a clean finish",
            "Artificial silk (taffeta) with a soft sheen",
        ],
    },
    "DUCHI": {
        "handle": "chiffon-leheriya-dupatta",
        "collection": "dupattas",
        "title": "Chiffon Leheriya Dupatta with Gota Border",
        "description": "Light, flowing chiffon in rippling leheriya stripes, edged with a gota border. An airy full-length dupatta that drapes softly for festive and summer wear.",
        "features": [
            "Leheriya wave-stripe print",
            "Gota border along the edges",
            "Light, sheer chiffon that drapes softly",
        ],
    },
}

MARKETPLACES = ("flipkart", "meesho", "amazon")


def save_images(src: Path, dest_dir: Path, stem: str, force: bool) -> dict:
    dest_dir.mkdir(parents=True, exist_ok=True)
    out = {}
    im = None
    for w in WIDTHS:
        dest = dest_dir / f"{stem}-{w}.jpg"
        if force or not dest.exists():
            if im is None:
                im = ImageOps.exif_transpose(Image.open(src)).convert("RGB")
            h = round(im.height * w / im.width)
            im.resize((w, h), Image.LANCZOS).save(
                dest, "JPEG", quality=80, optimize=True, progressive=True
            )
        out[w] = "/" + dest.relative_to(ROOT / "public").as_posix()
    return out


def save_video(src: Path, dest_dir: Path, stem: str, force: bool) -> dict:
    dest_dir.mkdir(parents=True, exist_ok=True)
    video = dest_dir / f"{stem}.mp4"
    poster = dest_dir / f"{stem}-poster.jpg"
    if force or not video.exists():
        subprocess.run(
            ["ffmpeg", "-y", "-loglevel", "error", "-i", str(src), "-an",
             "-vf", "scale=720:-2", "-c:v", "libx264", "-crf", "26",
             "-preset", "slow", "-pix_fmt", "yuv420p", "-movflags", "+faststart",
             str(video)],
            check=True,
        )
    if force or not poster.exists():
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


def build(src_root: Path, force: bool):
    catalog = src_root / "catalog"
    colours = json.loads((src_root / "colors.json").read_text())
    products = []

    for code, extra in PRODUCTS.items():
        pdir = catalog / code
        p = json.loads((pdir / "product.json").read_text())
        attrs = p.get("attributes", {})
        variants = []

        for vdir in sorted(d for d in pdir.iterdir() if (d / "variant.json").exists()):
            v = json.loads((vdir / "variant.json").read_text())
            plat = v["platforms"]
            links = {m: plat[m]["url"] for m in MARKETPLACES if plat.get(m, {}).get("url")}

            # Sized products: Flipkart lists one page per size.
            size_links = {}
            for size, s in (v.get("sizes") or {}).items():
                if s.get("flipkart_url"):
                    size_links[size] = s["flipkart_url"]
            if size_links and "flipkart" not in links:
                mid = list(size_links)[len(size_links) // 2]
                links["flipkart"] = size_links[mid]

            dest = OUT_MEDIA / code
            images = []
            for img in sorted((vdir / "images").glob("*.jpg"),
                              key=lambda f: int(f.stem.rsplit("_", 1)[1])):
                sizes = save_images(img, dest, img.stem, force)
                images.append({"src": sizes[600], "srcLarge": sizes[1200]})

            video = None
            vsrc = pdir / "videos" / f"{v['sku']}_video.mp4"
            if vsrc.exists():
                video = save_video(vsrc, dest, f"{v['sku']}_video", force)

            prices = [plat[m]["price"] for m in MARKETPLACES if plat.get(m, {}).get("price")]
            colour = colours[v["color"]]
            variants.append({
                "sku": v["sku"],
                "colourCode": v["color"],
                "colour": colour["name"],
                "family": colour["family"],
                "price": min(prices),
                "mrp": v["mrp"],
                "images": images,
                "video": video,
                "links": links,
                "sizeLinks": size_links or None,
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
            "features": p.get("features") or extra.get("features", []),
            "details": p.get("details") or [],
            "care": p.get("material_care") or [],
            "fabric": attrs.get("fabric"),
            "pattern": attrs.get("pattern"),
            "border": attrs.get("border"),
            "fit": attrs.get("fit"),
            "size": size_label(attrs),
            "sizes": sizes,
            "variants": variants,
        })

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
