// =============================================
// src/types/payment.ts
// =============================================
export type PaymentKind = 'credit_card' | 'debit_card' | 'bank_transfer' | 'cash' | 'digital_wallet'

export interface PaymentMethod {
  id: string
  name: string
  type: PaymentKind
  icon: string
  installments?: number[]
  description: string
}

// Nota: El nuevo flujo usa redirección a Mercado Pago y no persiste datos sensibles en el front.
// Mantenemos esta interfaz solo si tu UI la utiliza localmente (no se envía al backend).
export interface PaymentInfo {
  method: string
  installments: number
  cardNumber: string
  cardName: string
  expiryDate: string
  cvv: string
  documentType: string
  documentNumber: string
}


