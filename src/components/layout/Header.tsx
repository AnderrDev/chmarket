import { ShoppingCart, Menu, X } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { useCart } from '../../context/CartContext'
import CartDrawer from '../cart/CartDrawer'


export default function Header() {
  const [openCart, setOpenCart] = useState(false)
  const [openMobile, setOpenMobile] = useState(false)
  const { count } = useCart()
  const location = useLocation()

  // Si no estás en "/", los anchors deben navegar a "/#id"
  const to = (hash: string) => (location.pathname === '/' ? `#${hash}` : `/#${hash}`)

  return (
    <header className="bg-ch-dark-gray sticky top-0 z-40 border-b border-ch-gray/20 min-w-[320px]">
      <div className="container h-20 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center space-x-3">
            <div className=" rounded-lg p-1 shadow-lg flex items-center justify-center">
              <img
                src="https://iqeuktsyzrkrbkjiqfvy.supabase.co/storage/v1/object/public/images/Captura%20de%20pantalla%202025-08-11%20a%20la(s)%209.37.27%20p.m..png" // Ruta de tu logo (puede ser .svg o .png)
                alt="CH+"
                className="w-14 h-14 object-contain rounded-lg"
              />
            </div>
          </Link>

          {/* Navbar desktop */}
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href={to('hero')} className="text-ch-gray hover:text-white">Inicio</a>
            <a href={to('products')} className="text-ch-gray hover:text-white">Productos</a>
            <a href={to('about')} className="text-ch-gray hover:text-white">Nosotros</a>
            <a href={to('pqrs')} className="text-ch-gray hover:text-white">PQRS</a>

          </nav>
        </div>

        <div className="flex items-center gap-2">
          {/* Botón carrito */}
          <button
            onClick={() => setOpenCart(true)}
            className="relative p-2 hover:bg-ch-light-gray rounded-full transition"
          >
            <ShoppingCart className="w-6 h-6 text-ch-gray" />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 bg-ch-primary text-black text-xs rounded-full w-5 h-5 grid place-items-center font-bold">
                {count}
              </span>
            )}
          </button>

          {/* Hamburguesa móvil */}
          <button
            className="md:hidden p-2 hover:bg-ch-light-gray rounded-lg"
            onClick={() => setOpenMobile(v => !v)}
            aria-label="Abrir menú"
          >
            {openMobile ? <X className="w-6 h-6 text-ch-gray" /> : <Menu className="w-6 h-6 text-ch-gray" />}
          </button>
        </div>
      </div>

      {/* Drawer móvil */}
      {openMobile && (
        <div className="md:hidden border-t border-ch-gray/20 bg-ch-dark-gray">
          <nav className="container py-3 flex flex-col gap-3 text-sm">
            <a href={to('hero')} className="text-ch-gray hover:text-white" onClick={() => setOpenMobile(false)}>Inicio</a>
            <a href={to('products')} className="text-ch-gray hover:text-white" onClick={() => setOpenMobile(false)}>Productos</a>
            <a href={to('about')} className="text-ch-gray hover:text-white" onClick={() => setOpenMobile(false)}>Nosotros</a>
            <a href={to('pqrs')} className="text-ch-gray hover:text-white" onClick={() => setOpenMobile(false)}>PQRS</a>
          </nav>
        </div>
      )}

      <CartDrawer open={openCart} onClose={() => setOpenCart(false)} />
    </header>
  )
}
