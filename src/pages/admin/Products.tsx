import React from 'react'
import type { AdminProduct } from '../../data/entities/admin'
import Modal from '../../components/ui/Modal'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import ProductForm, { type ProductFormState } from './ProductForm'
import { useToast } from '../../context/ToastContext'
import ProductsView from './ProductsView'
import { useAdminProducts } from '../../hooks/useAdminProducts'

type FormState = ProductFormState

export default function Products() {
  const { showToast } = useToast()
  const admin = useAdminProducts()
  const [formOpen, setFormOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<FormState | null>(null)
  const [confirmDelete, setConfirmDelete] = React.useState<{ open: boolean; id?: string; name?: string }>({ open: false })


  function startCreate() {
    setEditing({ slug: '', name: '', type: 'creatine', is_active: true, is_featured: false, images: [], features: [], ingredients: [], nutrition_facts: {}, currency: 'COP', hasVariants: false, default_stock: 0, variants: [] })
    setFormOpen(true)
  }
  function startEdit(p: AdminProduct) {
    const next: FormState = {
      id: p.id,
      slug: p.slug,
      name: p.name,
      type: p.type,
      is_active: p.is_active,
      is_featured: !!p.is_featured,
      description: (p as any).description ?? '',
      long_description: (p as any).long_description ?? '',
      features: Array.isArray((p as any).features) ? ((p as any).features as string[]) : [],
      ingredients: Array.isArray((p as any).ingredients) ? ((p as any).ingredients as string[]) : [],
      nutrition_facts: (p as any).nutrition_facts ?? {},
      price_cents: (p as any).price_cents ?? undefined,
      compare_at_price_cents: (p as any).compare_at_price_cents ?? undefined,
      currency: (p as any).currency ?? 'COP',
      images: Array.isArray(p.images) ? (p.images as string[]) : [],
      hasVariants: (p.variants || []).length > 1 ? true : (((p.variants || [])[0]?.label || '').toLowerCase() !== 'default' && (p.variants || []).length > 0),
      default_stock: (p.variants || []).length > 0 ? (p.variants || [])[0].in_stock : 0,
      variants: p.variants.map(v => ({ id: v.id, sku: v.sku, label: v.label, price_cents: v.price_cents, compare_at_price_cents: (v as any).compare_at_price_cents ?? undefined, currency: (v as any).currency ?? 'COP', in_stock: v.in_stock, is_active: v.is_active })),
    }
    setEditing(next)
    setFormOpen(true)
  }
  async function remove(id: string) {
    try {
      await admin.deleteById(id)
      showToast('Producto eliminado', { type: 'success' })
    } catch (e: any) {
      showToast(e?.message || 'No se pudo eliminar', { type: 'error' })
    }
  }

  // El formulario maneja sus propios estados internos y helpers

  return (
    <div className="space-y-4">
      <ProductsView
        loading={admin.loading}
        error={admin.error}
        items={admin.filteredItems}
        filterType={admin.filterType}
        setFilterType={admin.setFilterType}
        filterStatus={admin.filterStatus}
        setFilterStatus={admin.setFilterStatus}
        onCreate={startCreate}
        onEdit={startEdit}
        onAskDelete={(p: AdminProduct) => setConfirmDelete({ open: true, id: p.id, name: p.name })}
      />
      <Modal open={formOpen} title={editing?.id ? 'Editar producto' : 'Nuevo producto'} onClose={() => setFormOpen(false)}>
        <ProductForm
          initial={editing || undefined}
          onCancel={() => setFormOpen(false)}
          onSaved={async () => {
            setFormOpen(false)
            setEditing(null)
            await admin.reload()
          }}
        />
      </Modal>

      <ConfirmDialog
        open={confirmDelete.open}
        title="Eliminar producto"
        description={`¿Eliminar "${confirmDelete.name}"? Esta acción no se puede deshacer.`}
        variant="danger"
        onCancel={() => setConfirmDelete({ open: false })}
        onConfirm={async () => {
          const id = confirmDelete.id!
          setConfirmDelete({ open: false })
          await remove(id)
        }}
      />
    </div>
  )
}


