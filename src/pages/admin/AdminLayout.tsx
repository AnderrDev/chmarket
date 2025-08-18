import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-ch-black text-white flex">
      <aside className="w-64 border-r border-white/10 p-4 space-y-2">
        <div className="text-lg font-semibold mb-4">Panel</div>
        <nav className="flex flex-col gap-1">
          <NavLink to="/admin" end className={({ isActive }) => isActive ? 'text-white' : 'text-white/70'}>Dashboard</NavLink>
          <NavLink to="/admin/products" className={({ isActive }) => isActive ? 'text-white' : 'text-white/70'}>Productos</NavLink>
          <NavLink to="/admin/orders" className={({ isActive }) => isActive ? 'text-white' : 'text-white/70'}>Pedidos</NavLink>
          <NavLink to="/admin/customers" className={({ isActive }) => isActive ? 'text-white' : 'text-white/70'}>Clientes</NavLink>
          <NavLink to="/admin/content" className={({ isActive }) => isActive ? 'text-white' : 'text-white/70'}>Contenido</NavLink>
          <NavLink to="/admin/settings" className={({ isActive }) => isActive ? 'text-white' : 'text-white/70'}>Ajustes</NavLink>
        </nav>
      </aside>
      <section className="flex-1 p-6">
        <Outlet />
      </section>
    </div>
  )
}


