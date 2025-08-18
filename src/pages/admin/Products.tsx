import React from 'react'
import type { AdminProduct } from '../../data/entities/admin'
import { listAdminProductsUseCase, upsertAdminProductUseCase, deleteAdminProductUseCase, uploadProductImageUseCase, validateUniquenessUseCase } from '../../container'

type FormState = {
  id?: string
  slug: string
  name: string
  type: 'creatine' | 'protein'
  is_active: boolean
  images?: string[]
  variants: Array<{ id?: string; sku: string; label: string; price_cents: number; in_stock: number; is_active: boolean }>
}

export default function Products() {
  const [loading, setLoading] = React.useState(true)
  const [items, setItems] = React.useState<AdminProduct[]>([])
  const [error, setError] = React.useState<string | null>(null)
  const [formOpen, setFormOpen] = React.useState(false)
  const [form, setForm] = React.useState<FormState>({ slug: '', name: '', type: 'creatine', is_active: true, images: [], variants: [] })
  const [slugAvailable, setSlugAvailable] = React.useState(true)
  const [skuAvailable, setSkuAvailable] = React.useState<Record<number, boolean>>({})

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const { items } = await listAdminProductsUseCase.execute()
      setItems(items)
    } catch (e: any) {
      setError(e?.message || 'Error al cargar')
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => { load() }, [])

  function startCreate() {
    setForm({ slug: '', name: '', type: 'creatine', is_active: true, images: [], variants: [] })
    setSlugAvailable(true)
    setSkuAvailable({})
    setFormOpen(true)
  }
  function startEdit(p: AdminProduct) {
    setForm({
      id: p.id,
      slug: p.slug,
      name: p.name,
      type: p.type,
      is_active: p.is_active,
      images: Array.isArray(p.images) ? (p.images as string[]) : [],
      variants: p.variants.map(v => ({ id: v.id, sku: v.sku, label: v.label, price_cents: v.price_cents, in_stock: v.in_stock, is_active: v.is_active })),
    })
    setSlugAvailable(true)
    setSkuAvailable({})
    setFormOpen(true)
  }
  React.useEffect(() => {
    if (!formOpen) return
    const t = setTimeout(async () => {
      const ok = await validateUniquenessUseCase.isSlugAvailable(form.slug, form.id)
      setSlugAvailable(ok)
    }, 350)
    return () => clearTimeout(t)
  }, [form.slug, form.id, formOpen])
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
  async function remove(id: string) {
    if (!confirm('¿Eliminar producto?')) return
    await deleteAdminProductUseCase.execute(id)
    await load()
  }
  function updateVariant(idx: number, patch: Partial<FormState['variants'][number]>) {
    setForm(f => {
      const variants = [...f.variants]
      variants[idx] = { ...variants[idx], ...patch }
      return { ...f, variants }
    })
    if (patch.sku !== undefined) {
      const sku = patch.sku
      const variantId = form.variants[idx]?.id
      const doCheck = async () => {
        const ok = await validateUniquenessUseCase.isSkuAvailable(String(sku), variantId)
        setSkuAvailable(prev => ({ ...prev, [idx]: ok }))
      }
      // debounce local
      setTimeout(doCheck, 250)
    }
  }
  function addVariant() {
    setForm(f => ({ ...f, variants: [...f.variants, { sku: '', label: '', price_cents: 0, in_stock: 0, is_active: true }] }))
  }
  function removeVariant(idx: number) {
    setForm(f => ({ ...f, variants: f.variants.filter((_, i) => i !== idx) }))
  }
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!slugAvailable) return alert('Slug no disponible')
    for (let i = 0; i < form.variants.length; i++) {
      if (skuAvailable[i] === false) return alert(`SKU repetido en variante ${i + 1}`)
    }
    await upsertAdminProductUseCase.execute({
      product: { id: form.id, slug: form.slug, name: form.name, type: form.type, is_active: form.is_active, images: form.images },
      variants: form.variants,
    })
    setFormOpen(false)
    await load()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Productos</h1>
        <button onClick={startCreate} className="px-3 py-2 rounded bg-white text-black">Nuevo</button>
      </div>

      {error && <div className="text-red-400">{error}</div>}
      {loading ? (
        <div className="text-white/70">Cargando…</div>
      ) : (
        <div className="overflow-x-auto border border-white/10 rounded">
          <table className="min-w-full text-sm">
            <thead className="bg-white/5 text-left">
              <tr>
                <th className="p-2">Nombre</th>
                <th className="p-2">Slug</th>
                <th className="p-2">Tipo</th>
                <th className="p-2">Variantes</th>
                <th className="p-2">Estado</th>
                <th className="p-2 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {items.map(p => (
                <tr key={p.id} className="border-t border-white/10">
                  <td className="p-2">{p.name}</td>
                  <td className="p-2 text-white/70">{p.slug}</td>
                  <td className="p-2 text-white/70">{p.type}</td>
                  <td className="p-2 text-white/70">{p.variants.length}</td>
                  <td className="p-2">{p.is_active ? 'Activo' : 'Inactivo'}</td>
                  <td className="p-2 text-right space-x-2">
                    <button onClick={() => startEdit(p)} className="px-2 py-1 rounded bg-white text-black">Editar</button>
                    <button onClick={() => remove(p.id)} className="px-2 py-1 rounded bg-red-500 text-white">Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {formOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4">
          <form onSubmit={onSubmit} className="bg-ch-black border border-white/10 rounded p-4 w-full max-w-3xl space-y-4">
            <div className="text-lg font-semibold">{form.id ? 'Editar' : 'Nuevo'} producto</div>
            <div className="grid grid-cols-2 gap-3">
              <label className="space-y-1">
                <span className="text-xs text-white/70">Nombre</span>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full px-2 py-1 rounded bg-white/10" required />
              </label>
              <div className="text-xs">
                {!slugAvailable && <span className="text-red-400">Slug no disponible</span>}
              </div>
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
                <input type="checkbox" checked={form.is_active} onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))} />
                <span>Activo</span>
              </label>
            </div>

            <div className="space-y-2">
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
              <div className="flex items-center justify-between">
                <div className="font-medium">Variantes</div>
                <button type="button" onClick={addVariant} className="px-2 py-1 rounded bg-white text-black">Agregar variante</button>
              </div>
              <div className="space-y-2">
                {form.variants.map((v, idx) => (
                  <div key={idx} className="grid grid-cols-6 gap-2 items-end border border-white/10 p-2 rounded">
                    <label className="space-y-1 col-span-2">
                      <span className="text-xs text-white/70">SKU</span>
                      <input value={v.sku} onChange={e => updateVariant(idx, { sku: e.target.value })} className="w-full px-2 py-1 rounded bg-white/10" required />
                    </label>
                    <div className="col-span-2 text-xs">
                      {skuAvailable[idx] === false && <span className="text-red-400">SKU no disponible</span>}
                    </div>
                    <label className="space-y-1 col-span-2">
                      <span className="text-xs text-white/70">Etiqueta</span>
                      <input value={v.label} onChange={e => updateVariant(idx, { label: e.target.value })} className="w-full px-2 py-1 rounded bg-white/10" required />
                    </label>
                    <label className="space-y-1">
                      <span className="text-xs text-white/70">Precio (cents)</span>
                      <input type="number" value={v.price_cents} onChange={e => updateVariant(idx, { price_cents: Number(e.target.value) })} className="w-full px-2 py-1 rounded bg-white/10" required />
                    </label>
                    <label className="space-y-1">
                      <span className="text-xs text-white/70">Stock</span>
                      <input type="number" value={v.in_stock} onChange={e => updateVariant(idx, { in_stock: Number(e.target.value) })} className="w-full px-2 py-1 rounded bg-white/10" required />
                    </label>
                    <div className="flex items-center gap-2 col-span-6">
                      <input type="checkbox" checked={v.is_active} onChange={e => updateVariant(idx, { is_active: e.target.checked })} />
                      <span className="text-sm">Activo</span>
                      <button type="button" onClick={() => removeVariant(idx)} className="ml-auto px-2 py-1 rounded bg-red-500 text-white">Quitar</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button type="button" onClick={() => setFormOpen(false)} className="px-3 py-2 rounded border border-white/20">Cancelar</button>
              <button type="submit" className="px-3 py-2 rounded bg-white text-black">Guardar</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}


