import { useEffect, lazy, Suspense } from "react";
import { HashRouter, Routes, Route, useLocation } from "react-router-dom";
import { Nav } from "./components/Nav";
import { Footer } from "./components/Footer";
import { WhatsAppButton } from "./components/WhatsAppButton";
import { ROUTES } from "./constants";

// Route-level code splitting — each page ships in its own chunk so the home
// bundle doesn't have to download every policy page upfront.
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

function ScrollToTop() {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return null;
}

function Shell() {
    const { pathname } = useLocation();
    // Home and the shop pages use the light Nav; policy/guide pages open with
    // a dark hero, so the Nav switches to dark mode to blend in.
    const light =
        pathname === ROUTES.home ||
        pathname.startsWith("/products") ||
        pathname.startsWith("/collections");
    const dark = !light;

    return (
        <>
            <ScrollToTop />
            <Nav dark={dark} />
            <Suspense fallback={<div style={{ minHeight: "100vh" }} />}>
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
                </Routes>
            </Suspense>
            <Footer />
            <WhatsAppButton />
        </>
    );
}

export default function App() {
    return (
        <HashRouter>
            <Shell />
        </HashRouter>
    );
}
