import { useState, useEffect, useRef } from 'react'
import Skeleton from './Skeleton'

interface OptimizedImageProps {
  src: string
  alt: string
  className?: string
  fallbackSrc?: string
  loading?: 'lazy' | 'eager'
  sizes?: string
  priority?: boolean
  onLoad?: () => void
  onError?: () => void
}

export default function OptimizedImage({
  src,
  alt,
  className = '',
  fallbackSrc = '/placeholder-product.svg',
  loading = 'lazy',
  sizes,
  priority = false,
  onLoad,
  onError
}: OptimizedImageProps) {
  const [imageSrc, setImageSrc] = useState<string>(src)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [hasError, setHasError] = useState<boolean>(false)
  const [isLoaded, setIsLoaded] = useState<boolean>(false)
  const imgRef = useRef<HTMLImageElement>(null)

  // Reset state when src changes
  useEffect(() => {
    setImageSrc(src)
    setIsLoading(true)
    setHasError(false)
    setIsLoaded(false)
  }, [src])

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!priority && loading === 'lazy' && imgRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const img = entry.target as HTMLImageElement
              img.src = imageSrc
              observer.unobserve(img)
            }
          })
        },
        {
          rootMargin: '50px 0px', // Start loading 50px before the image enters viewport
          threshold: 0.01
        }
      )

      observer.observe(imgRef.current)

      return () => {
        if (imgRef.current) {
          observer.unobserve(imgRef.current)
        }
      }
    }
  }, [imageSrc, priority, loading])

  const handleLoad = () => {
    setIsLoading(false)
    setIsLoaded(true)
    onLoad?.()
  }

  const handleError = () => {
    setIsLoading(false)
    setHasError(true)
    
    // Try fallback if not already using it
    if (imageSrc !== fallbackSrc) {
      setImageSrc(fallbackSrc)
      setIsLoading(true)
      setHasError(false)
    } else {
      onError?.()
    }
  }

  // If priority is true, load immediately
  const finalSrc = priority ? imageSrc : (loading === 'lazy' ? '' : imageSrc)

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Skeleton loading */}
      {isLoading && (
        <Skeleton className="absolute inset-0 z-10" />
      )}
      
      {/* Image */}
      <img
        ref={imgRef}
        src={finalSrc}
        alt={alt}
        className={`transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } ${className}`}
        loading={loading}
        sizes={sizes}
        onLoad={handleLoad}
        onError={handleError}
        style={{
          // Prevent layout shift
          aspectRatio: '1',
          objectFit: 'cover'
        }}
      />
      
      {/* Error state */}
      {hasError && imageSrc === fallbackSrc && (
        <div className="absolute inset-0 bg-ch-medium-gray flex items-center justify-center">
          <div className="text-center text-ch-gray">
            <div className="w-12 h-12 mx-auto mb-2 bg-ch-gray/20 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-sm">Sin imagen</p>
          </div>
        </div>
      )}
    </div>
  )
}
