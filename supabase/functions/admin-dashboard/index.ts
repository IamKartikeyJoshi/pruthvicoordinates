import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-admin-token',
}

async function verifyAdminSession(supabase: any, sessionToken: string): Promise<boolean> {
  if (!sessionToken) return false
  const { data, error } = await supabase
    .from('admin_sessions')
    .select('expires_at')
    .eq('session_token', sessionToken)
    .single()
  if (error || !data) return false
  return new Date(data.expires_at) > new Date()
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  const sessionToken = req.headers.get('x-admin-token')
  if (!sessionToken || !(await verifyAdminSession(supabase, sessionToken))) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const url = new URL(req.url)
  const table = url.searchParams.get('table')
  const action = url.searchParams.get('action')
  const body = await req.json().catch(() => ({}))

  const validTables: Record<string, string> = {
    expenses: 'admin_expenses',
    checklist: 'admin_checklist',
    todos: 'admin_todos',
    notes: 'admin_notes',
    calendar: 'admin_calendar_events',
  }

  const dbTable = validTables[table || '']
  if (!dbTable) {
    return new Response(JSON.stringify({ error: 'Invalid table' }), {
      status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const jsonResponse = (data: any, status = 200) =>
    new Response(JSON.stringify(data), {
      status, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  // LIST
  if (action === 'list') {
    let query = supabase.from(dbTable).select('*')
    if (table === 'expenses') query = query.order('expense_date', { ascending: false })
    else if (table === 'calendar') query = query.order('start_date', { ascending: true })
    else query = query.order('order_index', { ascending: true }).order('created_at', { ascending: false })

    const { data, error } = await query
    if (error) return jsonResponse({ error: 'Failed to fetch' }, 500)
    return jsonResponse({ items: data || [] })
  }

  // CREATE
  if (action === 'create') {
    const { data, error } = await supabase.from(dbTable).insert(body.item).select().single()
    if (error) return jsonResponse({ error: 'Failed to create: ' + error.message }, 500)
    return jsonResponse({ item: data })
  }

  // UPDATE
  if (action === 'update') {
    const { id, ...updates } = body
    const { data, error } = await supabase.from(dbTable).update(updates).eq('id', id).select().single()
    if (error) return jsonResponse({ error: 'Failed to update: ' + error.message }, 500)
    return jsonResponse({ item: data })
  }

  // DELETE
  if (action === 'delete') {
    const { error } = await supabase.from(dbTable).delete().eq('id', body.id)
    if (error) return jsonResponse({ error: 'Failed to delete' }, 500)
    return jsonResponse({ success: true })
  }

  return jsonResponse({ error: 'Invalid action' }, 400)
})
