
// =============================================
// src/data/paymentMethods.ts
// =============================================
import { PaymentMethod } from "../types/payment";

export const paymentMethods: PaymentMethod[] = [
  { id: 'visa', name: 'Visa', type: 'credit_card', icon: '💳', installments: [1,3,6,12,18,24], description: 'Tarjeta de crédito Visa' },
  { id: 'mastercard', name: 'Mastercard', type: 'credit_card', icon: '💳', installments: [1,3,6,12,18,24], description: 'Tarjeta de crédito Mastercard' },
  { id: 'american_express', name: 'American Express', type: 'credit_card', icon: '💳', installments: [1,3,6,12], description: 'Tarjeta de crédito American Express' },
  { id: 'debit_card', name: 'Tarjeta de Débito', type: 'debit_card', icon: '💳', installments: [1], description: 'Pago con tarjeta de débito' },
  { id: 'mercadopago', name: 'Mercado Pago', type: 'digital_wallet', icon: '💰', installments: [1,3,6,12], description: 'Billetera digital Mercado Pago' },
  { id: 'bank_transfer', name: 'Transferencia Bancaria', type: 'bank_transfer', icon: '🏦', installments: [1], description: 'Transferencia bancaria directa' },
  { id: 'rapipago', name: 'Rapipago', type: 'cash', icon: '🏪', installments: [1], description: 'Pago en efectivo en Rapipago' },
  { id: 'pagofacil', name: 'Pago Fácil', type: 'cash', icon: '🏪', installments: [1], description: 'Pago en efectivo en Pago Fácil' }
]
