import React, { createContext, useContext, useMemo, useRef, useState } from 'react'

type ToastType = 'success' | 'error' | 'info'

type Toast = {
  id: number
  message: string
  type: ToastType
  duration: number
}

type ToastContextType = {
  showToast: (message: string, options?: { type?: ToastType; duration?: number }) => void
}

const ToastContext = createContext<ToastContextType | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const idRef = useRef(0)

  const showToast = (message: string, options?: { type?: ToastType; duration?: number }) => {
    const id = ++idRef.current
    const toast: Toast = {
      id,
      message,
      type: options?.type || 'success',
      duration: options?.duration ?? 2500,
    }
    setToasts(prev => [...prev, toast])
    window.setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, toast.duration)
  }

  const value = useMemo<ToastContextType>(() => ({ showToast }), [])

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* Container visual de toasts */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map(t => (
          <div
            key={t.id}
            className={[
              'min-w-[240px] max-w-[360px] rounded-lg shadow-lg border px-4 py-3 text-sm',
              'bg-ch-dark-gray border-ch-gray/30 text-white',
              t.type === 'success' ? 'border-l-4 border-l-green-400' : '',
              t.type === 'error' ? 'border-l-4 border-l-red-400' : '',
              t.type === 'info' ? 'border-l-4 border-l-blue-400' : '',
            ].join(' ')}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast debe usarse dentro de ToastProvider')
  return ctx
}


