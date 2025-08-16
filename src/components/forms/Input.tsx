/**
 * Input controlado reutilizable para formularios.
 */
type InputProps = {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  required?: boolean
  placeholder?: string
}

export default function Input({ label, value, onChange, type='text', required=true, placeholder }: InputProps) {
  return (
    <div>
      <label className="block text-sm text-ch-gray mb-1">{label}</label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={e=>onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 bg-ch-medium-gray border border-ch-gray/30 rounded-md"
      />
    </div>
  )
}


