// admin-upload: sube imágenes al bucket de Storage y devuelve URL pública
// Payload: { fileName: string, contentType: string, dataBase64: string, folder?: string }

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SERVICE_ROLE_KEY")!;
const BUCKET = Deno.env.get("ADMIN_IMAGES_BUCKET") || 'product-images'

function cors(json: unknown, status = 200) {
  return new Response(JSON.stringify(json), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    },
  });
}

function decodeBase64(dataBase64: string): Uint8Array {
  const bin = atob(dataBase64)
  const arr = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i)
  return arr
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return cors({ ok: true })
  if (req.method !== 'POST') return cors({ error: 'method not allowed' }, 405)
  try {
    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)
    const body = await req.json().catch(() => null) as { fileName?: string; contentType?: string; dataBase64?: string; folder?: string } | null
    if (!body?.fileName || !body?.contentType || !body?.dataBase64) return cors({ error: 'Invalid payload' }, 400)

    const safeName = body.fileName.replace(/[^a-zA-Z0-9_.-]+/g, '_')
    const key = `${body.folder ? body.folder.replace(/\/+$/,'') + '/' : ''}${Date.now()}-${crypto.randomUUID()}-${safeName}`
    const bytes = decodeBase64(body.dataBase64)
    const { error: upErr } = await supabase.storage.from(BUCKET).upload(key, bytes, { contentType: body.contentType, upsert: false })
    if (upErr) throw upErr

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(key)
    return cors({ url: data.publicUrl, key })
  } catch (e) {
    return cors({ error: String(e) }, 400)
  }
})


