import React from 'react'
import { uploadProductImageUseCase, validateUniquenessUseCase, upsertAdminProductUseCase } from '../container'
import type { ProductFormState } from '../pages/admin/ProductForm'

export function useProductForm(initial?: ProductFormState) {
  const [form, setForm] = React.useState<ProductFormState>(initial || {
    slug: '', name: '', type: 'creatine', is_active: true, is_featured: false, images: [], features: [], ingredients: [], nutrition_facts: {}, currency: 'COP', hasVariants: false, default_stock: 0, variants: []
  })
  const [nutritionText, setNutritionText] = React.useState<string>(() => {
    try { return JSON.stringify(initial?.nutrition_facts ?? {}, null, 2) } catch { return '{}' }
  })
  const [nutritionError, setNutritionError] = React.useState<string | null>(null)
  const [slugAvailable, setSlugAvailable] = React.useState(true)
  const [skuAvailable, setSkuAvailable] = React.useState<Record<number, boolean>>({})
  const [saving, setSaving] = React.useState(false)
  const [featureInput, setFeatureInput] = React.useState('')
  const [ingredientInput, setIngredientInput] = React.useState('')

  React.useEffect(() => {
    const t = setTimeout(async () => {
      if (!form.slug) return
      const ok = await validateUniquenessUseCase.isSlugAvailable(form.slug, form.id)
      setSlugAvailable(ok)
    }, 300)
    return () => clearTimeout(t)
  }, [form.slug, form.id])

  function updateVariant(idx: number, patch: Partial<ProductFormState['variants'][number]>) {
    setForm(f => {
      const variants = [...f.variants]
      variants[idx] = { ...variants[idx], ...patch }
      return { ...f, variants }
    })
    if (form.hasVariants && patch.sku !== undefined) {
      const sku = patch.sku
      const variantId = form.variants[idx]?.id
      const doCheck = async () => {
        const ok = await validateUniquenessUseCase.isSkuAvailable(String(sku), variantId)
        setSkuAvailable(prev => ({ ...prev, [idx]: ok }))
      }
      window.setTimeout(doCheck, 250)
    }
  }

  function addVariant() {
    setForm(f => ({ ...f, variants: [...f.variants, { sku: '', label: '', price_cents: 0, in_stock: 0, is_active: true }] }))
  }
  function removeVariant(idx: number) {
    setForm(f => ({ ...f, variants: f.variants.filter((_, i) => i !== idx) }))
  }

  async function onPickImages(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files || files.length === 0) return
    const urls: string[] = []
    for (const file of Array.from(files)) {
      const { url } = await uploadProductImageUseCase.execute({ file, folder: 'products' })
      urls.push(url)
    }
    setForm(f => ({ ...f, images: [...(f.images || []), ...urls] }))
  }
  function removeImage(idx: number) {
    setForm(f => ({ ...f, images: (f.images || []).filter((_, i) => i !== idx) }))
  }

  function addFeature() {
    const val = featureInput.trim()
    if (!val) return
    setForm(f => ({ ...f, features: [...(f.features || []), val] }))
    setFeatureInput('')
  }
  function removeFeature(idx: number) {
    setForm(f => ({ ...f, features: (f.features || []).filter((_, i) => i !== idx) }))
  }
  function addIngredient() {
    const val = ingredientInput.trim()
    if (!val) return
    setForm(f => ({ ...f, ingredients: [...(f.ingredients || []), val] }))
    setIngredientInput('')
  }
  function removeIngredient(idx: number) {
    setForm(f => ({ ...f, ingredients: (f.ingredients || []).filter((_, i) => i !== idx) }))
  }

  async function save() {
    if (!slugAvailable) throw new Error('Slug no disponible')
    if (form.hasVariants) {
      for (let i = 0; i < form.variants.length; i++) {
        if (skuAvailable[i] === false) throw new Error(`SKU repetido en variante ${i + 1}`)
      }
    }
    let nutritionParsed: Record<string, any> = {}
    try {
      nutritionParsed = nutritionText?.trim() ? JSON.parse(nutritionText) : {}
      setNutritionError(null)
    } catch {
      setNutritionError('JSON inválido en Nutrition Facts')
      throw new Error('JSON inválido en Nutrition Facts')
    }

    setSaving(true)
    try {
      await upsertAdminProductUseCase.execute({
        product: {
          id: form.id,
          slug: form.slug,
          name: form.name,
          type: form.type,
          is_active: form.is_active,
          is_featured: form.is_featured,
          images: form.images,
          description: form.description,
          long_description: form.long_description,
          features: form.features,
          ingredients: form.ingredients,
          nutrition_facts: nutritionParsed,
          price_cents: form.price_cents,
          compare_at_price_cents: form.compare_at_price_cents,
          currency: form.currency,
        },
        variants: form.hasVariants ? form.variants : [],
        default_stock: form.hasVariants ? undefined : (form.default_stock ?? 0),
        default_label: form.hasVariants ? undefined : 'Default',
      })
    } finally {
      setSaving(false)
    }
  }

  return {
    form,
    setForm,
    nutritionText,
    setNutritionText,
    nutritionError,
    slugAvailable,
    skuAvailable,
    saving,
    featureInput,
    setFeatureInput,
    ingredientInput,
    setIngredientInput,
    updateVariant,
    addVariant,
    removeVariant,
    onPickImages,
    removeImage,
    addFeature,
    removeFeature,
    addIngredient,
    removeIngredient,
    save,
  }
}


