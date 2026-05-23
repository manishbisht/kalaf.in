import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import ShippingReturns from './pages/ShippingReturns'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import RefundPolicy from './pages/RefundPolicy'
import CookiePolicy from './pages/CookiePolicy'
import SizeGuide from './pages/SizeGuide'
import CareGuide from './pages/CareGuide'
import TrackOrder from './pages/TrackOrder'
import Contact from './pages/Contact'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shipping-returns" element={<ShippingReturns />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/refund-policy" element={<RefundPolicy />} />
        <Route path="/cookies" element={<CookiePolicy />} />
        <Route path="/size-guide" element={<SizeGuide />} />
        <Route path="/care-guide" element={<CareGuide />} />
        <Route path="/track-order" element={<TrackOrder />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </BrowserRouter>
  )
}
