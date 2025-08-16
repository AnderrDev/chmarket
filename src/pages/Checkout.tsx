import { ArrowLeft, Shield } from "lucide-react"
import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useCart } from "../context/CartContext"
import { CustomerInfo } from "../types/customer"
import { currency } from "../utils/format"


export default function Checkout() {
  const { items, total } = useCart()
  const navigate = useNavigate()
  const [info, setInfo] = useState<CustomerInfo>({
    firstName:'',
    lastName:'',
    email:'',
    phone:'',
    address:'',
    city:'',
    zipCode:'',
    country:'CO',
    documentType:'CC',
    documentNumber:'',
  })
  const [discountCode, setDiscountCode] = useState('')

const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
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
          <h2 className="text-xl text-white mb-4">Información del Cliente</h2>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input label="Nombre" value={info.firstName} onChange={v => setInfo(s=>({...s, firstName:v}))} />
              <Input label="Apellido" value={info.lastName} onChange={v => setInfo(s=>({...s, lastName:v}))} />
            </div>
            <Input type="email" label="Email" value={info.email} onChange={v => setInfo(s=>({...s, email:v}))} />
            <Input label="Teléfono" value={info.phone} onChange={v => setInfo(s=>({...s, phone:v}))} />
            <Input label="Dirección" value={info.address} onChange={v => setInfo(s=>({...s, address:v}))} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Ciudad" value={info.city} onChange={v => setInfo(s=>({...s, city:v}))} />
              <Input label="Código Postal" value={info.zipCode} onChange={v => setInfo(s=>({...s, zipCode:v}))} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-ch-gray mb-1">Tipo de Documento</label>
                <select
                  value={info.documentType}
                  onChange={e=>setInfo(s=>({...s, documentType:e.target.value}))}
                  className="w-full px-3 py-2 bg-ch-medium-gray border border-ch-gray/30 rounded-md"
                  required
                >
                  <option value="CC">Cédula de Ciudadanía (CC)</option>
                  <option value="CE">Cédula de Extranjería (CE)</option>
                  <option value="NIT">NIT</option>
                  <option value="Pasaporte">Pasaporte</option>
                </select>
              </div>
              <Input
                label="Número de Documento"
                value={info.documentNumber}
                onChange={v => setInfo(s=>({...s, documentNumber: v.replace(/\D/g, '') }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-ch-gray mb-1">País</label>
                <input value="Colombia" disabled className="w-full px-3 py-2 bg-ch-medium-gray border border-ch-gray/30 rounded-md opacity-70" />
              </div>
            </div>

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
