# CH+ Store (React + Supabase + Mercado Pago)

Aplicación de e‑commerce para suplementos (creatina/proteína) con carrito, checkout y pago por Mercado Pago vía Supabase Edge Functions.

## Requisitos

- Node 18+
- Cuenta y proyecto en Supabase
- Credenciales de Mercado Pago (Access Token)

## Variables de entorno

Crear un archivo `.env` con las siguientes claves (ver `.env.example`):

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_FUNCTIONS_BASE_URL= # opcional; si no, usa <VITE_SUPABASE_URL>/functions/v1
VITE_FUNCTIONS_URL=      # si usas un proxy local para order-status
```

En Supabase (Functions → Secrets):

- `SUPABASE_URL`
- `SERVICE_ROLE_KEY`
- `MP_ACCESS_TOKEN`
- `FRONTEND_BASE_URL` (ej. https://midominio.com)
- `SHIPPING_CENTS_DEFAULT` (opcional)
- `FREE_SHIPPING_THRESHOLD_CENTS` (opcional)
- `MP_WEBHOOK_TOKEN` (opcional)

## Scripts

```
npm install
npm run dev
npm run build
```

## Estructura

- `src/app`: rutas y providers
- `src/context/CartContext.tsx`: estado global del carrito (persistencia en localStorage)
- `src/services`: API de catálogo, órdenes y preferencia de pago
- `src/pages`: Home, Products, ProductDetail, Checkout, Payment, Processing, Confirmation
- `supabase/functions`: Edge Functions (`create-preference`, `mp-webhook`, `order-status`)

## Flujo de pago (Mercado Pago)

1) En `Payment.tsx`, se arma el payload con `variant_id` + `quantity`, el email del cliente y `couponCode` (si existe)
2) `createPreference` llama a la función `create-preference`
3) Se crea la orden en DB, se registra `PENDING` en `payments` y se crea la preferencia en MP
4) El usuario es redirigido a MP (init_point)
5) MP notifica al webhook `mp-webhook` que, al aprobarse, marca `payments` como `PAID`, descuenta inventario por RPC y actualiza la orden a `PAID`
6) `Confirmation.tsx` consulta `order-status` haciendo polling hasta ver el estado actualizado

## Notas de implementación

- El carrito usa una clave estable por item: `variant_id` si existe, si no `id:<id>`; evita duplicados y asegura `setQty/remove` correctos
- `ProductCard` y `ProductDetail` envían `variant_id` al carrito para compatibilidad con el flujo de pago
- `CatalogAdapter` mapea `CatalogProduct` (DB) → `Product` (UI)

## Desarrollo local

1) Configura `.env` y Secrets de Functions
2) Ejecuta `npm run dev`
3) Despliega Edge Functions con `supabase functions deploy` y define secrets


