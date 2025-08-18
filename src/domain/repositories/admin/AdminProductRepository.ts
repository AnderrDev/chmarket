import type { AdminProduct } from '../../../data/entities/admin'

export interface AdminProductRepository {
  list(): Promise<{ items: AdminProduct[] }>
  upsert(payload: { product: Partial<AdminProduct> & { slug: string; name: string; type: 'creatine' | 'protein' }, variants: Array<Partial<AdminProduct['variants'][number]> & { sku: string; label: string; price_cents: number; in_stock: number }> }): Promise<{ ok: boolean; product_id: string }>
  remove(id: string): Promise<{ ok: boolean }>
}


