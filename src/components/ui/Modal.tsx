import React from 'react'

type ModalProps = {
  open: boolean
  title?: string
  onClose: () => void
  children: React.ReactNode
  footer?: React.ReactNode
  maxWidthClassName?: string
}

export default function Modal({ open, title, onClose, children, footer, maxWidthClassName = 'max-w-3xl' }: ModalProps) {
  React.useEffect(() => {
    if (!open) return
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 bg-black/70 overflow-y-auto" onMouseDown={onClose}>
      <div className="min-h-full flex items-start justify-center p-4" onMouseDown={e => e.stopPropagation()}>
        <div className={`bg-ch-black border border-white/10 rounded p-4 w-full ${maxWidthClassName} max-h-[90vh] overflow-y-auto space-y-4`}>
          {title ? <div className="text-lg font-semibold">{title}</div> : null}
          <div>{children}</div>
          {footer ? (
            <div className="flex items-center justify-end gap-2">
              {footer}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}


