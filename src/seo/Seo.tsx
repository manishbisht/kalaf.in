import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { jsonLdText, metaTags, seoFor } from ".";

// Renders the current route's head tags. React 19 hoists <title>, <meta> and
// <link> into <head> wherever they're rendered. JSON-LD isn't hoisted, so it's
// kept in one managed <script> in <head> instead.
export function Seo() {
    const { pathname, search } = useLocation();
    const seo = seoFor(pathname, search);
    const jsonLd = seo.jsonLd.length ? jsonLdText(seo.jsonLd) : "";

    useEffect(() => {
        let el = document.getElementById("seo-jsonld");
        if (!jsonLd) {
            el?.remove();
            return;
        }
        if (!el) {
            el = document.createElement("script");
            el.id = "seo-jsonld";
            el.setAttribute("type", "application/ld+json");
            document.head.appendChild(el);
        }
        el.textContent = jsonLd;
    }, [jsonLd]);

    return (
        <>
            <title>{seo.title}</title>
            {metaTags(seo).map(([attr, key, content]) => (
                <meta key={key} {...{ [attr]: key }} content={content} />
            ))}
            {!seo.noindex && <link rel="canonical" href={seo.canonical} />}
        </>
    );
}
