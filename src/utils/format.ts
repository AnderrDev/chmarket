// =============================================
// src/utils/format.ts
// =============================================
export const currency = (n: number, locale = 'es-CO', curr = 'COP') =>
  new Intl.NumberFormat(locale, { style: 'currency', currency: curr, maximumFractionDigits: 2 }).format(n)

export const formatCardNumber = (value: string) => value
  .replace(/\s+/g, '')
  .replace(/[^0-9]/g, '')
  .replace(/(.{4})/g, '$1 ') // 4-4-4-4
  .trim()

export const formatExpiryDate = (value: string) => {
  const v = value.replace(/\D/g, '').slice(0, 4)
  return v.length >= 3 ? `${v.slice(0,2)}/${v.slice(2)}` : v
}