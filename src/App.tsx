import { useEffect, useRef, Suspense, type ReactNode } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Clarity from "@microsoft/clarity";
import { Nav } from "./components/Nav";
import { Footer } from "./components/Footer";
import { WhatsAppButton } from "./components/WhatsAppButton";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { Seo } from "./seo/Seo";
import { ROUTES } from "./constants";
import { ENV } from "./env";
import { lazyWithReload as lazy } from "./lazyWithReload";

// Route-level code splitting — each page ships in its own chunk so the home
// bundle doesn't have to download every policy page upfront. The build
// prerenders these with react-dom/static, which waits for lazy pages.
// `lazy` here is lazyWithReload (React's lazy plus one page reload when a
// chunk from an older deploy is gone), so every page gets it.
const Home = lazy(() => import("./pages/Home"));
const ShippingReturns = lazy(() => import("./pages/ShippingReturns"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const RefundPolicy = lazy(() => import("./pages/RefundPolicy"));
const CookiePolicy = lazy(() => import("./pages/CookiePolicy"));
const SizeGuide = lazy(() => import("./pages/SizeGuide"));
const CareGuide = lazy(() => import("./pages/CareGuide"));
const TrackOrder = lazy(() => import("./pages/TrackOrder"));
const Contact = lazy(() => import("./pages/Contact"));
const Shop = lazy(() => import("./pages/Shop"));
const ProductPage = lazy(() => import("./pages/Product"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Faq = lazy(() => import("./pages/Faq"));
const Links = lazy(() => import("./pages/Links"));

// Policy and guide pages open with a dark hero, so the Nav goes dark there.
const DARK_NAV: string[] = [
    ROUTES.shippingReturns,
    ROUTES.privacy,
    ROUTES.terms,
    ROUTES.refundPolicy,
    ROUTES.cookies,
    ROUTES.sizeGuide,
    ROUTES.careGuide,
    ROUTES.trackOrder,
    ROUTES.contact,
    ROUTES.faq,
];

function ScrollToTop() {
    const { pathname } = useLocation();
    const firstLoad = useRef(true);
    useEffect(() => {
        window.scrollTo(0, 0);
        // Clarity's auto-tracker can miss client-side navigations. It does
        // count the first load itself, so only report the ones after it.
        if (firstLoad.current) {
            firstLoad.current = false;
            return;
        }
        if (ENV.clarityProjectId) Clarity.event("page_view");
    }, [pathname]);
    return null;
}

// The routes' error boundary and Suspense fallback. A page that throws, or
// whose chunk won't load even after lazyWithReload's one reload, shows the
// boundary's "Something went wrong" message; the next navigation clears it.
function PageBoundary({
    resetKey,
    children,
}: {
    resetKey: string;
    children: ReactNode;
}) {
    return (
        <ErrorBoundary resetKey={resetKey}>
            <Suspense fallback={<div style={{ minHeight: "100vh" }} />}>
                {children}
            </Suspense>
        </ErrorBoundary>
    );
}

// Everything inside the router. The server entry (entry-server.tsx) wraps
// this in a StaticRouter to prerender each page at build time, with
// seo={false}: the prerender writes head tags itself, and React would
// otherwise emit a second copy inside #root.
export function Shell({ seo = true }: { seo?: boolean }) {
    const { pathname } = useLocation();
    const dark = DARK_NAV.includes(pathname.replace(/(.)\/+$/, "$1"));

    return (
        <>
            {seo && <Seo />}
            <ScrollToTop />
            <Nav dark={dark} />
            <PageBoundary resetKey={pathname}>
                <Routes>
                    <Route path={ROUTES.home} element={<Home />} />
                    <Route
                        path={ROUTES.shippingReturns}
                        element={<ShippingReturns />}
                    />
                    <Route path={ROUTES.privacy} element={<Privacy />} />
                    <Route path={ROUTES.terms} element={<Terms />} />
                    <Route
                        path={ROUTES.refundPolicy}
                        element={<RefundPolicy />}
                    />
                    <Route path={ROUTES.cookies} element={<CookiePolicy />} />
                    <Route path={ROUTES.sizeGuide} element={<SizeGuide />} />
                    <Route path={ROUTES.careGuide} element={<CareGuide />} />
                    <Route path={ROUTES.trackOrder} element={<TrackOrder />} />
                    <Route path={ROUTES.contact} element={<Contact />} />
                    <Route path={ROUTES.products} element={<Shop />} />
                    <Route path={ROUTES.collection} element={<Shop />} />
                    <Route path={ROUTES.product} element={<ProductPage />} />
                    <Route path={ROUTES.faq} element={<Faq />} />
                    <Route path={ROUTES.links} element={<Links />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </PageBoundary>
            <Footer />
            <WhatsAppButton />
        </>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <Shell />
        </BrowserRouter>
    );
}
