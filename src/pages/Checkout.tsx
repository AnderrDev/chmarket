import { ArrowLeft, Shield } from "lucide-react"
import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useCart } from "../context/CartContext"
import { CustomerInfo } from "../types/customer"
import { currency } from "../utils/format"


export default function Checkout() {
  const { items, total } = useCart()
  const navigate = useNavigate()
  const [info, setInfo] = useState<CustomerInfo>({ firstName:'', lastName:'', email:'', phone:'', address:'', city:'', zipCode:'', country:'' })
  const [discountCode, setDiscountCode] = useState('')

const onSubmit = (e: React.FormEvent) => {
  e.preventDefault()
  // Validación simple
  if (!info.email) {
    alert('Por favor ingresa tu email')
    return
  }
  // Guarda respaldo para Payment (por si navegan directo o se pierde el state)
  sessionStorage.setItem('ch_customer', JSON.stringify(info))
  navigate('/payment', { state: { customer: info, discount_code: discountCode || undefined } })
}

  return (
    <div className="container py-10">
      <Link to="/" className="inline-flex items-center text-ch-primary mb-6"><ArrowLeft className="w-5 h-5 mr-2"/>Back to Products</Link>

      <h1 className="text-3xl font-secondary text-white mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-ch-dark-gray rounded-2xl p-6 border border-ch-gray/20">
          <h2 className="text-xl text-white mb-4">Customer Information</h2>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input label="First Name" value={info.firstName} onChange={v => setInfo(s=>({...s, firstName:v}))} />
              <Input label="Last Name" value={info.lastName} onChange={v => setInfo(s=>({...s, lastName:v}))} />
            </div>
            <Input type="email" label="Email" value={info.email} onChange={v => setInfo(s=>({...s, email:v}))} />
            <Input label="Phone" value={info.phone} onChange={v => setInfo(s=>({...s, phone:v}))} />
            <Input label="Address" value={info.address} onChange={v => setInfo(s=>({...s, address:v}))} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="City" value={info.city} onChange={v => setInfo(s=>({...s, city:v}))} />
              <Input label="ZIP Code" value={info.zipCode} onChange={v => setInfo(s=>({...s, zipCode:v}))} />
            </div>
            <select value={info.country} onChange={e=>setInfo(s=>({...s, country:e.target.value}))} required className="w-full px-3 py-2 bg-ch-medium-gray border border-ch-gray/30 rounded-md">
              <option value="">Select Country</option>
              <option value="AR">Argentina</option>
              <option value="BR">Brasil</option>
              <option value="CL">Chile</option>
              <option value="CO">Colombia</option>
              <option value="MX">México</option>
              <option value="PE">Perú</option>
              <option value="UY">Uruguay</option>
            </select>

            <div>
              <label className="block text-sm text-ch-gray mb-1">Código de Descuento</label>
              <input
                type="text"
                value={discountCode}
                onChange={(e)=>setDiscountCode(e.target.value.toUpperCase())}
                placeholder="CHPLUS10"
                className="w-full px-3 py-2 bg-ch-medium-gray border border-ch-gray/30 rounded-md"
              />
            </div>

            <button type="submit" className="w-full bg-ch-primary text-black font-semibold py-3 rounded-lg">Continuar al Pago</button>
          </form>
        </div>

        <div className="bg-ch-dark-gray rounded-2xl p-6 border border-ch-gray/20 h-fit">
          <h2 className="text-xl text-white mb-4">Order Summary</h2>
          <div className="space-y-3 mb-4">
            {items.map(i => (
              <div key={i.id} className="flex justify-between items-center py-2 border-b border-ch-gray/20">
                <div>
                  <span className="text-white">{i.name}</span>
                  <span className="text-ch-gray text-sm ml-2">x{i.quantity}</span>
                </div>
                <span className="text-white font-semibold">{currency(i.price * i.quantity, 'es-CO', 'COP')}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center text-lg font-bold">
            <span className="text-white">Total:</span>
            <span className="text-ch-primary">{currency(total, 'es-CO', 'COP')}</span>
          </div>
          <div className="mt-6 p-4 bg-ch-medium-gray rounded-lg border border-ch-gray/30 text-sm text-ch-gray">
            <Shield className="inline-block w-4 h-4 mr-2 text-ch-primary"/> Pago Seguro con MercadoPago
          </div>
        </div>
      </div>
    </div>
  )
}

function Input({ label, value, onChange, type='text' }: { label: string; value: string; onChange: (v:string)=>void; type?: string }) {
  return (
    <div>
      <label className="block text-sm text-ch-gray mb-1">{label}</label>
      <input type={type} required value={value} onChange={e=>onChange(e.target.value)} className="w-full px-3 py-2 bg-ch-medium-gray border border-ch-gray/30 rounded-md"/>
    </div>
  )
}
