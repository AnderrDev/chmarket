// =============================================
// src/app/AppRoutes.tsx
// =============================================
import { Route, Routes, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Footer from '../components/layout/Footer'
import Header from '../components/layout/Header'
import Checkout from '../pages/Checkout'
import Confirmation from '../pages/Confirmation'
import Processing from '../pages/Processing'
import ProductDetail from '../pages/ProductDetail'
import Products from '../pages/Products'
import Home from '../pages/Home'
import Payment from '../pages/Payment'


export default function AppRoutes() {
  const location = useLocation()
  
  // Hacer scroll hacia arriba cuando cambie la ruta
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])
  
  return (
    <div className="min-h-screen bg-ch-black">
      <Header />
      <main className="min-h-[70vh]">
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/processing" element={<Processing />} />
          {/* back_urls MP */}
          <Route path="/success" element={<Confirmation />} />
          <Route path="/pending" element={<Confirmation />} />
          <Route path="/failure" element={<Confirmation />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}