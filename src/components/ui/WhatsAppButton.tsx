import { MessageCircle } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function WhatsAppButton() {
  const [isHovered, setIsHovered] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  
  const phoneNumber = '+573012244006'
  const defaultMessage = encodeURIComponent('Hola! Me interesa conocer más sobre los productos de CH+. ¿Podrían ayudarme?')
  
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${defaultMessage}`

  // Mostrar el botón después de un pequeño delay para mejor UX
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 1000)
    
    return () => clearTimeout(timer)
  }, [])

  if (!isVisible) return null

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative block"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-label="Contactar por WhatsApp"
      >
        {/* Botón principal */}
        <div className="w-16 h-16 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-2xl hover:shadow-green-500/25 transition-all duration-300 transform hover:scale-110 cursor-pointer">
          <MessageCircle className="w-8 h-8 text-white" />
        </div>
        
        {/* Tooltip */}
        {isHovered && (
          <div className="absolute bottom-full right-0 mb-4 px-4 py-3 bg-ch-dark-gray text-white text-sm rounded-xl shadow-2xl border border-ch-gray/20 whitespace-nowrap animate-in fade-in duration-200">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="font-medium">¿Necesitas ayuda?</span>
            </div>
            <div className="text-ch-gray text-xs mt-1">
              Chatea con nosotros en WhatsApp
            </div>
            {/* Flecha del tooltip */}
            <div className="absolute top-full right-5 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-ch-dark-gray"></div>
          </div>
        )}
        
        {/* Efecto de pulso */}
        <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-30"></div>
        
        {/* Efecto de brillo */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-600 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
      </a>
    </div>
  )
}
