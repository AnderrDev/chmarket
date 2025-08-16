import { useState } from 'react'

/**
 * Galería de imágenes de producto.
 * - SRP: mostrar imagen activa y miniaturas.
 */
type ProductGalleryProps = {
  images: string[]
  alt: string
}

export default function ProductGallery({ images, alt }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  if (!images.length) return null

  return (
    <div>
      <div className="relative overflow-hidden rounded-2xl bg-ch-dark-gray">
        <img src={images[activeIndex]} alt={alt} className="w-full h-96 object-cover" />
      </div>
      <div className="flex gap-4 mt-4 overflow-x-auto pb-2">
        {images.map((src, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${activeIndex===i?'border-ch-primary':'border-ch-gray/30'}`}
          >
            <img src={src} alt={`${alt} ${i+1}`} className="w-full h-full object-cover"/>
          </button>
        ))}
      </div>
    </div>
  )
}


