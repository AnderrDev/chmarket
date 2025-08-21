import React from 'react'
import { useToast } from '../../context/ToastContext'
import ProductFormView from './ProductFormView'
import { useProductForm } from '../../hooks/useProductForm'

export type ProductFormState = {
  id?: string
  slug: string
  name: string
  type: 'creatine' | 'protein'
  is_active: boolean
  images?: string[]
  description?: string
  long_description?: string
  is_featured: boolean
  features: string[]
  ingredients: string[]
  nutrition_facts?: Record<string, any>
  price_cents?: number
  compare_at_price_cents?: number
  currency?: string
  hasVariants: boolean
  default_stock?: number
  variants: Array<{ id?: string; sku: string; label: string; price_cents: number; compare_at_price_cents?: number; currency?: string; in_stock: number; is_active: boolean }>
}

type ProductFormProps = {
  initial?: ProductFormState
  onCancel: () => void
  onSaved: () => Promise<void> | void
}

export default function ProductForm({ initial, onCancel, onSaved }: ProductFormProps) {
  const { showToast } = useToast()
  const hook = useProductForm(initial)

  async function handleSubmit() {
    try {
      await hook.save()
      showToast(hook.form.id ? 'Producto actualizado' : 'Producto creado', { type: 'success' })
      await onSaved()
    } catch (err: any) {
      if (err?.message) showToast(err.message, { type: 'error' })
      else showToast('No se pudo guardar', { type: 'error' })
    }
  }

  return (
    <ProductFormView
      form={hook.form}
      setForm={hook.setForm}
      nutritionText={hook.nutritionText}
      setNutritionText={hook.setNutritionText}
      nutritionError={hook.nutritionError}
      slugAvailable={hook.slugAvailable}
      skuAvailable={hook.skuAvailable}
      saving={hook.saving}
      featureInput={hook.featureInput}
      setFeatureInput={hook.setFeatureInput}
      ingredientInput={hook.ingredientInput}
      setIngredientInput={hook.setIngredientInput}
      updateVariant={hook.updateVariant}
      addVariant={hook.addVariant}
      removeVariant={hook.removeVariant}
      onPickImages={hook.onPickImages}
      removeImage={hook.removeImage}
      addFeature={hook.addFeature}
      removeFeature={hook.removeFeature}
      addIngredient={hook.addIngredient}
      removeIngredient={hook.removeIngredient}
      onCancel={onCancel}
      onSubmit={handleSubmit}
    />
  )
}


