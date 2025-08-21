import React from 'react'
import Modal from './Modal'

type ConfirmDialogProps = {
  open: boolean
  title?: string
  description?: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'default'
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmDialog({ open, title = 'Confirmar', description, confirmText = 'Confirmar', cancelText = 'Cancelar', variant = 'default', onConfirm, onCancel }: ConfirmDialogProps) {
  return (
    <Modal open={open} title={title} onClose={onCancel} maxWidthClassName="max-w-md" footer={(
      <>
        <button type="button" onClick={onCancel} className="px-3 py-2 rounded border border-white/20">{cancelText}</button>
        <button type="button" onClick={onConfirm} className={`px-3 py-2 rounded ${variant === 'danger' ? 'bg-red-500 text-white' : 'bg-white text-black'}`}>{confirmText}</button>
      </>
    )}>
      {description ? <p className="text-white/80 text-sm">{description}</p> : null}
    </Modal>
  )
}


