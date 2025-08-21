import React from 'react'
import type { ProductFormState } from './ProductForm'

type Props = {
  form: ProductFormState
  setForm: React.Dispatch<React.SetStateAction<ProductFormState>>
  nutritionText: string
  setNutritionText: (v: string) => void
  nutritionError: string | null
  slugAvailable: boolean
  skuAvailable: Record<number, boolean>
  saving: boolean
  featureInput: string
  setFeatureInput: (v: string) => void
  ingredientInput: string
  setIngredientInput: (v: string) => void
  updateVariant: (idx: number, patch: Partial<ProductFormState['variants'][number]>) => void
  addVariant: () => void
  removeVariant: (idx: number) => void
  onPickImages: (e: React.ChangeEvent<HTMLInputElement>) => void
  removeImage: (idx: number) => void
  addFeature: () => void
  removeFeature: (idx: number) => void
  addIngredient: () => void
  removeIngredient: (idx: number) => void
  onCancel: () => void
  onSubmit: () => void
}

export default function ProductFormView(props: Props) {
  const { form, setForm, nutritionText, setNutritionText, nutritionError, slugAvailable, skuAvailable, saving, featureInput, setFeatureInput, ingredientInput, setIngredientInput, updateVariant, addVariant, removeVariant, onPickImages, removeImage, addFeature, removeFeature, addIngredient, removeIngredient, onCancel, onSubmit } = props

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit() }} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <label className="space-y-1">
          <span className="text-xs text-white/70">Nombre</span>
          <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full px-2 py-1 rounded bg-white/10" required />
        </label>
        <div className="text-xs">{!slugAvailable && <span className="text-red-400">Slug no disponible</span>}</div>
        <label className="space-y-1">
          <span className="text-xs text-white/70">Slug</span>
          <input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} className="w-full px-2 py-1 rounded bg-white/10" required />
        </label>
        <label className="space-y-1">
          <span className="text-xs text-white/70">Tipo</span>
          <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as any }))} className="w-full px-2 py-1 rounded bg-white/10">
            <option value="creatine">Creatine</option>
            <option value="protein">Protein</option>
          </select>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.hasVariants}
            onChange={e => setForm(f => {
              const next = { ...f, hasVariants: e.target.checked }
              if (e.target.checked) {
                const current = [...(f.variants || [])]
                if (current.length === 0) {
                  current.push({ sku: '', label: 'Default', price_cents: f.price_cents || 0, compare_at_price_cents: f.compare_at_price_cents, currency: f.currency || 'COP', in_stock: f.default_stock ?? 0, is_active: true })
                  current.push({ sku: '', label: '', price_cents: f.price_cents || 0, compare_at_price_cents: undefined, currency: f.currency || 'COP', in_stock: f.default_stock ?? 0, is_active: true })
                } else if (current.length === 1) {
                  current.push({ sku: '', label: '', price_cents: current[0].price_cents, compare_at_price_cents: undefined, currency: current[0].currency, in_stock: current[0].in_stock, is_active: true })
                }
                ;(next as any).variants = current
              }
              return next
            })}
          />
          <span>Tiene variantes</span>
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={form.is_active} onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))} />
          <span>Activo</span>
        </label>
        <label className="space-y-1">
          <span className="text-xs text-white/70">Precio producto (cents)</span>
          <input type="number" value={form.price_cents ?? ''} onChange={e => setForm(f => ({ ...f, price_cents: e.target.value === '' ? undefined : Number(e.target.value) }))} className="w-full px-2 py-1 rounded bg-white/10" />
        </label>
        <label className="space-y-1">
          <span className="text-xs text-white/70">Compare-at (cents)</span>
          <input type="number" value={form.compare_at_price_cents ?? ''} onChange={e => setForm(f => ({ ...f, compare_at_price_cents: e.target.value === '' ? undefined : Number(e.target.value) }))} className="w-full px-2 py-1 rounded bg-white/10" />
        </label>
        <label className="space-y-1">
          <span className="text-xs text-white/70">Moneda</span>
          <select value={form.currency ?? 'COP'} onChange={e => setForm(f => ({ ...f, currency: e.target.value }))} className="w-full px-2 py-1 rounded bg-white/10">
            <option value="COP">COP</option>
          </select>
        </label>
        <label className="space-y-1 col-span-2">
          <span className="text-xs text-white/70">Descripción corta</span>
          <textarea value={form.description || ''} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="w-full px-2 py-1 rounded bg-white/10 min-h-20" />
        </label>
        <label className="space-y-1 col-span-2">
          <span className="text-xs text-white/70">Descripción larga</span>
          <textarea value={form.long_description || ''} onChange={e => setForm(f => ({ ...f, long_description: e.target.value }))} className="w-full px-2 py-1 rounded bg-white/10 min-h-28" />
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={form.is_featured} onChange={e => setForm(f => ({ ...f, is_featured: e.target.checked }))} />
          <span>Destacado</span>
        </label>
      </div>

      <div className="space-y-2">
        <div className="space-y-2">
          <div className="font-medium">Características</div>
          <div className="flex flex-wrap gap-2">
            {(form.features || []).map((t, idx) => (
              <span key={idx} className="inline-flex items-center gap-1 text-xs bg-white/10 rounded px-2 py-1">
                {t}
                <button type="button" onClick={() => removeFeature(idx)} className="text-white/60">x</button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input value={featureInput} onChange={e => setFeatureInput(e.target.value)} className="flex-1 px-2 py-1 rounded bg-white/10" placeholder="Nueva característica" />
            <button type="button" onClick={addFeature} className="px-2 py-1 rounded bg-white text-black">Agregar</button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="font-medium">Ingredientes</div>
          <div className="flex flex-wrap gap-2">
            {(form.ingredients || []).map((t, idx) => (
              <span key={idx} className="inline-flex items-center gap-1 text-xs bg-white/10 rounded px-2 py-1">
                {t}
                <button type="button" onClick={() => removeIngredient(idx)} className="text-white/60">x</button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input value={ingredientInput} onChange={e => setIngredientInput(e.target.value)} className="flex-1 px-2 py-1 rounded bg-white/10" placeholder="Nuevo ingrediente" />
            <button type="button" onClick={addIngredient} className="px-2 py-1 rounded bg-white text-black">Agregar</button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="font-medium">Nutrition Facts (JSON)</div>
          <textarea value={nutritionText} onChange={e => setNutritionText(e.target.value)} className="w-full px-2 py-1 rounded bg-white/10 min-h-32 font-mono text-xs" />
          {nutritionError && <div className="text-red-400 text-xs">{nutritionError}</div>}
        </div>

        <div className="space-y-2">
          <div className="font-medium">Imágenes</div>
          <div className="flex flex-wrap gap-3">
            {(form.images || []).map((url, idx) => (
              <div key={idx} className="relative w-24 h-24 border border-white/10 rounded overflow-hidden">
                <img src={url} alt="" className="w-full h-full object-cover" />
                <button type="button" onClick={() => removeImage(idx)} className="absolute top-1 right-1 bg-black/70 text-white text-xs px-1 rounded">x</button>
              </div>
            ))}
            <label className="w-24 h-24 border border-dashed border-white/20 rounded flex items-center justify-center cursor-pointer text-xs text-white/70">
              <input type="file" multiple accept="image/*" className="hidden" onChange={onPickImages} />
              + Añadir
            </label>
          </div>
        </div>

        {form.hasVariants ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="font-medium">Variantes</div>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => setForm(f => ({ ...f, variants: f.variants.map(v => ({ ...v, in_stock: 0 })) }))} className="px-2 py-1 rounded border border-white/20">Poner stock 0</button>
                <button type="button" onClick={addVariant} className="px-2 py-1 rounded bg-white text-black">Agregar variante</button>
              </div>
            </div>
            {form.variants.map((v, idx) => (
              <div key={idx} className="grid grid-cols-8 gap-2 items-end border border-white/10 p-2 rounded">
                <label className="space-y-1 col-span-2">
                  <span className="text-xs text-white/70">SKU</span>
                  <input value={v.sku} onChange={e => updateVariant(idx, { sku: e.target.value })} className="w-full px-2 py-1 rounded bg-white/10" required />
                </label>
                <div className="col-span-2 text-xs">{skuAvailable[idx] === false && <span className="text-red-400">SKU no disponible</span>}</div>
                <label className="space-y-1 col-span-2">
                  <span className="text-xs text-white/70">Etiqueta</span>
                  <input value={v.label} onChange={e => updateVariant(idx, { label: e.target.value })} className="w-full px-2 py-1 rounded bg-white/10" required />
                </label>
                <label className="space-y-1">
                  <span className="text-xs text-white/70">Precio (cents)</span>
                  <input type="number" value={v.price_cents} onChange={e => updateVariant(idx, { price_cents: Number(e.target.value) })} className="w-full px-2 py-1 rounded bg-white/10" required />
                </label>
                <label className="space-y-1">
                  <span className="text-xs text-white/70">Compare-at</span>
                  <input type="number" value={v.compare_at_price_cents ?? ''} onChange={e => updateVariant(idx, { compare_at_price_cents: e.target.value === '' ? undefined : Number(e.target.value) })} className="w-full px-2 py-1 rounded bg-white/10" />
                </label>
                <label className="space-y-1">
                  <span className="text-xs text-white/70">Stock</span>
                  <input type="number" value={v.in_stock} onChange={e => updateVariant(idx, { in_stock: Number(e.target.value) })} className="w-full px-2 py-1 rounded bg-white/10" required />
                </label>
                <div className="flex items-center gap-2 col-span-8">
                  <input type="checkbox" checked={v.is_active} onChange={e => updateVariant(idx, { is_active: e.target.checked })} />
                  <span className="text-sm">Activo</span>
                  <button type="button" onClick={() => removeVariant(idx)} className="ml-auto px-2 py-1 rounded bg-red-500 text-white">Quitar</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <label className="space-y-1">
              <span className="text-xs text-white/70">Stock inicial</span>
              <input type="number" value={form.default_stock ?? 0} onChange={e => setForm(f => ({ ...f, default_stock: Number(e.target.value) }))} className="w-full px-2 py-1 rounded bg-white/10" />
            </label>
          </div>
        )}
      </div>

      <div className="flex items-center justify-end gap-2">
        <button type="button" onClick={onCancel} className="px-3 py-2 rounded border border-white/20">Cancelar</button>
        <button type="submit" disabled={saving} className="px-3 py-2 rounded bg-white text-black disabled:opacity-60">{saving ? 'Guardando…' : 'Guardar'}</button>
      </div>
    </form>
  )
}


