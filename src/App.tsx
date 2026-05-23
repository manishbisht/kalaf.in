import { useEffect } from "react";
import { HashRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import ShippingReturns from "./pages/ShippingReturns";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import RefundPolicy from "./pages/RefundPolicy";
import CookiePolicy from "./pages/CookiePolicy";
import SizeGuide from "./pages/SizeGuide";
import CareGuide from "./pages/CareGuide";
import TrackOrder from "./pages/TrackOrder";
import Contact from "./pages/Contact";
import { Nav } from "./components/Nav";
import { Footer } from "./components/Footer";
import { ROUTES } from "./constants";

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
            <Routes>
                <Route path={ROUTES.home} element={<Home />} />
                <Route
                    path={ROUTES.shippingReturns}
                    element={<ShippingReturns />}
                />
                <Route path={ROUTES.privacy} element={<Privacy />} />
                <Route path={ROUTES.terms} element={<Terms />} />
                <Route path={ROUTES.refundPolicy} element={<RefundPolicy />} />
                <Route path={ROUTES.cookies} element={<CookiePolicy />} />
                <Route path={ROUTES.sizeGuide} element={<SizeGuide />} />
                <Route path={ROUTES.careGuide} element={<CareGuide />} />
                <Route path={ROUTES.trackOrder} element={<TrackOrder />} />
                <Route path={ROUTES.contact} element={<Contact />} />
            </Routes>
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
