import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

function generateSessionToken(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { passphrase } = await req.json()

    if (!passphrase || typeof passphrase !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Passphrase required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const adminPassphrase = Deno.env.get('ADMIN_PASSPHRASE')
    
    if (!adminPassphrase) {
      console.error('ADMIN_PASSPHRASE not configured')
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (passphrase !== adminPassphrase) {
      return new Response(
        JSON.stringify({ error: 'Invalid passphrase' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Generate session token and expiry (24 hours)
    const sessionToken = generateSessionToken()
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()

    // Use service role to insert session
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    const { error } = await supabase
      .from('admin_sessions')
      .insert({ session_token: sessionToken, expires_at: expiresAt })

    if (error) {
      console.error('Failed to create session:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to create session' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ sessionToken, expiresAt }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    console.error('Error:', err)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
