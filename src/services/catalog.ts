// src/services/catalog.ts
import { createClient } from '@supabase/supabase-js'
import { CatalogProduct } from '../types/catalog'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL as string,
  import.meta.env.VITE_SUPABASE_ANON_KEY as string
)

/**
 * Lista productos públicos del catálogo desde la vista `catalog_public`.
 *
 * - Lee de Supabase usando URL y ANON KEY del entorno.
 * - Devuelve como `CatalogProduct[]` crudo (se puede adaptar con `catalogAdapter`).
 */
export async function listCatalog(limit = 20): Promise<CatalogProduct[]> {
  const { data, error } = await supabase
    .from('catalog_public')
    .select('*')
    .limit(limit)

  if (error) throw error
  return (data || []) as CatalogProduct[]
}

/**
 * Obtiene un producto del catálogo por su `variant_id`.
 */
export async function getByVariantId(variant_id: string): Promise<CatalogProduct> {
  const { data, error } = await supabase
    .from('catalog_public')
    .select('*')
    .eq('variant_id', variant_id)
    .single()

  if (error) throw error
  return data as CatalogProduct
}
