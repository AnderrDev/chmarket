import { supabase } from '../../lib/supabase'

export interface AdminValidationDataSource {
  isSlugAvailable(slug: string, excludeProductId?: string): Promise<boolean>
  isSkuAvailable(sku: string, excludeVariantId?: string): Promise<boolean>
}

export class SupabaseAdminValidationDataSource implements AdminValidationDataSource {
  async isSlugAvailable(slug: string, excludeProductId?: string): Promise<boolean> {
    const q = supabase.from('products').select('id').eq('slug', slug).limit(1)
    const { data, error } = await q
    if (error) throw error
    const exists = Array.isArray(data) && data.length > 0 && (!excludeProductId || data[0].id !== excludeProductId)
    return !exists
  }

  async isSkuAvailable(sku: string, excludeVariantId?: string): Promise<boolean> {
    const q = supabase.from('product_variants').select('id').eq('sku', sku).limit(1)
    const { data, error } = await q
    if (error) throw error
    const exists = Array.isArray(data) && data.length > 0 && (!excludeVariantId || data[0].id !== excludeVariantId)
    return !exists
  }
}


