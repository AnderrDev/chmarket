import React from 'react'
import { useAdminContent } from '../../hooks/useAdminContent'
import { useToast } from '../../context/ToastContext'

export default function Content() {
  const { showToast } = useToast()
  // Ejemplo: bloque de contenido para home (hero, faqs, etc.)
  const hero = useAdminContent('home:hero')
  const faqs = useAdminContent('home:faqs')

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Contenido</h1>

      <section className="space-y-3 border border-white/10 rounded p-4">
        <div className="text-lg font-semibold">Home — Hero</div>
        {hero.error && <div className="text-red-400 text-sm">{hero.error}</div>}
        {hero.loading ? (
          <div className="text-white/70">Cargando…</div>
        ) : (
          <div className="space-y-2">
            <label className="space-y-1 block">
              <span className="text-xs text-white/70">Título</span>
              <input value={(hero.data.title as string) || ''} onChange={e => hero.setData({ ...hero.data, title: e.target.value })} className="w-full px-2 py-1 rounded bg-white/10" />
            </label>
            <label className="space-y-1 block">
              <span className="text-xs text-white/70">Texto</span>
              <textarea value={(hero.data.text as string) || ''} onChange={e => hero.setData({ ...hero.data, text: e.target.value })} className="w-full px-2 py-1 rounded bg-white/10 min-h-24" />
            </label>
            <div className="flex items-center justify-end">
              <button onClick={async () => { await hero.save(hero.data); showToast('Hero guardado', { type: 'success' }) }} disabled={hero.saving} className="px-3 py-2 rounded bg-white text-black disabled:opacity-60">{hero.saving ? 'Guardando…' : 'Guardar'}</button>
            </div>
          </div>
        )}
      </section>

      <section className="space-y-3 border border-white/10 rounded p-4">
        <div className="text-lg font-semibold">Home — FAQs</div>
        {faqs.error && <div className="text-red-400 text-sm">{faqs.error}</div>}
        {faqs.loading ? (
          <div className="text-white/70">Cargando…</div>
        ) : (
          <div className="space-y-2">
            <div className="space-y-2">
              {Array.isArray(faqs.data.items) && (faqs.data.items as any[]).length > 0 ? (
                (faqs.data.items as any[]).map((it, idx) => (
                  <div key={idx} className="grid grid-cols-2 gap-2">
                    <input value={it.q || ''} onChange={e => {
                      const next = [...(faqs.data.items as any[] || [])]
                      next[idx] = { ...next[idx], q: e.target.value }
                      faqs.setData({ ...faqs.data, items: next })
                    }} className="px-2 py-1 rounded bg-white/10" placeholder="Pregunta" />
                    <input value={it.a || ''} onChange={e => {
                      const next = [...(faqs.data.items as any[] || [])]
                      next[idx] = { ...next[idx], a: e.target.value }
                      faqs.setData({ ...faqs.data, items: next })
                    }} className="px-2 py-1 rounded bg-white/10" placeholder="Respuesta" />
                  </div>
                ))
              ) : (
                <div className="text-white/60 text-sm">Sin FAQs</div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => {
                const cur = Array.isArray(faqs.data.items) ? (faqs.data.items as any[]) : []
                faqs.setData({ ...faqs.data, items: [...cur, { q: '', a: '' }] })
              }} className="px-2 py-1 rounded border border-white/20">Agregar</button>
              <button onClick={async () => { await faqs.save(faqs.data); showToast('FAQs guardadas', { type: 'success' }) }} disabled={faqs.saving} className="ml-auto px-3 py-2 rounded bg-white text-black disabled:opacity-60">{faqs.saving ? 'Guardando…' : 'Guardar'}</button>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}


