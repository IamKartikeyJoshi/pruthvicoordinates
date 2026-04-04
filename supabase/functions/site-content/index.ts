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

  const url = new URL(req.url)
  const page = url.searchParams.get('page')

  // PUBLIC GET - read content for a page
  if (req.method === 'GET') {
    if (!page) {
      return new Response(
        JSON.stringify({ error: 'Page parameter required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { data, error } = await supabase
      .from('site_content')
      .select('*')
      .eq('page', page)
      .order('order_index', { ascending: true })

    if (error) {
      return new Response(
        JSON.stringify({ error: 'Failed to fetch content' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ content: data }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  // ADMIN operations require session
  const sessionToken = req.headers.get('x-admin-token')
  if (!sessionToken || !(await verifyAdminSession(supabase, sessionToken))) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized' }),
      { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  const body = await req.json()
  const action = url.searchParams.get('action')

  // LIST all content for a page (admin)
  if (action === 'list') {
    const { data, error } = await supabase
      .from('site_content')
      .select('*')
      .eq('page', body.page || page)
      .order('order_index', { ascending: true })

    return new Response(
      JSON.stringify({ content: data || [] }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  // CREATE content
  if (action === 'create') {
    const { data, error } = await supabase
      .from('site_content')
      .insert({
        page: body.page,
        section_key: body.section_key,
        content: body.content,
        order_index: body.order_index || 0,
      })
      .select()
      .single()

    if (error) {
      return new Response(
        JSON.stringify({ error: 'Failed to create content' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ item: data }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  // UPDATE content
  if (action === 'update') {
    const { id, ...updates } = body
    const { data, error } = await supabase
      .from('site_content')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return new Response(
        JSON.stringify({ error: 'Failed to update content' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ item: data }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  // DELETE content
  if (action === 'delete') {
    const { error } = await supabase
      .from('site_content')
      .delete()
      .eq('id', body.id)

    if (error) {
      return new Response(
        JSON.stringify({ error: 'Failed to delete content' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  // REORDER content
  if (action === 'reorder') {
    const { items } = body // Array of { id, order_index }
    for (const item of items) {
      await supabase
        .from('site_content')
        .update({ order_index: item.order_index })
        .eq('id', item.id)
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  // BULK SAVE - replace all content for a page
  if (action === 'bulk-save') {
    const { page: targetPage, items } = body

    // Delete existing content for this page
    await supabase
      .from('site_content')
      .delete()
      .eq('page', targetPage)

    // Insert new content
    if (items && items.length > 0) {
      const { error } = await supabase
        .from('site_content')
        .insert(items.map((item: any, index: number) => ({
          page: targetPage,
          section_key: item.section_key,
          content: item.content,
          order_index: index,
        })))

      if (error) {
        return new Response(
          JSON.stringify({ error: 'Failed to save content' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }

  return new Response(
    JSON.stringify({ error: 'Invalid action' }),
    { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
})
