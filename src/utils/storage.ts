// =============================================
// src/utils/storage.ts
// =============================================
export const load = <T,>(key: string, fallback: T): T => {
  try { return JSON.parse(localStorage.getItem(key) || '') as T } catch { return fallback }
}
export const save = (key: string, value: unknown) => localStorage.setItem(key, JSON.stringify(value))
