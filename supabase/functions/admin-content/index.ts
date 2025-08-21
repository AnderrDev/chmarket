import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SERVICE_ROLE_KEY")!;

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

type Payload = { key: string; data: Record<string, unknown> }

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return cors({ ok: true });
  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
  try {
    const url = new URL(req.url)
    const key = url.searchParams.get('key')
    if (req.method === 'GET') {
      if (!key) return cors({ error: 'key required' }, 400)
      const { data, error } = await supabase.from('content_blocks').select('*').eq('key', key).maybeSingle()
      if (error) throw error
      return cors({ key, data: data?.data ?? {} })
    }
    if (req.method === 'POST') {
      const body = await req.json().catch(() => ({})) as Payload
      if (!body?.key) return cors({ error: 'key required' }, 400)
      const { error } = await supabase.from('content_blocks').upsert({ key: body.key, data: body.data, updated_at: new Date().toISOString() })
      if (error) throw error
      return cors({ ok: true })
    }
    return cors({ error: 'method not allowed' }, 405)
  } catch (e) {
    return cors({ error: String(e) }, 400)
  }
})


