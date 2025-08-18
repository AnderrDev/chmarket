// =============================================
// src/app/AppRoutes.tsx
// =============================================
import React, { Suspense, lazy } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Footer from '../components/layout/Footer'
import Header from '../components/layout/Header'
import Checkout from '../pages/Checkout'
import Confirmation from '../pages/Confirmation'
import Processing from '../pages/Processing'
import ProductDetail from '../pages/ProductDetail'
import Products from '../pages/Products'
import Home from '../pages/Home'
import Payment from '../pages/Payment'

// Admin lazy imports (sin auth/roles por ahora)
const AdminLayout = lazy(() => import('../pages/admin/AdminLayout'))
const AdminDashboard = lazy(() => import('../pages/admin/Dashboard'))
const AdminProducts = lazy(() => import('../pages/admin/Products'))
const AdminOrders = lazy(() => import('../pages/admin/Orders'))
const AdminCustomers = lazy(() => import('../pages/admin/Customers'))
const AdminContent = lazy(() => import('../pages/admin/Content'))
const AdminSettings = lazy(() => import('../pages/admin/Settings'))


export default function AppRoutes() {
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')

  if (isAdmin) {
    return (
      <Suspense fallback={<div className="min-h-screen bg-ch-black text-white p-6">Cargando panel…</div>}>
        <Routes location={location}>
          <Route path="/admin/*" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="customers" element={<AdminCustomers />} />
            <Route path="content" element={<AdminContent />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Routes>
      </Suspense>
    )
  }

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