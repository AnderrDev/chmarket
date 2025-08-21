import type { AdminProduct } from '../../../data/entities/admin'
import type { AdminProductRepository } from '../../repositories/admin/AdminProductRepository'

export class UpsertAdminProductUseCase {
  constructor(private readonly repository: AdminProductRepository) {}

  execute(payload: { product: Partial<AdminProduct> & { slug: string; name: string; type: 'creatine' | 'protein' }, variants: Array<Partial<AdminProduct['variants'][number]> & { sku: string; label: string; price_cents: number; in_stock: number }>, default_stock?: number, default_label?: string }) {
    return this.repository.upsert(payload)
  }
}


