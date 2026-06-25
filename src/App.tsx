import { useEffect, lazy, Suspense } from "react";
import { HashRouter, Routes, Route, useLocation } from "react-router-dom";
import { Nav } from "./components/Nav";
import { Footer } from "./components/Footer";
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

function ScrollToTop() {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return null;
}

function Shell() {
    const { pathname } = useLocation();
    // Home uses a light Nav over its own imagery; every other route opens with
    // the dark hero, so the Nav needs to switch to dark mode to blend in.
    const dark = pathname !== ROUTES.home;

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
                </Routes>
            </Suspense>
            <Footer />
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
