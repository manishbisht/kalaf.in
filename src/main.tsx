import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import Clarity from "@microsoft/clarity";
import "./tokens.css";
import "./index.css";
import App from "./App";
import { ENV } from "./env";

// Old hash links (/#/products/x?colour=BK) from the HashRouter days → real paths.
if (location.hash.startsWith("#/")) {
    history.replaceState(null, "", location.hash.slice(1));
}

if (ENV.clarityProjectId) {
    Clarity.init(ENV.clarityProjectId);
}

// The build writes static head tags into each prerendered page for crawlers.
// <Seo /> renders the live ones, so drop the static copies to avoid duplicates.
document.querySelectorAll("[data-seo]").forEach((el) => el.remove());

const root = document.getElementById("root")!;
const app = (
    <StrictMode>
        <App />
    </StrictMode>
);

// Prerendered pages carry their path on the root. Hydrate only when the URL is
// exactly what was prerendered — a ?colour= or filter query (or the 404.html
// fallback) renders different content, so those start a fresh client render.
const path = location.pathname.replace(/(.)\/+$/, "$1");
if (root.dataset.path === path && !location.search && root.firstChild) {
    hydrateRoot(root, app);
} else {
    createRoot(root).render(app);
}
