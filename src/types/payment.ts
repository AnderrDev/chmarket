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
