// src/services/catalog.ts
import { createClient } from '@supabase/supabase-js'
import { CatalogProduct } from '../types/catalog'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
)

export async function listCatalog(limit = 20) {
  const { data, error } = await supabase
    .from('catalog_public')
    .select('*')
    .limit(limit)

  if (error) throw error
  return (data || []) as CatalogProduct[]
}

export async function getByVariantId(variant_id: string) {
  const { data, error } = await supabase
    .from('catalog_public')
    .select('*')
    .eq('variant_id', variant_id)
    .single()

  if (error) throw error
  return data as CatalogProduct
}
