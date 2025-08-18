
// =============================================
// src/app/providers.tsx
// =============================================
import React from 'react'
import { CartProvider } from '../context/CartContext'
import { ToastProvider } from '../context/ToastContext'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <CartProvider>
        {children}
      </CartProvider>
    </ToastProvider>
  )
}