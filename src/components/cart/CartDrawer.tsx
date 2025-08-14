// =============================================
// src/components/cart/CartDrawer.tsx
// =============================================
import { X, Minus, Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext';
import { currency } from '../../utils/format';

export default function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { items, setQty, remove, total } = useCart()
  const navigate = useNavigate()

  return (
    <div className={`fixed inset-0 z-50 ${open ? 'pointer-events-auto' : 'pointer-events-none'}`}>
      <div
        className={`absolute inset-0 bg-black transition-opacity duration-300 ${open ? 'opacity-70' : 'opacity-0'}`}
        onClick={onClose}
      />
      <aside className={`absolute right-0 top-0 h-full w-full max-w-md bg-ch-dark-gray shadow-2xl transform transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'} border-l border-ch-gray/20`}>
        <div className="flex items-center justify-between p-6 border-b border-ch-gray/20">
          <h2 className="text-xl font-secondary text-white">Shopping Cart</h2>
          <button onClick={onClose} className="p-2 hover:bg-ch-light-gray rounded-full"><X className="w-5 h-5 text-ch-gray"/></button>
        </div>

        <div className="p-6 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
          {items.length === 0 ? (
            <p className="text-center text-ch-gray">Your cart is empty</p>
          ) : items.map(item => (
            <div key={item.variant_id ? String(item.variant_id) : `id:${item.id}`} className="bg-ch-medium-gray rounded-lg p-4 border border-ch-gray/30">
              <div className="flex items-center gap-4">
                <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">{item.name}</p>
                  <p className="text-ch-gray text-sm">{currency(item.price)}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button onClick={() => setQty(item.variant_id ? String(item.variant_id) : `id:${item.id}`, item.quantity - 1)} className="p-1 hover:bg-ch-light-gray rounded"><Minus className="w-4 h-4 text-ch-gray"/></button>
                    <span className="px-3 py-1 bg-ch-black rounded text-sm text-white border border-ch-gray/30">{item.quantity}</span>
                    <button onClick={() => setQty(item.variant_id ? String(item.variant_id) : `id:${item.id}`, item.quantity + 1)} className="p-1 hover:bg-ch-light-gray rounded"><Plus className="w-4 h-4 text-ch-gray"/></button>
                    <button onClick={() => remove(item.variant_id ? String(item.variant_id) : `id:${item.id}`)} className="ml-2 text-ch-primary hover:underline">Remove</button>
                  </div>
                </div>
                <div className="text-right font-bold text-white">{currency(item.price * item.quantity)}</div>
              </div>
            </div>
          ))}
        </div>

        {items.length > 0 && (
          <div className="border-t border-ch-gray/20 p-6 bg-ch-dark-gray">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg text-white">Total:</span>
              <span className="text-2xl font-bold text-ch-primary">{currency(total)}</span>
            </div>
            <button
              onClick={() => { onClose(); navigate('/checkout') }}
              className="w-full bg-ch-primary text-black font-semibold py-3 rounded-lg hover:opacity-90"
            >Proceed to Checkout</button>
          </div>
        )}
      </aside>
    </div>
  )
}
