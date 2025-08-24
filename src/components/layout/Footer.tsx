import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-ch-black border-t border-ch-gray/20 py-12 lg:py-16">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Logo y descripción */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <img
                src="https://iqeuktsyzrkrbkjiqfvy.supabase.co/storage/v1/object/public/images/Captura%20de%20pantalla%202025-08-11%20a%20la(s)%209.37.27%20p.m..png"
                alt="CH+"
                className="w-12 h-12 object-contain rounded-lg"
              />
              <span className="text-xl font-secondary text-white">CH+</span>
            </div>
            <p className="text-ch-gray text-sm leading-relaxed mb-4">
              Suplementos premium de creatina y proteína diseñados para atletas colombianos que exigen resultados reales y calidad certificada.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-ch-gray hover:text-ch-primary transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-ch-gray hover:text-ch-primary transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-ch-gray hover:text-ch-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Enlaces rápidos */}
          <div>
            <h3 className="text-white font-semibold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-ch-gray hover:text-white transition-colors text-sm">
                  Inicio
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-ch-gray hover:text-white transition-colors text-sm">
                  Productos
                </Link>
              </li>
              <li>
                <a href="#about" className="text-ch-gray hover:text-white transition-colors text-sm">
                  Nosotros
                </a>
              </li>
              <li>
                <a href="#pqrs" className="text-ch-gray hover:text-white transition-colors text-sm">
                  Preguntas Frecuentes
                </a>
              </li>
            </ul>
          </div>

          {/* Información de contacto */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contacto</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-ch-primary mt-0.5 flex-shrink-0" />
                <span className="text-ch-gray text-sm">hola@chplus.com.co</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-ch-primary mt-0.5 flex-shrink-0" />
                <span className="text-ch-gray text-sm">+57 300 XXX XXXX</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-ch-primary mt-0.5 flex-shrink-0" />
                <span className="text-ch-gray text-sm">Bogotá, Colombia</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Línea divisoria */}
        <div className="border-t border-ch-gray/20 mt-8 lg:mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-ch-gray/70 text-sm">
              © 2025 CH+ Supplements. Todos los derechos reservados.
            </p>
            <p className="text-ch-gray/70 text-sm">
              Certificado INVIMA • Calidad Premium • Hecho en Colombia
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}