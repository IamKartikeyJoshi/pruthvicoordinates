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

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    const sessionToken = req.headers.get('x-admin-token')
    
    if (!sessionToken) {
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const isValid = await verifyAdminSession(supabase, sessionToken)
    
    if (!isValid) {
      return new Response(
        JSON.stringify({ error: 'Invalid or expired session' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const url = new URL(req.url)
    const action = url.searchParams.get('action')

    // LIST all requests
    if (req.method === 'GET' || action === 'list') {
      const { data, error } = await supabase
        .from('requests')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        return new Response(
          JSON.stringify({ error: 'Failed to fetch requests' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      return new Response(
        JSON.stringify({ requests: data }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const body = await req.json()

    // UPDATE a request
    if (action === 'update') {
      const { id, updates } = body

      if (!id || !updates) {
        return new Response(
          JSON.stringify({ error: 'ID and updates required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const { data, error } = await supabase
        .from('requests')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        return new Response(
          JSON.stringify({ error: 'Failed to update request' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      return new Response(
        JSON.stringify({ request: data }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // DELETE a request (also frees up the time slot)
    if (action === 'delete') {
      const { id } = body

      if (!id) {
        return new Response(
          JSON.stringify({ error: 'ID required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const { error } = await supabase
        .from('requests')
        .delete()
        .eq('id', id)

      if (error) {
        return new Response(
          JSON.stringify({ error: 'Failed to delete request' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // RESCHEDULE (admin - no restrictions)
    if (action === 'reschedule') {
      const { id, newDate, newTime } = body

      if (!id || !newDate || !newTime) {
        return new Response(
          JSON.stringify({ error: 'id, newDate, and newTime required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Check if slot is available (exclude current request)
      const { data: existing } = await supabase
        .from('requests')
        .select('id')
        .eq('type', 'appointment')
        .eq('appointment_date', newDate)
        .eq('appointment_time', newTime)
        .neq('status', 'cancelled')
        .neq('id', id)

      if (existing && existing.length > 0) {
        return new Response(
          JSON.stringify({ error: 'Time slot already booked' }),
          { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const { data, error } = await supabase
        .from('requests')
        .update({ appointment_date: newDate, appointment_time: newTime })
        .eq('id', id)
        .select()
        .single()

      if (error) {
        return new Response(
          JSON.stringify({ error: 'Failed to reschedule' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      return new Response(
        JSON.stringify({ request: data }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    console.error('Error:', err)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
