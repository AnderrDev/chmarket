// =============================================
// src/pages/Processing.tsx
// =============================================
export default function Processing() {
  const steps = ['Validando información...','Procesando pago con MercadoPago...','Confirmando transacción...','Generando orden...']
  return (
    <div className="min-h-[60vh] grid place-items-center">
      <div className="bg-ch-dark-gray rounded-2xl p-8 border border-ch-gray/20 text-center max-w-md w-full">
        <div className="animate-spin w-16 h-16 border-4 border-ch-gray/30 border-t-ch-primary rounded-full mx-auto mb-6"></div>
        <h2 className="text-2xl text-white mb-2">Procesando Pago</h2>
        <p className="text-ch-primary">{steps[0]}</p>
      </div>
    </div>
  )
}
