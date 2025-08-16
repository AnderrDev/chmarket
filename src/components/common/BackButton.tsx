import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

type BackButtonProps = {
  label?: string
  className?: string
}

export default function BackButton({ label = 'Volver', className = '' }: BackButtonProps) {
  const navigate = useNavigate()
  return (
    <button onClick={() => navigate(-1)} className={`inline-flex items-center text-ch-primary ${className}`}>
      <ArrowLeft className="w-5 h-5 mr-2" /> {label}
    </button>
  )
}


